var koa = require('koa');
var app = new koa();

var router = require('koa-router')();

var convert = require('koa-convert');
// app.use(convert(require('koa-static')(__dirname + '/static')));
app.use(convert(require('koa-better-body')()));

// var views = require('koa-views');
//
// app.use(views(__dirname + '/views', {
//   map: {
//     pug: 'pug'
//   }
// }));

// var passport = require('koa-passport');
// var session = require('koa-session');
var SESSION_KEYS = ['thisisatestkeyreplacewithbetterlater'];
// app.keys = SESSION_KEYS;
// app.use(convert(session(app)));
// app.use(passport.initialize());
// app.use(passport.session());

var neo4j = require('neo4j-driver').v1;

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
// app.use(convert(jwt({ secret: SESSION_KEYS[0], passthrough: true }).unless({ path: ['/', '/login']})));

router.get('/users/:username', async (ctx, next) => {
    let queryResults = await makeDBQuery({
        queryString: 'MATCH (a:User) WHERE a.username = {username} RETURN a',
        object: { username: ctx.params.username }
    });

    ctx.body = 'Got back: ' + queryResults;
});

router.post('/login', async (ctx, next) => {
    console.log(ctx.request.fields);

    // DO AUTHENTICATION HERE, THEN PULL USER INFO FROM DB
    //   -- CONSIDER REPLACING WITH PASSPORT LOCAL STRATEGY
    let user = users.find(u => u.name === ctx.request.fields.username);
                                                    // seconds
    let token = jwt.sign(user, SESSION_KEYS[0], { expiresIn: 60 * 60 * 5 });
    ctx.body = { token, username: user.username };
    ctx.status = 200;
});

router.get('/user/:id/profile', jwt, async (ctx, next) => {
    console.log(ctx);
    console.log(ctx.params.id);
    // GET USER DATA FROM DB HERE
    let userData = {
        username: 'test',
        dateOfBirth: '01/01/1980',
        fullName: 'Test User'
    };

    ctx.body = userData;
});

router.post('/user/create', async (ctx, next) => {
    // CREATE USER IN DB, THEN USE IT TO SIGN JWT INSTEAD
    let user = Object.assign({}, ctx.request.fields, { id: users.length + 1 });
    users = users.concat(user);
    let token = jwt.sign(user, SESSION_KEYS[0], { expiresIn: 60 * 60 * 5 });

    ctx.body = { token };
});

router.get('*', async (ctx, next) => {
    this.body = await ctx.render('index.pug');
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
