const medicines = [
    {   name: "Aspirin",
		dosage: "200mg",
		frequency: "Daily",
		additionalInstructions: [ "Limit alcohol consumption" ],
		sideEffects: [ "Blood thinning" ]
    }
];

const caretakers = [
    {
		id: 0,
		role: "Child",
		email: "caretaker@test.com",
		phone: "514-123-4567"
	}
];

const mockData = {
    0: {
		username: "rawhat",
		firstName: "Alex",
		middleName: "",
		lastName: "Manning",
		age: 26,
		email: "alex.w.manning@gmail.com",
		phone: "215-555-5555",
		caretakers: [],
		supportRequests: [],
		medicines,
		alerts: [],
		createdAt: Date.now(),
		updatedAt: Date.now(),
		deviceModel: "Fitbit 1",
		fitbitID: "CI491-GreatCatch@gmail.com",
    },
    1: {
		username: "test",
		firstName: "Test",
		middleName: "",
		lastName: "Person",
		age: 18,
		email: "test@test.com",
		phone: "215-555-5550",
		caretakers,
		supportRequests: [],
		medicines: [],
		alerts: [],
		createdAt: Date.now(),
		updatedAt: Date.now(),
		deviceModel: "Fitbit 2",
		fitbitID: "CI491-GreatCatch@gmail.com",
    }
};

module.exports = {
    mockData
};