var neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'neo4j'));

let session = driver.session();

session.run('MATCH (u:User)-[r:HAS]-(c:Caretaker) DETACH DELETE c, u;')
.then(() => {
    console.log('done');
    session.close();
})
.catch((err) => console.error(err));