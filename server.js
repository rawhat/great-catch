var koa = require('koa');
var app = new koa();

var router = require('koa-router')();

var convert = require('koa-convert');
app.use(convert(require('koa-static')(__dirname + '/static')));
app.use(convert(require('koa-better-body')()));

var views = require('koa-views');

app.use(views(__dirname + '/views', {
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

router.get('/user/profile', jwt, async (ctx, next) => {
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

app.listen(3333);
