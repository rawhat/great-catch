// functions
$(document).ready(function(){
	// when you click on edit profile
	$("#editProfile").click(function(){
		window.location.href = "editProfile.html";
	});
	
	// when you click on authentication
	$("#authenticateFitbit").click(function(){
		window.location.href = "/auth/fitbit";
	});
	
	// when you click on logout
	$("#logOut").click(function(){
		window.location.href = "index.html";
		window.sessionStorage.clear();
	});
	
	
	// check fitbit authentication status
	$.ajax('/api/fitbit/test', {
		beforeSend: (xhr) => {
			xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('sessionToken')}`)
		}
	})
	.then((response) => {
		if(JSON.parse(response))
			$('#fitbit-auth-link').remove();
	});

	// TODO: replace this data with a get from server, return a data variable called data in json format
data = {
	"_COMMENTS": "ABNORMAL step w/ weather and drug, ABNORMAL heart rate w/ step and drug, prednisone is a steroid that treat many diseases, focus on inflammation",
	"firstName": "Daniel",
	"lastName": "Grayson",
	"email": "Daniel.Grayson@drexel.edu",
	"emergencyContact": "TinnaWang@aol.com",
	"occupation": "90 Years Old Man",
	"steps":[1139, 1400, 1211, 1310, 1499, 1257, 1510, 1303, 1215, 1244, 1550, 1220, 1120, 1220, 1000],
	"stepSTD": 137.99,
	"heartRates":[72, 68, 68, 72, 70, 69, 68, 69, 71, 72, 69, 68, 68, 69, 73],
	"heartRatesSTD": 1.61,
	"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14", "Day 15"],
	"drug":"prednisone",
	"zip":50002	
}; 

	
	// this will be triggered after retrieving json data
	$("#userName").empty().append(data.firstName + " " + data.lastName);
	$("#firstName").empty().append(data.firstName);
	$("#lastName").empty().append(data.lastName);
	$("#eAddress").empty().append(data.email);
	$("#eContacts").empty().append(data.emergencyContact);
	$("#Medicine").empty().append(data.drug);
	$("#zipCode").empty().append(data.zip);
	$("#occp").empty().append(data.occupation);
	
	// click on show profile analysis button
	$('#profileAnalysis').click(function(){
		var chart = $('#myChart');
		$('#assessment').text('');
		$('#assessment').removeClass('alert alert-info alert-warning');
		stepSTD1 = convertToArray(data.stepSTD, data.steps, data.date.length, true);
		stepSTD2 = convertToArray(data.stepSTD, data.steps, data.date.length, false);
		hearRatesSTD1 = convertToArray(data.heartRatesSTD, data.heartRates, data.date.length, true);
		hearRatesSTD2 = convertToArray(data.heartRatesSTD, data.heartRates, data.date.length, false);
		var myChart = new Chart(chart, {
			type: 'line',
			data: {
				type: 'line',
				labels: data.date,
				datasets: [{
					label: 'Step Count',
					data: data.steps,
					borderColor: 'rgba(255, 159, 64, 1)',
					fill: false,
					pointRadius: 5
				},{
					label: 'Step Count + STD',
					data: stepSTD1,
					borderColor: 'rgba(153,255,51,0.4)',
					fill: false,
					pointRadius: 0
				},{
					label: 'Step Count - STD',
					data: stepSTD2,
					borderColor: 'rgba(153,255,51,0.4)',
					fill: false,
					pointRadius: 0
				}]
			},
			options: {
				scales: {
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Step Count (n)'
						}
					}]
				}
			}
		});
		
		var chart2 = $("#myChart2");
		var myChart = new Chart(chart2, {
			type: 'line',
			data: {
				labels: data.date,
				datasets: [{
					label: 'Heart Rate',
					data: data.heartRates,
					borderColor: 'rgba(255, 159, 64, 1)',
					fill: false,
					pointRadius: 5
				},{
					label: 'Heart Rate + STD',
					data: hearRatesSTD1,
					borderColor: 'rgba(153,255,51,0.4)',
					fill: false,
					pointRadius: 0
				},{
					label: 'Heart Rate - STD',
					data: hearRatesSTD2,
					borderColor:  'rgba(153,255,51,0.4)',
					fill: false,
					pointRadius: 0
				}]
			},
			options: {
				scales: {
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Heart Rate (bpm)'
						}
					}]
				}
			}
		});

		$.post('/analysis/step', {
			data
		}).then((res) => {
			$('#assessment').html(res);
			if(res.search('no reason') === -1) {
				$('#assessment').addClass('w3-light-blue');
			}
			else {
				$('#assessment').addClass('w3-pale-yellow');
			}
		});
		
	});

	// get requested data
	$("#request_fitbit_data").click(function(){
		var chart = $('#myChart');
		var dataType = $('[name="fitbit_dataType"] option:selected').val()
		var range = $('[name="range"] option:selected').val()
		var startDate = $('[name="selected_date"]').val()

		$.ajax({
			type: "POST",
			url: "/api/fitbit",
			data: {
				data_set: dataType,
				date: startDate,
				period: range
			},
			beforeSend: (xhr) => {
				xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('sessionToken')}`)
			}
		})
		.done((data) => {
			var chartData = data['activities-steps'];
			var scatterChart = new Chart(chart, {
				type: 'bar',
				data: {
					labels: chartData.map(point => point.dateTime),
					datasets: [{
						label: 'Activities: Steps',
						data: chartData.map(point => point.value)
					}]
				}
			});
		})
		.fail((e) => {
			console.error('Oh no!');
			console.error(e);
		});
	});
	
	// helper function for converting a number to array
	function convertToArray(std, data, length, which){
		//calc mean
		dataMean = 0;
		for (i=0; i<length; i++){
			dataMean += data[i];
		}
		dataMean = dataMean/length;
		array = [];
		temp = 0;
		if (which){	
			temp = dataMean + std;
		}else{
			temp = dataMean - std;
		}	
		
		for (i=0; i<length; i++){
			array.push(temp)
		}
		return array;
	}
});
