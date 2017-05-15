var neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'neo4j'));

const makeDBQuery = async ({ queryString, object }) => {
    let session = driver.session();
    try {
        let response = await session.run(queryString, object);
        // console.log(response);
        session.close();
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