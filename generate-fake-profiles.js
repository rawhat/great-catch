var neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'neo4j'));


const data = {
    case1: {
        "steps": [1000],
        "heartRates": [70],
        "date": ["Day 1"],
        "drug": "N/A",
        "zip": 19104
    },
    case2: {
        "steps": [1000, 1000, 1000, 1000],
        "heartRates": [60, 60, 60, 60],
        "date": ["Day 1", "Day 2", "Day 3", "Day 4"],
        "drug": "N/A",
        "zip": 19104
    },
    case3: {
        "steps": [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
        "heartRates": [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
        "date": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
        "drug": "N/A",
        "zip": 19104
    },
    case4: {
        "steps": [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400],
        "heartRates": [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
        "date": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
        "drug": "N/A",
        "zip": 19104
    },
    case5: {
        "steps": [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 1000],
        "heartRates": [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
        "date": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
        "drug": "LETAIRIS",
        "zip": 19104
    },
    case6: {
        "steps": [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 1000],
        "heartRates": [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
        "date": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
        "drug": "N/A",
        "zip": 98104
    },
    case7: {
        "steps": [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 1000],
        "heartRates": [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
        "date": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
        "drug": "LETAIRIS",
        "zip": 98104
    },
    case8: {
        "steps": [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 1000],
        "heartRates": [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
        "date": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
        "drug": "Ritalin",
        "zip": 19104
    },
    case9: {
        "steps": [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 500],
        "heartRates": [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 100],
        "date": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
        "drug": "N/A",
        "zip": 19104
    },
    case10: {
        "steps": [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400],
        "heartRates": [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 100],
        "date": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
        "drug": "prednisone",
        "zip": 19104
    },
    case11: {
        "steps": [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 500],
        "heartRates": [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 100],
        "date": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
        "drug": "prednisone",
        "zip": 19104
    },
    case12: {
        "steps": [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400],
        "heartRates": [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 100],
        "date": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
        "drug": "Piroxicam",
        "zip": 19104
    },
    case13: {
        "steps": [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 500],
        "heartRates": [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 100],
        "date": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
        "drug": "prednisone",
        "zip": 98104
    }
};

const users = {
    user1: {
        username: 'john.smith',
        firstName: 'john',
        lastName: 'smith',
        email: 'john.smith@gmail.com',
        password: 'password',
        zipCode: 19104,
        caretakers: [{
            role: 'son',
            email: 'bill.smith@gmail.com',
            phone: null
        }]
    },
    user2: {
        username: 'blue.orangutan',
        firstName: 'abby',
        lastName: 'monroe',
        email: 'abby.monroe@gmail.com',
        password: 'password',
        zipCode: 19104,
        caretakers: [{
            role: 'cousin',
            email: 'diane.callahan@gmail.com',
            phone: null
        }]
    },
    user3: {
        username: 'berenstein.bear',
        firstName: 'donald',
        lastName: 'drumpf',
        email: 'donald.drumpf@whitehouse.gov',
        password: 'password',
        zipCode: 19104,
        caretakers: [{
            role: 'daughter',
            email: 'ivanka.drumpf@gmail.com',
            phone: null
        }]
    },
    user4: {
        username: 'feedmechikin',
        firstName: 'harold',
        lastName: 'geraldo',
        email: 'harold.geraldo@gmail.com',
        password: 'password',
        zipCode: 19104,
        caretakers: [{
            role: 'friend',
            email: 'not1person@gmail.com',
            phone: null
        }]
    },
    user5: {
        username: 'bettywhite1',
        firstName: 'betty',
        lastName: 'white',
        email: 'betty.white1@gmail.com',
        password: 'password',
        zipCode: 19104,
        caretakers: [{
            role: 'nurse',
            email: 'buddy.brown@gmail.com',
            phone: null
        }]
    },
    user6: {
        username: 'finglonger',
        firstName: 'hubert',
        lastName: 'farnsworth',
        email: 'mad.scientist@planetexpress.com',
        password: 'password',
        zipCode: 98104,
        caretakers: [{
            role: 'ex-wife',
            email: 'mom@moms.com',
            phone: null
        }]
    },
    user7: {
        username: 'fryolator',
        firstName: 'philip',
        lastName: 'fry',
        email: 'fry@planetexpress.com',
        password: 'password',
        zipCode: 98104,
        caretakers: [{
            role: 'dog',
            email: 'seymour@nyu.edu',
            phone: null
        }]
    },
    user8: {
        username: 'b.johnson',
        firstName: 'boris',
        lastName: 'johnson',
        email: 'bj@ukip.co.uk',
        password: 'password',
        zipCode: 19104,
        caretakers: [{
            role: 'mistress',
            email: 'queen.bee@westminster.co.uk',
            phone: null
        }]
    },
    user9: {
        username: 'no1leader',
        firstName: 'kim',
        lastName: 'il sung',
        email: 'glorious.leader@motherland.nk',
        password: 'password',
        zipCode: 19104,
        caretakers: [{
            role: 'poolboy',
            email: 'juan.carlos@fbi.gov',
            phone: null
        }]
    },
    user10: {
        username: 'putinontheritz',
        firstName: 'vladimir',
        lastName: 'putin',
        email: 'poutine@kremlin.ru',
        password: 'password',
        zipCode: 19104,
        caretakers: [{
            role: 'undertaker',
            email: 'trotskys.corpse@exile.mx',
            phone: null
        }]
    },
    user11: {
        username: 'colonel.sanders',
        firstName: 'colonel',
        lastName: 'sanders',
        email: 'the.colonel@kfc.com',
        password: 'password',
        zipCode: 19104,
        caretakers: [{
            role: 'neighbor',
            email: 'wendy@wendys.com',
            phone: null
        }]
    },
    user12: {
        username: 'hal9000',
        firstName: 'hal',
        lastName: '9000',
        email: 'hal@spaceodyssey.com',
        password: 'password',
        zipCode: 19104,
        caretakers: [{
            role: 'sister',
            email: 'helga@spacemeander.com',
            phone: null
        }]
    },
    user13: {
        username: 'arthur.dent',
        firstName: 'arthur',
        lastName: 'dent',
        email: 'adent@pub.co.uk',
        password: 'password',
        zipCode: 98104,
        caretakers: [{
            role: 'friend',
            email: 'ford.prefect@universe.uv',
            phone: null
        }]
    }
};

async function main() {
    try {
        await Promise.all(Object.keys(users).map(key => {
            let user = users[key];

            let userNumber = /user([1]?[0-9])/ig.exec(key)[1];
            let userData = data['case' + userNumber];

            let session = driver.session();
            let str = `
                CREATE (u:User { username: {username}, firstName: {firstName}, lastName: {lastName}, email: {email}, password: {password}, zipCode: {zipCode} }) WITH u
                ${user.caretakers.map(caretaker => {
                    return `CREATE (u)-[:HAS]->(c:Caretaker { role: "${caretaker.role}", email: "${caretaker.email}"${caretaker.phone ? `, phone: "${caretaker.phone}"` : ''} })`;
                }).join('\n')}
                CREATE (u)-[:GENERATED]->(d:Data { stepCounts: [${userData.steps.join(', ')}], heartRates: [${userData.heartRates.join(', ')}]})
                ${userData.drug !== 'N/A' ? `CREATE (u)-[:TAKES]->(:Medicine { name: "${userData.drug}", dosage: "lots", frequency: "often", additionalInstructions: [], sideEffects: []})` : ''}
                RETURN u;
            `;
            return session.run(str, user);
        }));
        console.log('done');
    }
    catch(err) {
        console.error(err);
    }
}

main();