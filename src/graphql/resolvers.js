var _ = require('lodash');
var makeDBQuery = require('../../functions').makeDBQuery;

async function doNestedQuery({ queryString, object }) {
	let resultObject = await makeDBQuery({ queryString, object });
	return resultObject;
}

const resolvers = {
	Query: {
		async user(root, args) {
			let { username } = args;
			// return _.omit(mockData[id], 'password');
			let { records } = await makeDBQuery({ queryString: `
				MATCH (u:User) WHERE u.username = {username} RETURN u AS user, ID(u) as userId;
			`,
			object: {
				username
			}});

			return Object.assign({}, _.omit(records[0].get('user').properties, 'password'), { id: records[0].get('userId').low });
		},
		async users() {
			// return Object.keys(mockData).map(key => {
			// 	return _.omit(mockData[key], 'password');
			// });
			let { records, error } = await makeDBQuery({ queryString: `
				MATCH (u:User) RETURN u AS user, ID(u) AS id;
			`});

			let results = records.map(record => {
				let id = record.get('id').low;
				return Object.assign({}, _.omit(record.get('user').properties, 'password'), { id });
			});

			return results;
		}
	},
	Mutation: {
		async addMedicine(root, args) {
			let { username, medicine } = args;

			// let medicineId = mockData[id].medicines.length;

			// mockData[id].medicines = mockData[id].medicines.concat(Object.assign({}, medicine, { id: medicineId }));

			let object = Object.assign({}, medicine, { addedAt: Date.now(), username });

			let { records, error } = await makeDBQuery({ queryString: `
				MATCH (u:User) WHERE u.username = {username}
				CREATE (u)-[:TAKES { addedAt: {addedAt}}]->(m:Medicine { 
					name: {name}, 
					dosage: {dosage}, 
					frequency: {frequency}, 
					additionalInstructions: {additionalInstructions},
					sideEffects: {sideEffects}
				})
				RETURN m AS medicine;
				`,
				object
			});

            console.log(records);

			return records[0].get('medicine').properties;
		},
		async addCaretaker(root, args) {
			let { username, caretaker } = args;

			// let caretakerId = mockData[id].caretakers.length;

			// mockData[id].caretakers = mockData[id].caretakers.concat(Object.assign({}, caretaker, { id: caretakerId }));
			// return caretaker;

			let object = Object.assign({}, caretaker, { addedAt: Date.now(), username });

			let { records, error } = await makeDBQuery({ queryString: `
				MATCH (u:User) WHERE u.username = {username}
				CREATE (u)-[:HAS { addedAt: {addedAt}}]->(c:Caretaker { 
					role: {role},
					email: {email},
					phone: {phone}
				})
				RETURN c AS caretaker;
				`,
				object
			});

			return records[0].get('caretaker').properties;
		},
		async addAlert(root, args) {
			let { username, alert } = args;

			// let alertId = mockData[id].alerts.length;

			// mockData[id].alerts = mockData[id].alerts.concat(Object.assign({}, alert, { id: alertId }));
			// return alert;

			let object = Object.assign({}, alert, { triggeredAt: Date.now(), username });

			let { records, error } = await makeDBQuery({ queryString: `
				MATCH (u:User) WHERE u.username = username
				CREATE (u)-[:TRIGGERED { triggeredAt: {triggeredAt}}]->(a:Alert { 
					type: {type},
					priority: {priority},
					method: {method}
				})
				RETURN a AS alert;
				`,
				object
			});

			return records[0].get('alert').properties;
		},
		async addSupportRequest(root, args) {
			let { username, supportRequest } = args;

			// let requestId = mockData[id].supportRequests.length;

			// supportRequest = Object.assign({}, supportRequest, { createdAt: Date.now() });

			// mockData[id].supportRequests = mockData[id].supportRequests.concat(Object.assign({}, supportRequest, { id: requestId }));

			// return supportRequest;

			let object = Object.assign({}, supportRequest, { createdAt: Date.now(), username });

			let { records, error } = await makeDBQuery({ queryString: `
				MATCH (u:User) WHERE u.username = {username}
				CREATE (u)-[:MADE { createdAt: {createdAt}}]->(s:SupportRequest { 
					email: {email},
					role: {role},
					status: {status}
				})
				RETURN s AS supportRequest;
				`,
				object
			});

			return records[0].get('supportRequest').properties;
		}
	},
	User: {
		async caretakers(obj) {
			let { username } = obj;

			let { records, error } = await doNestedQuery({
				queryString: `
					MATCH (u:User)-[:HAS]-(c:Caretaker)
					WHERE u.username = {username}
					RETURN c AS caretaker, ID(c) as caretakerId;
				`,
				object: { username }
			});

			if(records.length)
				return records.map(record => {
					return Object.assign({}, record.get('caretaker').properties, { id: record.get('caretakerId') });
				});
			else
				return [];
		},
		async supportRequests(obj) {
			let { username } = obj;

			let { records, error } = await doNestedQuery({
				queryString: `
					MATCH (u:User)-[:MADE]-(s:SupportRequest)
					WHERE u.username = {username}
					RETURN s as supportRequest, ID(s) as supportRequestId;
				`,
				object: { username }
			});

			if(records.length)
				return records.map(record => {
					return Object.assign({}, record.get('supportRequest').properties, { id: record.get('supportRequestId') });
				});
			else
				return [];
		},
		async medicines(obj) {
			let { username } = obj;

			let { records, error } = await doNestedQuery({
				queryString: `
					MATCH (u:User)-[:TAKES]-(m:Medicine)
					WHERE u.username = {username}
					RETURN m as medicine, ID(m) as medicineId;
				`,
				object: { username }
			});

			if(records.length){
				return records.map(record => {
					return Object.assign({}, record.get('medicine').properties, { id: record.get('medicineId') });
				});
			}
			else
				return [];
		},
		async alerts(obj) {
			let { username } = obj;

			let { records, error } = await doNestedQuery({
				queryString: `
					MATCH (u:User)-[:TRIGGERED]-(a:Alert)
					WHERE u.username = {username}
					RETURN a as alert, ID(a) as alertId;
				`,
				object: { username }
			});

			if(records.length)
				return records.map(record => {
					return Object.assign({}, record.get('alert').properties, { id: record.get('alertId') });
				});
			else
				return [];
		}
	}
};

module.exports = {
    resolvers
};