var _ = require('lodash');
var makeDBQuery = require('../../functions').makeDBQuery;

async function doNestedQuery({ queryString, object }) {
	let resultObject = await makeDBQuery({ queryString, object });
	return resultObject;
}

const resolvers = {
	Query: {
		async user(root, args) {
			let { id } = args;
			// return _.omit(mockData[id], 'password');
			let { records } = await makeDBQuery({ queryString: `
				MATCH (u:User) WHERE ID(u) = {id} RETURN u AS user;
			`,
			object: {
				id
			}});

			return Object.assign({}, _.omit(records[0].get('user').properties, 'password'), { id });
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
			let { id, medicine } = args;

			// let medicineId = mockData[id].medicines.length;

			// mockData[id].medicines = mockData[id].medicines.concat(Object.assign({}, medicine, { id: medicineId }));

			let object = Object.assign({}, medicine, { addedAt: Date.now(), id });

			let { records, error } = await makeDBQuery({ queryString: `
				MATCH (u:User) WHERE ID(u) = {id}
				CREATE (m:Medicine { 
					name: {name}, 
					dosage: {dosage}, 
					frequency: {frequency}, 
					additionalInstructions: {additionalInstructions},
					sideEffects: {sideEffects}
				})-[:TAKES { addedAt: {addedAt}}]->(u)
				RETURN m AS medicine;
				`.replace('\n', ' '),
				object
			});

			return records[0].get('medicine').properties;
		},
		async addCaretaker(root, args) {
			let { id, caretaker } = args;

			// let caretakerId = mockData[id].caretakers.length;

			// mockData[id].caretakers = mockData[id].caretakers.concat(Object.assign({}, caretaker, { id: caretakerId }));
			// return caretaker;

			let object = Object.assign({}, caretaker, { addedAt: Date.now(), id });

			let { records, error } = await makeDBQuery({ queryString: `
				MATCH (u:User) WHERE ID(u) = {id}
				CREATE (c:Caretaker { 
					role: {role},
					email: {email},
					phone: {phone}
				})-[:HAS { addedAt: {addedAt}}]->(u)
				RETURN c AS caretaker;
				`.replace('\n', ' '),
				object
			});

			return records[0].get('caretaker').properties;
		},
		async addAlert(root, args) {
			let { id, alert } = args;

			// let alertId = mockData[id].alerts.length;

			// mockData[id].alerts = mockData[id].alerts.concat(Object.assign({}, alert, { id: alertId }));
			// return alert;

			let object = Object.assign({}, alert, { triggeredAt: Date.now(), id });

			let { records, error } = await makeDBQuery({ queryString: `
				MATCH (u:User) WHERE ID(u) = {id}
				CREATE (a:Alert { 
					type: {type},
					priority: {priority},
					method: {method}
				})-[:TRIGGERED { triggeredAt: {triggeredAt}}]->(u)
				RETURN a AS alert;
				`.replace('\n', ' '),
				object
			});

			return records[0].get('alert').properties;
		},
		async addSupportRequest(root, args) {
			let { id, supportRequest } = args;

			// let requestId = mockData[id].supportRequests.length;

			// supportRequest = Object.assign({}, supportRequest, { createdAt: Date.now() });

			// mockData[id].supportRequests = mockData[id].supportRequests.concat(Object.assign({}, supportRequest, { id: requestId }));

			// return supportRequest;

			let object = Object.assign({}, supportRequest, { createdAt: Date.now(), id });

			let { records, error } = await makeDBQuery({ queryString: `
				MATCH (u:User) WHERE ID(u) = {id}
				CREATE (s:SupportRequest { 
					email: {email},
					role: {role},
					status: {status}
				})-[:HAS { createdAt: {createdAt}}]->(u)
				RETURN s AS supportRequest;
				`.replace('\n', ' '),
				object
			});

			return records[0].get('supportRequest').properties;
		}
	},
	User: {
		async caretakers(obj) {
			let { id } = obj;

			let { records, error } = await doNestedQuery({
				queryString: `
					MATCH (u:User)-[:HAS]-(c:Caretaker)
					WHERE ID(u) = {id}
					RETURN c AS caretaker, ID(c) as caretakerId;
				`,
				object: { id }
			});

			if(records.length)
				return records.map(record => {
					return Object.assign({}, record.get('caretaker').properties, { id: record.get('caretakerId') });
				});
			else
				return [];
		},
		async supportRequests(obj) {
			let { id } = obj;

			let { records, error } = await doNestedQuery({
				queryString: `
					MATCH (u:User)-[:MADE]-(s:SupportRequest)
					WHERE ID(u) = {id}
					RETURN s as supportRequest, ID(s) as supportRequestId;
				`,
				object: { id }
			});

			if(records.length)
				return records.map(record => {
					return Object.assign({}, record.get('supportRequest').properties, { id: record.get('supportRequestId') });
				});
			else
				return [];
		},
		async medicines(obj) {
			let { id } = obj;

			let { records, error } = await doNestedQuery({
				queryString: `
					MATCH (u:User)-[:TAKES]-(m:Medicine)
					WHERE ID(u) = {id}
					RETURN m as medicine, ID(m) as medicineId;
				`,
				object: { id }
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
			let { id } = obj;

			let { records, error } = await doNestedQuery({
				queryString: `
					MATCH (u:User)-[:TRIGGERED]-(a:Alert)
					WHERE ID(u) = {id}
					RETURN a as alert, ID(a) as alertId;
				`,
				object: { id }
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