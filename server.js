var path = require('path');
var _ = require('lodash');
var koa = require('koa');
var app = new koa();

const router = require('./routes.js').router;

var convert = require('koa-convert');
app.use(convert(require('koa-better-body')()));

var views = require('koa-views');

app.use(views(path.join(__dirname, 'views'), {
  map: {
    pug: 'pug'
  }
}));

app.use(convert(require('koa-static')(path.join(__dirname, 'static'))));

// var passport = require('koa-passport');
// var session = require('koa-session');
// app.keys = SESSION_KEYS;
// app.use(convert(session(app)));
// app.use(passport.initialize());
// app.use(passport.session());


// uniqueness constraint for property
// CREATE CONSTRAINT ON (u:User) ASSERT u.username IS UNIQUE;

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

// app.use(convert(jwt({ secret: SESSION_KEYS[0], passthrough: true }).unless({ path: ['/', '/login']})));

router.get('*', async (ctx) => {
    this.body = await ctx.render('index.pug');
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
