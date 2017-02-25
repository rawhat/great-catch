var makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

// var resolvers = require('./resolvers.js');

const resolvers = {
    Query: {
        user(root, args) {
            let { id } = args;
            return { username: 'Alex' };
        },
        users(root) {
            return [
                { username: 'Alex', email: 'test@test.com' },
                { username: 'Test', email: 'test2@test.com' }
            ];
        },
        caretakers(root, args) {
            let { id } = args;
            return [
                { username: 'Dr Mengela', email: 'test@test.com' },
                { username: 'Shitty Chinese Medicine Man', email: 'test2@test.com' }
            ];
        }
    },
    // Mutation: {

    // }
};

const schema = `
    type User {
        id: Int!
        username: String!
        firstName: String!
        lastName: String!
        email: String!
        caretakers: [User]
        healthData: [Data]
    }

    type Alert {
        target: String!
        message: String!
        data: [Data]
    }

    type Data {
        unit: String!
        value: Int!
    }

    type Query {
        user(id: Int!): User
        users: [User]
        caretakers(id: Int!): [User]
    }

    #type Mutation {
    #    newUser(user: User): User
    #
    #}
`;

module.exports = {
    graphqlSchema: makeExecutableSchema({
        typeDefs: schema,
        resolvers
    })
};