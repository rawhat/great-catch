// test purpose
var test = require('./stat.js');

// this is actual data from fitbit
var oldData = [2455, 5218, 2062, 121, 0, 0, 2236, 3437, 209, 6, 0, 0, 1862, 0, 0, 8055, 2732, 7827, 1474];
// mess around this can see the 2 different message
// for this data set, 1910.61 is the threshold, less than that you will be lazy bum, higher than that, good job

// var newData = [1911];
var newData = [1888];

var results = test.deterResult(oldData, newData);
console.log(results);