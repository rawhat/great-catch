var neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(
    'bolt://localhost',
    neo4j.auth.basic('neo4j', 'neo4j')
);

let session = driver.session();

session
    .run(
        `
    MATCH (u:User)-[r:HAS]-(c:Caretaker) WITH u,r,c 
    OPTIONAL MATCH (u)-[t:TRIGGERED]-(a:Alert) WITH u,r,c,t,a
    OPTIONAL MATCH (u)-[g:GENERATED]-(d:Data) WITH u, r, c, t, a, g, d
    DETACH DELETE u, r, c, t, a, g, d;
`
    )
    .then(() => {
        console.log('done');
        session.close();
    })
    .catch(err => console.error(err));
