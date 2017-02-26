var koa = require('koa');
var convert = require('koa-convert');
var router = require('koa-router')();
var { graphqlKoa, graphiqlKoa } = require('graphql-server-koa');

const app = new koa();
const PORT = 3000;

var myGraphQLSchema = require('./schema').graphqlSchema;

// koaBody is needed just for POST.
// app.use(convert(require('koa-better-body')()));
var koaBody = require('koa-bodyparser');
app.use(convert(koaBody()));

router.post('/graphql', graphqlKoa({ schema: myGraphQLSchema }));
router.get('/graphql', graphqlKoa({ schema: myGraphQLSchema }));

router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);