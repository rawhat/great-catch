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
			"firstName": "Wenyu",
			"lastName": "Xin",
			"email": "wx28@drexel.edu",
			"emergencyContact": "wenyu.xin@drexel.edu",
			"occupation": "Student",
			"steps":[1139, 1400, 1211, 1310, 1499, 1257, 1510, 1303, 1215, 1244, 1550, 1220, 1120, 1220, 1200],
			"stepsLabel": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			"stepSTD": 20,
			"heartRates":[69, 68, 68, 72, 70, 69, 68, 69, 71, 72, 69, 68, 68, 69, 71],
			"heartRatesLabel":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			"heartRatesSTD": 11,
			"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14", "Day 15"],
			"drug":"N/A",
			"zip":19104
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
		var myChart = new Chart(chart, {
			type: 'line',
			data: {
				type: 'line',
				labels: data.date,
				datasets: [{
					label: 'Step Count',
					data: data.steps,
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					fill: false,
					pointRadius: 2
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						},
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
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
					fill: false,
					pointRadius: 2
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						},
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
			if(res.search('AND') === -1) {
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
});
