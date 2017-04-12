/*
	this is statical analysis module for step counts

	using this simple-statistics package
	API doc: 
	http://simplestatistics.org/docs/
	
	TODO:
	find the corresponding APIs for drug, disease, and weather
	
	last mod 04/11/17
	

	PROGRAM LOGIC - step count:
	linear regression + mean absolute deviation + correlation	
	
	1) check size:
		1.1) size == 1
			1.1.1) "still calibrating, come back tomorrow"
		1.2) 1 < size < 15
			1.2.1) new data vs. MAD of old data
				1.2.1.1) less or equal to MAD
					1.2.1.1.1) "abnormal"
					1.2.1.1.2) "normal"
		1.3) size == 15
			1.3.1) linear regression for both data with and without new data
				1.3.1.1) new data slope < old data slope
					1.3.1.1.1) correlation
					1.3.1.1.2) "abnormal"
				1.3.1.2) new data slope => old data slope
					1.3.1.2.1) "normal"

	INPUT:
		@step_count: 
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
	OUTPUT:
		@message:
			- normal
			- abnormal w/ linear regression w/ suggestions
			- calibrating
			- abnormal w/ MAD
*/

// require stat package
var stat = require("simple-statistics");

/*
	calculate mean absolute deviation
	input:
		data: old step count data
	output:
		MAD: mean absolute deviation
*/
function calcMAD(data){
		// get mean
		var mean = stat.mean(data);
		
		// set variables
		var numerator = 0;
		var denominator = data.length;
		
		// calc absolute difference from mean
		for (var i = 0; i < denominator; i++){
			numerator += Math.abs(data[i] - mean);
		}
		// return MAD
		return numerator/denominator;
	}

/*
	calculate linear regression
	input: 
		data: step count data
	output: 
		regrObj.m: the slow attribute of the linearRegression return object
*/
function calcLinearRegr(data){
	// create coordinate pairs
	var xy = []
	for (var i = 0; i < data.length; i++){
		xy.push([i, data[i]])
	}
	
	// calc linear regression
	var regrObj = stat.linearRegression(xy);
	
	// return slope
	return regrObj.m;
}

/*
	determine case
	input: 
		originData: past data w/ today's data 
		oldData: past data
	output:
		message
			- abnormal w/ correlation
			- normal
*/
function deterResult(originData, oldData){
	
	// get slope of old data
	var oldSlope = calcLinearRegr(oldData);
	// get slope of extended data
	var newSlope = calcLinearRegr(originData);
	
	// if new slope is equal or lower than old slope
	if (newSlope < oldSlope){
		return ("Abnormal w/ linear regression w/ TODO: Do correlation");
	}else{
		return ("normal w/ linear regression");
	}
}

/*
	trigger calcMad
	input:
		newData: today's data
		oldData: past data
	output:
		message:
			- abnormal
			- normal
*/
function compareMAD(newData, oldData){
	if (newData <= calcMAD(oldData)){
		return("abnormal w/ MAD");
	}else{
		return("normal w/ MAD");
	}
}

/*
	determine size of data
	input:
		data: all data points
	output:
		message:
			- still calibrating
			- abnormal w/ MAD
			- normal w/ MAD
			- abnormal w/ linear regression w/ suggestions
			- normal w/ linear regression
*/
function deterDataSize(data){
	console.log(weatherCheck(19104))

	var dataSize = data.length
	if (dataSize == 1){
		return ("System still calibrating, come back tomorrow");
	}else if (dataSize > 1 && dataSize <15){
		var parsedData = parseData(data)
		return (compareMAD(parsedData[0], parsedData[1]));
	}else{
		var parsedData = parseData(data)
		return (deterResult(data, parsedData[1]));
	}
}

/* 
	parse data
	input:
		data: all data points
	output:
		- newData: today's data
		- oldData: past data
*/
function parseData(data){
	var oldData = data.slice(0, -2);
	var newData = data.slice(-1)[0];
	
	return [newData, oldData];
}

/*
	weather correlation
	
*/
function weatherCheck(zipcode){
	var key = "971c72f24410bd75";
	var date = new Date();
	var date = date.getFullYear().toString() + ("0" + (date.getMonth() + 1).toString()).slice(-2) + ("0" + date.getDate().toString()).slice(-2)
	var url = "http://api.wunderground.com/api/" + key + "/history_" + date + "/q/" + zipcode + ".json";
	return url
}

module.exports = {
	deterDataSize
};
