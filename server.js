var path = require('path');
var _ = require('lodash');
var koa = require('koa');
var app = new koa();

var router = require('koa-router')();

var convert = require('koa-convert');
app.use(convert(require('koa-static')(path.join(__dirname, 'static'))));
app.use(convert(require('koa-better-body')()));

var views = require('koa-views');

app.use(views(path.join(__dirname, 'views'), {
  map: {
    pug: 'pug'
  }
}));

// var passport = require('koa-passport');
// var session = require('koa-session');
var SESSION_KEYS = ['thisisatestkeyreplacewithbetterlater'];
// app.keys = SESSION_KEYS;
// app.use(convert(session(app)));
// app.use(passport.initialize());
// app.use(passport.session());


// uniqueness constraint for property
// CREATE CONSTRAINT ON (u:User) ASSERT u.username IS UNIQUE;
var neo4j = require('neo4j-driver').v1;

const makeDBQuery = async ({ queryString, object }) => {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'helloWorld'));
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

let users = [
    { name: 'alex', password: 'test', id: 1 },
    { name: 'test', password: 'test', id: 2 }
];

// passport.serializeUser((user, done) => {
//     // CHANGE THIS TO DB ID PROPERTY (IF NEEDED)
//     done(null, user.id);
// });

// passport.deserializeUser((user, done) => {
//     // CHANGE THIS TO FETCH USER DATA FROM DB
//     let currUser = users.find(u => u.id === user.id);
//     done(null, currUser);
// });

const koaJwt = convert(require('koa-jwt'));
const jwt = koaJwt({ secret: SESSION_KEYS[0] });
const jwebtoken = require('jsonwebtoken');
// app.use(convert(jwt({ secret: SESSION_KEYS[0], passthrough: true }).unless({ path: ['/', '/login']})));

router.post('/login', async (ctx, next) => {
    console.log(ctx.request.fields);

    let { username, password } = ctx.request.fields;

    // fields:
    //  { username, password }

    // DO AUTHENTICATION HERE, THEN PULL USER INFO FROM DB

    let { records, error} = await makeDBQuery({
        queryString: 'MATCH (u:User) WHERE u.username = {username} AND u.password = {password} RETURN u AS user',
        object: {
            username,
            password
        }
    });

    // check if no errors AND match in DB
    if(!error && records.length) {
        let user = records[0].get('user').properties;

        //   -- CONSIDER REPLACING WITH PASSPORT LOCAL STRATEGY
        // let user = users.find(u => u.name === ctx.request.fields.username);
        //                                                 // seconds
        let token = jwebtoken.sign(user, SESSION_KEYS[0], { expiresIn: 60 * 60 * 5 });
        ctx.body = { token, username: user.username };
        ctx.status = 200;
    }
    // extend this to check for specific errors
    else {
        ctx.status = 401;
    }
});

router.get('/user/:id/profile', async (ctx, next) => {
    // GET USER DATA FROM DB HERE
    let { id } = ctx.params;

    let { records, error } = await makeDBQuery({
        queryString: 'MATCH (u:User) WHERE id(u) = {id} RETURN u AS user',
        object: {
            id: parseInt(id)
        }
    });

    // let userData = {
    //     username: 'test',
    //     dateOfBirth: '01/01/1980',
    //     fullName: 'Test User'
    // };

    if(!error && records.length) {
        let userData = _.omit(records[0].get('user').properties, 'password');
        ctx.body = userData;
    }
    else {
        ctx.status = 403;
    }
});

router.post('/user/create', async (ctx, next) => {
    let { username, password, password_repeat, email } = ctx.request.fields;

    // fields:
    //  { username, password, password_repeat, email }  -- any more?

    // CREATE USER IN DB, THEN USE IT TO SIGN JWT INSTEAD

    if(password === password_repeat) {

        let { records, error } = await makeDBQuery({ 
            queryString: 'CREATE (u:User { username: {username}, password: {password}, email: {email}}) RETURN u AS user', 
            object: {
                username,
                password,
                email
            }
        });

        if(!error) {
            let user = _.omit(records[0].get('user').properties, password);
            // let user = Object.assign({}, ctx.request.fields, { id: users.length + 1 });
            users = users.concat(user);

            // let token = jwebtoken.sign(user, SESSION_KEYS[0], { expiresIn: 60 * 60 * 5 });

            // ctx.body = { token };
            console.log('user', user);
            ctx.body = 'user created';
        }
        else {
            console.error(error);
        }
    }
    else {
        ctx.status = 401;
    }
});

router.get('*', async (ctx, next) => {
    this.body = await ctx.render('index.pug');
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
