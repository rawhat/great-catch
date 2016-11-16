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

router.get('/', async (ctx, next) => {
    this.body = await ctx.render('index.pug');
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3333);
