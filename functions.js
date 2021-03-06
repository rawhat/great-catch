var neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'neo4j')
);

const makeDBQuery = async ({ queryString, object }) => {
    let session = driver.session();
    try {
        let response = await session.run(queryString, object);
        // console.log(response);
        session.close();
        return { records: response.records };
    } catch (error) {
        console.error(error);
        return { error };
    }
};

var SESSION_KEYS = ['thisisatestkeyreplacewithbetterlater'];

function calculateStdDev(values) {
    // step 1:  calculate mean
    let mean = values.reduce((sum, next) => sum + next, 0) / values.length;

    // step 2:  for each value, do -> (value - mean) squared
    let diffSquared = values.map(value => Math.pow(value - mean, 2));

    // steps 3: calculate mean of differences
    let diffMean =
        diffSquared.reduce((sum, next) => sum + next, 0) / diffSquared.length;

    // 4: square root of step 3
    return Math.sqrt(diffMean);
}

module.exports = {
    makeDBQuery,
    SESSION_KEYS,
    calculateStdDev,
};
