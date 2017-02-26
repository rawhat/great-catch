var makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

var resolvers = require('./resolvers').resolvers;

// var { mockData } = require('./mock-data');

const schema = `
	type User {
		id: Int!
		username: String!
		firstName: String!
		middleName: String
		lastName: String!
		age: Int!
		email: String!
		phone: String
		caretakers: [UserCaretaker]
		supportRequests: [UserSupportRequest!]
		medicines: [UserMedicine!]
		alerts: [Alert!]
		createdAt: String!
		updatedAt: String!
		deviceModel: String
		fitbitID: String
	}

	type UserCaretaker {
		id: Int!
		role: String!
		email: String!
		phone: String
	}

	input InputCaretaker {
		role: String!
		email: String!
		phone: String
	}

	type UserSupportRequest {
		id: Int!
		email: String!
		role: String!
		status: String!
		createdAt: String!
	}

	input InputSupportRequest {
		email: String!
		role: String!
		status: String!
	}

	type Alert {
		id: Int!
		type: String!
		priority: String!
		method: String!
	}

	input InputAlert {
		type: String!
		priority: String!
		method: String!
	}

	type UserMedicine {
		id: Int!
		name: String!
		dosage: String!
		frequency: String!
		additionalInstructions: [String!]
		sideEffects: [String!]
	}

	input InputMedicine {
		name: String!
		dosage: String!
		frequency: String!
		additionalInstructions: [String!]
		sideEffects: [String!]
	}

	type Query {
		user(username: String!): User
		users: [User]
	}

	type Mutation {
		addMedicine(username: String!, medicine: InputMedicine!): UserMedicine
		addCaretaker(username: String!, caretaker: InputCaretaker!): UserCaretaker
		addAlert(username: String!, alert: InputAlert!): Alert
		addSupportRequest(username: String!, supportRequest: InputSupportRequest!): UserSupportRequest
	}
`;

module.exports = {
	graphqlSchema: makeExecutableSchema({
		typeDefs: schema,
		resolvers
	})
};