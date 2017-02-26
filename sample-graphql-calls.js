var axios = require('axios');

async function queryGraphQL(query) {
    try {
        let response = await axios.post('http://localhost:3000/graphql', { query });

        return response.data;
    }
    catch(e) {
        console.error(e.response.data.errors);
        return null;
    }
}

async function getUser(username) {
    return await queryGraphQL(`
            { 
                user(username: "${username}") { 
                    email 
                } 
            }
    `);
}

async function getUsers() {
    return await queryGraphQL(`
        {
            users {
                username
                medicines {
                    name
                }
                caretakers {
                    email
                }
                supportRequests {
                    status
                }
            }
        }
    `);
}

async function addMedicine(username, medicine) {
    let { name, dosage, frequency, additionalInstructions, sideEffects } = medicine;
    return await queryGraphQL(`
        mutation {
            addMedicine(username: "${username}", medicine: {
                name: "${name}",
                dosage: "${dosage}",
                frequency: "${frequency}",
                additionalInstructions: ${additionalInstructions},
                sideEffects: ${sideEffects}
            }) {
                name
            }
        }
    `);
}

async function addCaretaker(username, caretaker) {
    let { email, role, phone } = caretaker;
    return await queryGraphQL(`
        mutation {
            addCaretaker(username: "${username}", caretaker: {
                email: "${email}",
                role: "${role}",
                phone: "${phone}"
            }) {
                email
            }
        }
    `);
}

async function addSupportRequest(username, request) {
    let { email, role, status } = request;
    return await queryGraphQL(`
        mutation {
            addSupportRequest(username: "${username}", supportRequest: {
                email: "${email}",
                role: "${role}",
                status: "${status}",
            }) {
                status
            }
        }
    `);
}

async function graphQLTests() {
    var alexUser = await getUser("alex");
    console.log('Alex user');
    console.log(alexUser.data);

    var allUsers = await getUsers();
    console.log('All users');
    console.log(JSON.stringify(allUsers.data));

    var medicine = await addMedicine("alex",{
        name: "Advil",
        dosage: "200mg",
        frequency: "Once daily",
        additionalInstructions: JSON.stringify(["Limit alcohol intake"]),
        sideEffects: JSON.stringify(["Stomach bleeding"]),
    });
    console.log('New Medicine');
    console.log(medicine.data);

    var caretaker = await addCaretaker("alex", {
        email: "caretaker@mail.com",
        role: "Doctor",
        phone: "610-555-5555"
    });
    console.log('New Caretaker');
    console.log(caretaker);

    var request = await addSupportRequest("alex", {
        email: "tester@test.com",
        role: "User",
        status: "Password issue",
    });
    console.log('New support request');
    console.log(request.data);

    allUsers = await getUsers();
    console.log('All users post modifications');
    console.log(JSON.stringify(allUsers.data));
}

graphQLTests();