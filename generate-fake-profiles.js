var neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(
    'bolt://localhost',
    neo4j.auth.basic('neo4j', 'neo4j')
);

const usersWithData = [
    {
        _COMMENTS: 'NORMAL step, ABNORMAL heart rate w/ no reason',
        firstName: 'Alex',
        lastName: 'Manning',
        email: 'Alex.Manning@drexel.edu',
        emergencyContact: 'JohnManning@gmail.com',
        occupation: 'Full-Stack Programmer',
        steps: [
            1139,
            1400,
            1211,
            1310,
            1499,
            1257,
            1510,
            1303,
            1215,
            1244,
            1550,
            1220,
            1120,
            1220,
            1200,
        ],
        stepSTD: 137.99,
        heartRates: [
            69,
            68,
            68,
            72,
            70,
            69,
            68,
            69,
            71,
            72,
            69,
            68,
            68,
            69,
            71,
        ],
        heartRatesSTD: 1.44,
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
            'Day 15',
        ],
        drug: 'N/A',
        zip: 19104,
        alerts: [
            {
                priority: 'medium',
                date: new Date().setDate(new Date().getDate() - 3),
                contact: 'JohnManning@gmail.com',
                message: `<div>Step Count has been determined ABNORMAL using mean absolute deviation (MAD).<br>
                    - Your new MAD value is less than or equal to old MAD.<br>
                    <br><br>
                    Heart Rates has been determined NORMAL using mean absolute deviation (MAD).<br>
                    - Your new MAD value is greater than old MAD</div>`,
            },
        ],
    },
    {
        _COMMENTS: 'ABNORMAL step w/ drug (letairis: pulmonary arterial hypertension drug that cause fatigue), NORMAL heart rate.',
        firstName: 'Wenyu',
        lastName: 'Xin',
        email: 'wx28@drexel.edu',
        emergencyContact: 'tq28@drexel.edu',
        occupation: 'BS/MS Students',
        steps: [
            3501,
            3621,
            2980,
            3049,
            3300,
            3409,
            3489,
            3390,
            3449,
            3509,
            3399,
            3479,
            3469,
            3519,
            2000,
        ],
        stepSTD: 178.91,
        heartRates: [
            50,
            55,
            53,
            49,
            57,
            51,
            55,
            54,
            58,
            49,
            53,
            52,
            55,
            52,
            51,
        ],
        heartRatesSTD: 2.78,
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
            'Day 15',
        ],
        drug: 'LETAIRIS',
        zip: 19104,
    },
    {
        _COMMENTS: 'NORMAL steps, NORMAL heart rate.',
        firstName: 'Yupeng',
        lastName: 'Sun',
        email: 'Yupeng.Sun@drexel.edu',
        emergencyContact: 'BobSun@gmail.com',
        occupation: 'Trainning for Broad Street Marathon',
        steps: [
            4000,
            4200,
            4100,
            3992,
            4400,
            5100,
            4905,
            4899,
            5029,
            4910,
            4828,
            4999,
            5001,
            5689,
            5717,
        ],
        stepSTD: 500.40,
        heartRates: [
            50,
            55,
            54,
            53,
            52,
            55,
            53,
            54,
            55,
            55,
            56,
            53,
            54,
            53,
            54,
        ],
        heartRatesSTD: 1.54,
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
            'Day 15',
        ],
        drug: 'N/A',
        zip: 19104,
    },
    {
        // _COMMENTS: 'ABNORMAL step w/ weather, NORMAL heart rate, REMEMBER TO CHANGE THE ZIPCODE TO SOMEWHERE IT RAINS',
        firstName: 'Tianze',
        lastName: 'Bai',
        email: 'Tianze.Bai@drexel.edu',
        emergencyContact: 'EllenJohnson@yahoo.com',
        occupation: 'Retired Veteran',
        steps: [
            1139,
            1400,
            1211,
            1310,
            1499,
            1257,
            1510,
            1303,
            1215,
            1244,
            1550,
            1220,
            1120,
            1220,
            1000,
        ],
        _COMMENTS: 'ABNORMAL step w/ weather issue, NORMAL heart rate.',
        stepSTD: 137.99,
        heartRates: [
            72,
            68,
            68,
            72,
            70,
            69,
            68,
            69,
            71,
            72,
            69,
            68,
            68,
            69,
            71,
        ],
        heartRatesSTD: 1.61,
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
            'Day 15',
        ],
        drug: 'N/A',
        zip: 19104,
    },
    {
        _COMMENTS: 'ABNORMAL step w/ weather and drug, ABNORMAL heart rate w/ step and drug, prednisone is a steroid that treat many diseases, focus on inflammation',
        firstName: 'Daniel',
        lastName: 'Grayson',
        email: 'Daniel.Grayson@drexel.edu',
        emergencyContact: 'TinnaWang@aol.com',
        occupation: '90 Years Old Man',
        steps: [
            1139,
            1400,
            1211,
            1310,
            1499,
            1257,
            1510,
            1303,
            1215,
            1244,
            1550,
            1220,
            1120,
            1220,
            1000,
        ],
        stepSTD: 137.99,
        heartRates: [
            72,
            68,
            68,
            72,
            70,
            69,
            68,
            69,
            71,
            72,
            69,
            68,
            68,
            69,
            73,
        ],
        heartRatesSTD: 1.61,
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
            'Day 15',
        ],
        drug: 'prednisone',
        zip: 50002,
    },
];

const data = {
    case1: {
        steps: [1000],
        heartRates: [70],
        date: ['Day 1'],
        drug: 'N/A',
        zip: 19104,
    },
    case2: {
        steps: [1000, 1000, 1000, 1000],
        heartRates: [60, 60, 60, 60],
        date: ['Day 1', 'Day 2', 'Day 3', 'Day 4'],
        drug: 'N/A',
        zip: 19104,
    },
    case3: {
        steps: [
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
        ],
        heartRates: [
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
        ],
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
        ],
        drug: 'N/A',
        zip: 19104,
    },
    case4: {
        steps: [
            1000,
            1100,
            1200,
            1300,
            1400,
            1500,
            1600,
            1700,
            1800,
            1900,
            2000,
            2100,
            2200,
            2300,
            2400,
        ],
        heartRates: [
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
        ],
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
        ],
        drug: 'N/A',
        zip: 19104,
    },
    case5: {
        steps: [
            1000,
            1100,
            1200,
            1300,
            1400,
            1500,
            1600,
            1700,
            1800,
            1900,
            2000,
            2100,
            2200,
            2300,
            1000,
        ],
        heartRates: [
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
        ],
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
        ],
        drug: 'LETAIRIS',
        zip: 19104,
    },
    case6: {
        steps: [
            1000,
            1100,
            1200,
            1300,
            1400,
            1500,
            1600,
            1700,
            1800,
            1900,
            2000,
            2100,
            2200,
            2300,
            1000,
        ],
        heartRates: [
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
        ],
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
        ],
        drug: 'N/A',
        zip: 98104,
    },
    case7: {
        steps: [
            1000,
            1100,
            1200,
            1300,
            1400,
            1500,
            1600,
            1700,
            1800,
            1900,
            2000,
            2100,
            2200,
            2300,
            1000,
        ],
        heartRates: [
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
        ],
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
        ],
        drug: 'LETAIRIS',
        zip: 98104,
    },
    case8: {
        steps: [
            1000,
            1100,
            1200,
            1300,
            1400,
            1500,
            1600,
            1700,
            1800,
            1900,
            2000,
            2100,
            2200,
            2300,
            1000,
        ],
        heartRates: [
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
        ],
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
        ],
        drug: 'Ritalin',
        zip: 19104,
    },
    case9: {
        steps: [
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            500,
        ],
        heartRates: [
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            100,
        ],
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
        ],
        drug: 'N/A',
        zip: 19104,
    },
    case10: {
        steps: [
            1000,
            1100,
            1200,
            1300,
            1400,
            1500,
            1600,
            1700,
            1800,
            1900,
            2000,
            2100,
            2200,
            2300,
            2400,
        ],
        heartRates: [
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            100,
        ],
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
        ],
        drug: 'prednisone',
        zip: 19104,
    },
    case11: {
        steps: [
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            500,
        ],
        heartRates: [
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            100,
        ],
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
        ],
        drug: 'prednisone',
        zip: 19104,
    },
    case12: {
        steps: [
            1000,
            1100,
            1200,
            1300,
            1400,
            1500,
            1600,
            1700,
            1800,
            1900,
            2000,
            2100,
            2200,
            2300,
            2400,
        ],
        heartRates: [
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            100,
        ],
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
        ],
        drug: 'Piroxicam',
        zip: 19104,
    },
    case13: {
        steps: [
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            1000,
            500,
        ],
        heartRates: [
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            60,
            100,
        ],
        date: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Day 7',
            'Day 8',
            'Day 9',
            'Day 10',
            'Day 11',
            'Day 12',
            'Day 13',
            'Day 14',
        ],
        drug: 'prednisone',
        zip: 98104,
    },
};

const users = {
    user1: {
        username: 'john.smith',
        firstName: 'john',
        lastName: 'smith',
        email: 'john.smith@gmail.com',
        password: 'password',
        zipCode: 19104,
        caretakers: [
            {
                role: 'son',
                email: 'bill.smith@gmail.com',
                phone: null,
            },
        ],
    },
    user2: {
        username: 'blue.orangutan',
        firstName: 'abby',
        lastName: 'monroe',
        email: 'abby.monroe@gmail.com',
        password: 'password',
        zipCode: 19104,
        caretakers: [
            {
                role: 'cousin',
                email: 'diane.callahan@gmail.com',
                phone: null,
            },
        ],
    },
    user3: {
        username: 'berenstein.bear',
        firstName: 'donald',
        lastName: 'drumpf',
        email: 'donald.drumpf@whitehouse.gov',
        password: 'password',
        zipCode: 19104,
        caretakers: [
            {
                role: 'daughter',
                email: 'ivanka.drumpf@gmail.com',
                phone: null,
            },
        ],
    },
    user4: {
        username: 'feedmechikin',
        firstName: 'harold',
        lastName: 'geraldo',
        email: 'harold.geraldo@gmail.com',
        password: 'password',
        zipCode: 19104,
        caretakers: [
            {
                role: 'friend',
                email: 'not1person@gmail.com',
                phone: null,
            },
        ],
    },
    user5: {
        username: 'bettywhite1',
        firstName: 'betty',
        lastName: 'white',
        email: 'betty.white1@gmail.com',
        password: 'password',
        zipCode: 19104,
        caretakers: [
            {
                role: 'nurse',
                email: 'buddy.brown@gmail.com',
                phone: null,
            },
        ],
    },
    user6: {
        username: 'finglonger',
        firstName: 'hubert',
        lastName: 'farnsworth',
        email: 'mad.scientist@planetexpress.com',
        password: 'password',
        zipCode: 98104,
        caretakers: [
            {
                role: 'ex-wife',
                email: 'mom@moms.com',
                phone: null,
            },
        ],
    },
    user7: {
        username: 'fryolator',
        firstName: 'philip',
        lastName: 'fry',
        email: 'fry@planetexpress.com',
        password: 'password',
        zipCode: 98104,
        caretakers: [
            {
                role: 'dog',
                email: 'seymour@nyu.edu',
                phone: null,
            },
        ],
    },
    user8: {
        username: 'b.johnson',
        firstName: 'boris',
        lastName: 'johnson',
        email: 'bj@ukip.co.uk',
        password: 'password',
        zipCode: 19104,
        caretakers: [
            {
                role: 'mistress',
                email: 'queen.bee@westminster.co.uk',
                phone: null,
            },
        ],
    },
    user9: {
        username: 'no1leader',
        firstName: 'kim',
        lastName: 'il sung',
        email: 'glorious.leader@motherland.nk',
        password: 'password',
        zipCode: 19104,
        caretakers: [
            {
                role: 'poolboy',
                email: 'juan.carlos@fbi.gov',
                phone: null,
            },
        ],
    },
    user10: {
        username: 'putinontheritz',
        firstName: 'vladimir',
        lastName: 'putin',
        email: 'poutine@kremlin.ru',
        password: 'password',
        zipCode: 19104,
        caretakers: [
            {
                role: 'undertaker',
                email: 'trotskys.corpse@exile.mx',
                phone: null,
            },
        ],
    },
    user11: {
        username: 'colonel.sanders',
        firstName: 'colonel',
        lastName: 'sanders',
        email: 'the.colonel@kfc.com',
        password: 'password',
        zipCode: 19104,
        caretakers: [
            {
                role: 'neighbor',
                email: 'wendy@wendys.com',
                phone: null,
            },
        ],
    },
    user12: {
        username: 'hal9000',
        firstName: 'hal',
        lastName: '9000',
        email: 'hal@spaceodyssey.com',
        password: 'password',
        zipCode: 19104,
        caretakers: [
            {
                role: 'sister',
                email: 'helga@spacemeander.com',
                phone: null,
            },
        ],
    },
    user13: {
        username: 'arthur.dent',
        firstName: 'arthur',
        lastName: 'dent',
        email: 'adent@pub.co.uk',
        password: 'password',
        zipCode: 98104,
        caretakers: [
            {
                role: 'friend',
                email: 'ford.prefect@universe.uv',
                phone: null,
            },
        ],
    },
};

async function main() {
    try {
        await Promise.all(
            usersWithData.map(user => {
                let caretaker = {
                    email: user.emergencyContact,
                    role: 'Caretaker',
                };

                user = Object.assign({}, user, {
                    password: 'password',
                    username: user.email,
                    zipCode: user.zip,
                });

                let session = driver.session();
                let str = `
                    CREATE (u:User { username: {username}, firstName: {firstName}, lastName: {lastName}, email: {email}, password: {password}, zipCode: {zipCode} }) WITH u
                    CREATE (u)-[:HAS]->(c:Caretaker { role: "${caretaker.role}", email: "${caretaker.email}"${caretaker.phone ? `, phone: "${caretaker.phone}"` : ''} })
                    CREATE (u)-[:GENERATED]->(d:Data { stepCounts: [${user.steps.join(', ')}], heartRates: [${user.heartRates.join(', ')}], stepCountStdDev: ${user.stepSTD}, heartRateStdDev: ${user.heartRatesSTD} })
                    ${user.drug !== 'N/A' ? `CREATE (u)-[:TAKES]->(:Medicine { name: "${user.drug}", dosage: "lots", frequency: "often", additionalInstructions: [], sideEffects: []})` : ''}
                    ${user.alerts && user.alerts.length ? user.alerts
                          .map(
                              alert =>
                                  `CREATE (u)-[:TRIGGERED]->(a:Alert { date: "${new Date(alert.date).toLocaleString()}", priority: "${alert.priority}", contact: "${alert.contact}", message: "${alert.message}" })`
                          )
                          .join('\n') : ''}
                    RETURN u;
                `;
                return session.run(str, user);
            })
        );
        console.log('done');
    } catch (err) {
        console.error(err);
    }
}

main();
