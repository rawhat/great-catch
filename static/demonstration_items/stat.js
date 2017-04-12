/*
	this is statical analysis module

	using this simple-statistics package
	API doc: 
	http://simplestatistics.org/docs/
	
	TODO:
	find the corresponding APIs for drug, disease, and weather
	
	last mod 04/11/17
	
	program logic - step count:
	linear regression + mean absolute deviation + correlation	
	
	1) if linear regression of new + old data slope is higher than that of old data slope
		1.1) display "normal"
	2) if new + old data slope is lower or equal to old data slope
		2.1) calculate mean absolute deviation (MAD) of old data and compare to new data
			2.1.1) if new data lower than MAD, do correlation
					2.1.1.1) check medicine using FDA drug API
					2.1.1.2) check weather API for rain
					2.1.1.3) display "abnormal"
			2.1.2) else display "normal"
	3) display information
		3.1) plot of data
		3.2) findings
			3.2.1) normal
			3.2.2) abnormal
				3.2.2.1) step counts
				3.2.2.2) suggestions of causes
				
	program logic - heart rate:
	linear regression + mean absolute deviation + correlation	
	
	1) if linear regression of new + old data slope equal to that of old data slope
		1.1) display "normal"
	2) if new + old data slope is lower or higher than that of old data slope
		2.1) calculate mean absolute deviation (MAD) of old data and compare to new data
			2.1.1) off by 10 bpm, do correlation
					2.1.1.1) check medicine using FDA drug API
					2.1.1.2) check disease API for heart rate
					2.1.1.3) display "abnormal"
			2.1.2) else display "normal"
	3) display information
		3.1) plot of data
		3.2) findings
			3.2.1) normal
			3.2.2) abnormal
				3.2.2.1) heart rate
				3.2.2.2) suggestions of causes

	INPUT:
		@step_count: 
			- array of size 15
			- double type
			- first 14 is early data point
			- last item is today's data point
		@heart_rate:
			- array of size 15
			- double type
			- first 14 is early data point
			- last item is today's data point
		@medicine:
			- array of string types
			- medicine brand names
		@zipcode:
			- zipcode of user
			- integer
		@disease:
			- array of string types
			- disease name only, ex, diabete, high blood pressure
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
	// create coordinate pairs
	var xy = []
	for (var i = 0; i < yData.length; i++){
		xy.push([i, yData[i]])
	}
	
	// calc linear regression
	var regrObj = stat.linearRegression(xy);
	
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
function deterResult(data){
	// parse data
	var oldData = data.slice(0, -2);
	var newData = data.slice(-1)[0];
	
	// extend data for linear regression 
	var extendData = oldData
	for (i=0; i<15; i++){
		extendData = extendData.concat(newData);
	}
	
	// get slope of old data
	var oldSlope = calcLinearRegr(oldData);
	
	// get slope of extended data
	var newSlope = calcLinearRegr(extendData);

	// if new slope is equal or lower than old slope
	if (newSlope < oldSlope){
		// compare MAD
		if (newData <= calcMAD(oldData)){
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
