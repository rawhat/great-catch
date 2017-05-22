/* eslint-disable no-console */

const neo4j = require('neo4j-driver').v1;
const axios = require('axios');
const mailer = require('nodemailer');

const deterDataSize = require('./static/demonstration_items/StepCount_Stat')
    .deterDataSize;

const driver = new neo4j.driver(
    'bolt://localhost',
    neo4j.auth.basic('neo4j', 'neo4j')
);

async function main() {
    let session = driver.session();
    let results = await session.run(
        `MATCH (u:User) WITH u
        OPTIONAL MATCH (u)-[:TAKES]-(m:Medicine) WITH u, m
        RETURN u AS user, m AS drug;`
    );
    session.close();

    results.records.forEach(async result => {
        let user = result.get('user').properties;
        if (user.access_token) {
            let stepUrl =
                'https://api.fitbit.com/1/user/-/activities/steps/date/2017-01-12/30d.json';

            let heartRateUrl =
                'https://api.fitbit.com/1/user/-/activities/heart/date/2017-01-12/30d.json';

            let headers = {
                Authorization: `Bearer ${user.access_token}`,
            };

            let requestObject = axios.create({
                headers,
            });

            try {
                let stepData = await requestObject.get(stepUrl);
                let heartRateData = await requestObject.get(heartRateUrl);
                let data = {
                    stepCounts: stepData.data,
                    heartRates: heartRateData.data,
                };

                data.stepCounts = data.stepCounts['activities-steps']
                    .slice(-14)
                    .map(step => parseInt(step.value));

                data.heartRates = data.heartRates['activities-heart']
                    .slice(-14)
                    .map(
                        heart =>
                            (heart.value.restingHeartRate
                                ? parseInt(heart.value.restingHeartRate)
                                : 0)
                    );

                let stepStdDev = calculateStdDev(data.stepCounts);
                let heartStdDev = calculateStdDev(data.heartRates);

                let drug = 'N/A';
                if (result.get('drug')) {
                    drug = result.get('drug').properties.name;
                }

                let analysisData = {
                    steps: data.stepCounts,
                    heartRates: data.heartRates,
                    drug,
                    zip: user.zipCode,
                };

                let analysis = await deterDataSize(analysisData);

                let found = analysis.search('AND') !== -1;

                if (found) {
                    console.log(`sending email to ${user.email}`);
                    sendEmail(user.email, user.firstName, analysis);
                }

                try {
                    let session = driver.session();
                    await session.run(
                        `
                        MATCH (u:User)-[g:GENERATED]-(d:Data) WHERE u.username =~ '(?i)${user.username}'
                        DELETE g, d;
                    `,
                        { username: user.username }
                    );

                    await session.run(
                        `
                        MATCH (u:User) WHERE u.username =~ '(?i)${user.username}'
                        CREATE (u)-[:GENERATED]->(d:Data { stepCounts: [${data.stepCounts.join(', ')}], heartRates: [${data.heartRates.join(', ')}], stepCountStdDev: ${stepStdDev}, heartRateStdDev: ${heartStdDev} })
                        RETURN u, d;
                    `
                    );
                } catch (e) {
                    console.error(e);
                }
            } catch (e) {
                if (e.response) {
                    let { data } = e.response;
                    console.error(data);
                } else console.error(e.message);
            }
        }
    });
    console.log('done!');
}

async function sendEmail(email, firstName, data) {
    const gmailUser = 'CI491GreatCatch@gmail.com';

    let transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: 'helloWorld',
        },
    });

    let mailOptions = {
        from: gmailUser,
        to: email,
        subject: 'GreatCatch Activity Alert',
        html: `
            Hello, ${firstName}!
            <br><br>
            We are reaching out to notify you of some abnormal activity that we detected.  Our analysis has determined the following pieces of information:
            <br><br>
            ${data}
            <br><br>
            We are not doctors or physicians, and our advice is only intended as guidance.  Please reach out to your caretaker or physician if you feel
            that you may have a health issue.
            <br><br><br>
            Regards,
            <br><br>
            GreatCatch.com
        `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
        }
        console.log(`Message ${info.messageId} send: ${info.response}`);
    });
}

function calculateStdDev(values) {
    // step 1:  calculate mean
    let mean = values.reduce((sum, next) => sum + next, 0) / values.length;

    // step 2:  for each value, do -> (value - mean) squared
    let diffSquared = values.map(value => (value - mean) ^ 2);

    // steps 3, 4: square root of mean of step 2
    return Math.sqrt(
        diffSquared.reduce((sum, next) => sum + next, 0) / diffSquared.length
    );
}

main();
