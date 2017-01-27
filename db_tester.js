const neo4j = require('neo4j-driver').v1;

const makeDBQuery = async ({ queryString, object }) => {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'helloWorld'));
    const session = driver.session();
    try {
        let response = await session.run(queryString, object);
        session.close();
        driver.close();
        return response.records[0];
    }
    catch (e) {
        console.error(e);
    }
}

async function main() {
    let response = await makeDBQuery({
        queryString: 'MATCH (a:User) RETURN a'
    });
    console.log(response);
}

main();
