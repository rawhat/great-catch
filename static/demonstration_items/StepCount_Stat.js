/*
	this is statical analysis module for step counts

	using this simple-statistics package
	API doc: 
	http://simplestatistics.org/docs/
	
	
	last mod 04/29/17
	

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
		data: step count data
	output: 
		regrObj.m: the slow attribute of the linearRegression return object
*/
function calcLinearRegr(data){
	// create coordinate pairs
	var xy = [];
	for (var i = 0; i < data.length; i++){
		xy.push([i, data[i]]);
	}
	
	// calc linear regression
	var regrObj = stat.linearRegression(xy);
	
	// return slope
	return regrObj.m;
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
	
	// get slope of old data
	var oldSlope = calcLinearRegr(oldData);
	// get slope of extended data
	var newSlope = calcLinearRegr((originData.steps).slice(1));
	
	// if new slope is equal or lower than old slope
	if (newSlope < oldSlope){
		let weather = await weatherCheck(originData.zip);
		let response = await drugCheck(originData.drug, weather);
		return response;
	}else{
		return ("We have determined your step count today is NORMAL using linear regression.<br> Your new data has a slope greater than equal to 0.");
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
	
	// get slope of old data
	var oldSlope = calcLinearRegr(oldData);
	// get slope of extended data
	var newSlope = calcLinearRegr((originData.heartRates).slice(1));
	
	// if new slope is greater, increased heart rate, something is wrong
	if (newSlope > oldSlope){
		let slope = calcLinearRegr((originData.steps).slice(1));
		let response = await drugHeartRateCheck(originData.drug, slope);
		return response;
	}else{
		return ("We have determined your heart rate today is NORMAL using linear regression.<br> Your new data has a slope greater than or equal to 0.");
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
		return ("has been determined ABNORMAL using mean absolute deviation (MAD).<br> Your new MAD value is less than or equal to old MAD.");
	}else{
		return ("has been determined NORMAL using mean absolute deviation (MAD).<br> Your new MAD value is greater than old MAD.");
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
		return ("Step Count " + stepMsg + " AND " + "<br>Heart Rates ")
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
	var oldData = data.slice(0, -2);
	var newData = data.slice(-1)[0];
	
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
		slope: result from step count linear regression
	output:
		heartRateCorrelationAlert: a function that combine correlation alerts summary
*/
async function drugHeartRateCheck(drug, slope){
	if(drug.toUpperCase() === "N/A") {
		return heartRateCorrelationAlert(0, slope, drug);
	}
	else {
		var key = "kZ1dIlu9TyKAzlXidiBuejvdfXmQmLWpq2BF0wqY";
		var url = "https://api.fda.gov/drug/event.json?api_key=" + key + "&search=reaction.reactionmeddrapt.exact=" + "HYPERTENSION" + "+AND+brand_name:" + drug;
		let response = await axios.get(url);
		let parsed = response.data;

		if(parsed.meta) {
			var count = parsed.meta.results.total;
			return heartRateCorrelationAlert(count, slope, drug);
		}
		else {
			return heartRateCorrelationAlert(0, slope, drug);
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
	var starter = "We have found your step count today is ABNORMAL. But we also found that ";
	var drugMsg = "your medicine " + drugName + " might be making you FATIGUE by using FDA drug complaint database.<br> Here is a link to WEBMD http://www.webmd.com/drugs/search.aspx?stype=drug&query=" + drugName;
	var weatherMsg = "today's weather around your location is bad. There was either rain, snow, hail, thunderstorm, fog, tornado or combination of these.";
	// hard threshold for FDA drug, no reason for the number
	var drugThreshold = 1000;
	if (drug >= drugThreshold && weather > 0){
		return ( starter + drugMsg + " AND " + weatherMsg);
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
		slope: linear regression of step count
		drugName: brand name of the medication
	output:
		msg: combined message of findings
*/
function heartRateCorrelationAlert(drug, slope, drugName){
	var nothing = "We have found no reason why your heart rate INCREASED. We suggest you visit your PCP.";
	var starter = "We have found your heart rates today is ABNORMAL. But we also found that ";
	var drugMsg = "your medicine " + drugName + " might be causing HYPERTENSION by using FDA drug complaint database.<br> Here is a link to WEBMD http://www.webmd.com/drugs/search.aspx?stype=drug&query=" + drugName;
	var stepMsg = "your step counts decreased or stayed the same today compared to previous dates using linear regression.";
	// hard threshold for FDA drug, no reason for the number
	var drugThreshold = 1000;
	if (drug >= drugThreshold && slope <= 0){
		return ( starter + drugMsg + " AND " + stepMsg);
	}else if (drug >= drugThreshold && slope <= 0){
		return ( starter + drugMsg);
	}else if (drug < drugThreshold && slope > 0){
		return ( nothing);
	}else if (drug < drugThreshold && slope > 0){
		return ( starter + weatherMsg);
	}
}

module.exports = {
	deterDataSize
};
