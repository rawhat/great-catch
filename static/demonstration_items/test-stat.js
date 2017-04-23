// test purpose
var test = require('./StepCount_Stat.js');
var results 
var http = require('http'); 

// step counts only


var case1 = {
				"steps":[1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"N/A",
				"zip":19104
			};
test.deterDataSize(case1);


var case2 = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 300],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"LETAIRIS",
				"zip":19104
			}; 
test.deterDataSize(case2);


var case3 = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 1000],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"Ritalin",
				"zip":19104
			}; 
test.deterDataSize(case3);