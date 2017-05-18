/*
	this is statical analysis module for step counts

	using this simple-statistics package
	API doc: 
	http://simplestatistics.org/docs/
	
	
	last mod 04/29/17
	

	PROGRAM LOGIC - step count:
	sample standard deviation + mean absolute deviation + correlation	
	
	1) check size:
		1.1) size == 1
			1.1.1) "still calibrating, come back tomorrow"
		1.2) 1 < size < 15
			1.2.1) new data vs. MAD of old data
				1.2.1.1) less or equal to MAD
					1.2.1.1.1) "abnormal"
					1.2.1.1.2) "normal"
		1.3) size == 15
			1.3.1) sample standard deviation
				1.3.1.1) difference > STD
					1.3.1.1.1) correlation
						1.3.1.1.1.1) weather
						1.3.1.1.1.2) medicine
					1.3.1.1.2) "abnormal"
				1.3.1.2) new data slope => old data slope
					1.3.1.2.1) "normal"
	
	*******************************************
	TODO:
	update the program logic
	*******************************************
*/

// require stat package
var stat = require("simple-statistics");
var axios = require('axios');


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
		data: step or heart rate
	output: 
		regrObj.m: the slow attribute of the linearRegression return object

function calcLinearRegr(data){
	// create coordinate pairs
	var xy = [];
	for (var i = 0; i < data.length; i++){
		xy.push([i, parseInt(data[i])]);
	}
	
	// calc linear regression
	var regrObj = stat.linearRegression(xy);
	
	// return slope
	return regrObj.m;
}
*/

/*
	calculate std
	input:
		data: step or heart rate
	output:
		std
*/
function stdCalc(data){
	var std = stat.sampleStandardDeviation(data);
	console.log(std);
	return std;
	
}


/*
	determine step count case
	input: 
		originData: all data
		oldData: past data
	output:
		message
			- abnormal --> pass to correlation alerts
			- normal
*/
async function deterStepResult(originData, oldData){
	
	// get std of old data
	var std = stdCalc(oldData);
	
	var data = originData.steps;
	var lastItem = data[data.length-1];
	var lowerBound = Math.abs(stat.mean(data) - std);
	
	
	// difference greater than STD
	if (lowerBound > lastItem){
		let weather = await weatherCheck(originData.zip);
		let response = await drugCheck(originData.drug, weather);
		return response;
	}else{
		return ("We have determined your step count today is NORMAL using sample standard deviation.<br>- Your new data is in range.");
	}
}

/*
	determine heart rate case
	input: 
		originData: all data
		oldData: past data
	output:
		message
			- abnormal --> pass to correlation alerts
			- normal
*/
async function deterHeartRateResult(originData, oldData){
	// get std of old data
	var std = stdCalc(oldData);
	
	var data = originData.heartRates;
	var lastItem = data[data.length-1];
	var differences = Math.abs(stat.mean(data) - lastItem);
	
	// compare difference with std
	if (differences > std){
		// get std of old data
		var data = originData.steps;
		var lastItem = data[data.length-1];
		var std = stdCalc(data.slice(0, -1));
		var lowerBound = Math.abs(stat.mean(data.slice(0, -1)) - std);
		let stepResult = 0;
		if (lowerBound > lastItem){
			stepResult = 1;
		}
		let response = await drugHeartRateCheck(originData.drug, stepResult);
		return response;
	}else{
		return ("We have determined your heart rate today is NORMAL using sample standard deviation.<br>- Your new data is in range.");
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
		return ("has been determined ABNORMAL using mean absolute deviation (MAD).<br>- Your new MAD value is less than or equal to old MAD.");
	}else{
		return ("has been determined NORMAL using mean absolute deviation (MAD).<br>- Your new MAD value is greater than old MAD.");
	}
}

/*
	determine size of data
	input:
		data: all data points
	output:
		message: any concluding results for step counts and heart rates
*/
async function deterDataSize(data){
	var steps = data.steps;
	var heartRates = data.heartRates;
	var stepSize = steps.length;
	var heartRatesSize = heartRates.length;
	
	// assume step counts and heart rate data are the same size... just compare step size
	if (stepSize == 1){
		return ("System still calibrating, come back tomorrow");
	}else if (stepSize > 1 && stepSize <15){
		// step
		let parsedStepData = parseData(steps);
		let stepMsg = compareMAD(parsedStepData[0], parsedStepData[1]);
		// heart rate
		let parsedHeartRateData = parseData(heartRates);
		let heartRateMsg = compareMAD(parsedHeartRateData[0], parsedHeartRateData[1]);
		return ("Step Count " + stepMsg + " <br><br> " + "<br>Heart Rates " + heartRateMsg);
	}else{
		// step
		let parsedStepData = parseData(steps);
		let stepResult = await deterStepResult(data, parsedStepData[1]);
		// heart rate
		let parsedHeartRateData = parseData(heartRates);
		let heartRateResult = await deterHeartRateResult(data, parsedHeartRateData[1]);
		return stepResult + "<br><br>" + heartRateResult;
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
	var oldData = data.slice(0, -1);
	var newData = data[data.length-1];
	
	return [newData, oldData];
}

/*
	weather correlation using wunderground API
	input:
		zipcode: zipcode of the user
	output:
		weatherSum: total up fog, rain, snow, thunder, hail, and tornado

*/
async function weatherCheck(zipcode){
	var key = "971c72f24410bd75";
	var date = new Date();
	date = date.getFullYear().toString() + ("0" + (date.getMonth() + 1).toString()).slice(-2) + ("0" + date.getDate().toString()).slice(-2);
	var url = "http://api.wunderground.com/api/" + key + "/history_" + date + "/q/" + zipcode.toString() + ".json";
	let response = await axios.get(url);
	let parsed = response.data;
	var mainInfo = parsed.history.dailysummary[0];
	var weatherSum = parseInt(mainInfo.fog) + parseInt(mainInfo.rain) + parseInt(mainInfo.snow) + parseInt(mainInfo.hail) + parseInt(mainInfo.thunder) + parseInt(mainInfo.tornado);
	return weatherSum;
}

/*
	drug correlation using FDA API
	input:
		drug: medication name user take
		weather: result from weather database check
	output:
		stepCorrelationAlert: a function that combine correlation alerts summary
*/
async function drugCheck(drug, weather){
	if(drug.toUpperCase() === "N/A") {
		return stepCorrelationAlert(0, weather, drug);
	}
	else {
		var key = "kZ1dIlu9TyKAzlXidiBuejvdfXmQmLWpq2BF0wqY";
		var url = "https://api.fda.gov/drug/event.json?api_key=" + key + "&search=reaction.reactionmeddrapt.exact=" + "Fatigue" + "+AND+brand_name:" + drug;
		let response = await axios.get(url);
		let parsed = response.data;

		if(parsed.meta) {
			var count = parsed.meta.results.total;
			return stepCorrelationAlert(count, weather, drug);
		}
		else {
			return stepCorrelationAlert(0, weather, drug);
		}
	}
}

/*
	drug correlation using FDA API
	input:
		drug: medication name user take
		std: std
	output:
		heartRateCorrelationAlert: a function that combine correlation alerts summary
*/
async function drugHeartRateCheck(drug, std){
	if(drug.toUpperCase() === "N/A") {
		return heartRateCorrelationAlert(0, std, drug);
	}
	else {
		var key = "kZ1dIlu9TyKAzlXidiBuejvdfXmQmLWpq2BF0wqY";
		var url = "https://api.fda.gov/drug/event.json?api_key=" + key + "&search=reaction.reactionmeddrapt.exact=" + "HYPERTENSION" + "+AND+brand_name:" + drug;
		let response = await axios.get(url);
		let parsed = response.data;

		if(parsed.meta) {
			var count = parsed.meta.results.total;
			return heartRateCorrelationAlert(count, std, drug);
		}
		else {
			return heartRateCorrelationAlert(0, std, drug);
		}
	}
}

/*
	correlation alert summary for step count
	input:
		drug: FDA drug api count for fatigue complain for a particular drug
		weather: weather factor sum
		drugName: brand name of the medication
	output:
		msg: combined message of findings
*/
function stepCorrelationAlert(drug, weather, drugName){
	var nothing = "We have found no reason why your step count DECREASED. We suggest you to take more action and do more walking.";
	var starter = "We have found your step count today is ABNORMAL using sample standard deviation and correlation. But we also found that: <br>";
	var drugMsg = "- your medicine " + drugName + " might be making you FATIGUE by using FDA drug complaint database.<br> Here is a link to <a href=http://www.webmd.com/drugs/search.aspx?stype=drug&query=" + drugName + ' target="_blank">WEBMD</a>';
	var weatherMsg = "- today's weather around your location is bad. There was either rain, snow, hail, thunderstorm, fog, tornado or combination of these.";
	// hard threshold for FDA drug, no reason for the number
	var drugThreshold = 1000;
	if (drug >= drugThreshold && weather > 0){
		return ( starter + drugMsg + " <br> AND <br>" + weatherMsg);
	}else if (drug >= drugThreshold && weather == 0){
		return ( starter + drugMsg);
	}else if (drug < drugThreshold && weather == 0){
		return ( nothing);
	}else if (drug < drugThreshold && weather > 0){
		return ( starter + weatherMsg);
	}
}

/*
	correlation alert summary for heart rate
	input:
		drug: FDA drug api count for fatigue complain for a particular drug
		std: std compare result
		drugName: brand name of the medication
	output:
		msg: combined message of findings
*/
function heartRateCorrelationAlert(drug, std, drugName){
	var nothing = "We have found no reason why your heart rate INCREASED. We suggest you visit your PCP.";
	var starter = "We have found your heart rates today is ABNORMAL using sample standard deviation and correlation. But we also found that: <br>";
	var drugMsg = "- your medicine " + drugName + " might be causing HYPERTENSION by using FDA drug complaint database.<br> Here is a link to <a href=http://www.webmd.com/drugs/search.aspx?stype=drug&query=" + drugName + ' target="_blank">WEBMD</a>';
	var stepMsg = "- your step counts decreased or stayed the same today compared to previous dates using sample standard deviation.";
	// hard threshold for FDA drug, no reason for the number
	var drugThreshold = 1000;
	if (drug >= drugThreshold && std == 1){
		return ( starter + drugMsg + " <br> AND <br> " + stepMsg);
	}else if (drug >= drugThreshold && std == 0){
		return ( starter + drugMsg);
	}else if (drug < drugThreshold && std == 1){
		return ( starter + stepMsg);
	}else if (drug < drugThreshold && std == 0){
		return ( nothing);
	}
}

module.exports = {
	deterDataSize
};
