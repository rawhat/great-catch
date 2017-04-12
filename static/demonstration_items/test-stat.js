// test purpose
var test = require('./StepCount_Stat.js');
var results 

// step counts only

// data size 1
var case1 = [1000];
results = test.deterDataSize(case1);
console.log(results);

// data size 2-14
var case2 = [1000, 1000, 1000, 1000, 1000, 10001, 10001, 1000, 1000, 1000, 10001, 10001, 1000];
results = test.deterDataSize(case2);
console.log(results);

// data size 15
// normal
var case3 = [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000];
results = test.deterDataSize(case3);
console.log(results);

// abnormal
var case4 = [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 999];
results = test.deterDataSize(case4);
console.log(results);



