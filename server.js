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

const users = [
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

const jwt = require('koa-jwt');

app.use(convert(jwt({ secret: SESSION_KEYS[0] }).unless({ path: ['/', '/login']})));

router.post('/login', async (ctx, next) => {
    console.log(ctx.request.fields);

    // DO AUTHENTICATION HERE, THEN PULL USER INFO FROM DB
    //   -- CONSIDER REPLACING WITH PASSPORT LOCAL STRATEGY
    let user = users.find(u => u.name === ctx.request.fields.username);
                                                    // seconds
    let token = jwt.sign(user, SESSION_KEYS[0], { expiresIn: 60 * 60 * 5 });
    ctx.body = { token };
    ctx.status = 200;
});

router.get('*', async (ctx, next) => {
    this.body = await ctx.render('index.pug');
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3333);
