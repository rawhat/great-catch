// test purpose
var test = require('./stat.js');

// this is actual data from fitbit
var oldData = [1000, 1000, 1000, 1000, 1000, 10001, 10001, 1000, 1000, 1000, 1000, 1000, 10001, 10001, 900]

var results = test.deterResult(oldData);
console.log(results);