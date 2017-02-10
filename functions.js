var neo4j = require('neo4j-driver').v1;

const makeDBQuery = async ({ queryString, object }) => {
    const driver = neo4j.driver('http://localhost:7474', neo4j.auth.basic('neo4j', 'helloWorld'));
    const session = driver.session();
    try {
        let response = await session.run(queryString, object);
        session.close();
        driver.close();
        return { records: response.records };
    }
    catch (error) {
        console.error(error);
        return { error };
    }
};

var SESSION_KEYS = ['thisisatestkeyreplacewithbetterlater'];

module.exports = {
    makeDBQuery,
    SESSION_KEYS
};