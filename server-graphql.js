var koa = require('koa');
var koaRouter = require('koa-router');
var koaBody = require('koa-better-body');
var { graphqlKoa, graphiqlKoa } = require('graphql-server-koa');
var { makeExecutableSchema } = require('graphql-tools');

const app = new koa();
const router = new koaRouter();
const PORT = 3000;

app.use(koaBody());

var typeDefs = [`
type Query {
  hello: String
}

schema {
  query: Query
}`];

var resolvers = {
  Query: {
    hello(root) {
      return 'world';
    }
  }
};

var schema = makeExecutableSchema({typeDefs, resolvers});

router.get('/graphiql', graphiqlKoa({endpointURL: '/graphql'}));
router.post('/graphql', graphqlKoa({ schema }));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);