/*
	this is statical analysis module

	using this simple-statistics package
	API doc: 
	http://simplestatistics.org/docs/
	
	last mod 02/11/17
	
	program logic:
	conduct linear regression for new and old data and compare the result 
	2 cases
	1) if new data slope is higher than old data slope
		- display "good job, keep it up!"
	2) if new data slope if lower or equal to old data slope
		- calculate mean absolute deviation (MAD) of old data and compare to new data
			- if new data lower than MAD, display "lazy bum need more exercise!"
			- else display "not bad, you can do better!"

	NOTE: ONLY prototype, need more complicated statistical analysis algorithm
*/

// require stat package
var stat = require("simple-statistics");

/*
	calculate mean absolute deviation
	input:
		yData: y axis data
	output:
		MAD: mean absolute deviation
*/
function calcMAD(yData){
		// get mean
		var mean = stat.mean(yData);
		
		// set variables
		var numerator = 0;
		var denominator = yData.length;
		
		// calc absolute difference from mean
		for (var i = 0; i < denominator; i++){
			numerator += Math.abs(yData[i] - mean);
		}
		// return MAD
		return numerator/denominator;
	}

/*
	calculate linear regression
	input: 
		yData: y axis data
	output: 
		regrObj.m: the slow attribute of the linearRegression return object
*/
function calcLinearRegr(yData){
	// create x axis data
	var xData = [];
	for (var i = 0; i < yData.length; i++){
		xData.push(i);
	}
	// calc linear regression
	var regrObj = stat.linearRegression([xData, yData]);
	
	// return slope
	return regrObj.m;
}

/*
	determine case
	input: 
		newData: today's data
		oldData: past data
		TODO: oldData length to be determined
	output:
		console log messages
		NOTE: change to whatever as needed
*/
function deterResult(oldData, newData){
	// get slope of old data
	var oldSlope = module.exports.calcLinearRegr(oldData);
	
	// get slope of old data + new data
	var newSlope = module.exports.calcLinearRegr(oldData.concat(newData));

	// if new slope is equal or lower than old slope
	if (newSlope <= oldSlope){
		// compare MAD
		if (newData <= module.exports.calcMAD(oldData)){
			return("lazy bum, go exercise!");
		}
	}

	// anything else
	return("good job, keep it up!");
}

module.exports = {
	calcMAD,
	calcLinearRegr,
	deterResult
};
