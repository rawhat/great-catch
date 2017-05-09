// functions
$(document).ready(function(){
	var chart = $('#myChart');

	$.ajax('/api/fitbit/test', {
		beforeSend: (xhr) => {
			xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('sessionToken')}`)
		}
	})
	.then((response) => {
		if(JSON.parse(response))
			$('#fitbit-auth-link').remove();
	});

	var email = sessionStorage.getItem('email');
	var username = sessionStorage.getItem('userName');

	// TODO: uncomment this once I am done with profile analysis button
	//var names = username.split(/(?=[A-Z])/);
	//$("#userName").empty().append(names[0] + " " + names[1] + "!");
	//$("#firstName").empty().append(names[0]);
	//$("#lastName").empty().append(names[1]);
	//$("#eAddress").empty().append(email);
	
	// click on show profile analysis button
	$('#profileAnalysis').click(function(){
		// TODO: replace this data with a get from server, return a data variable called data in json format
		data = {
				"steps":[1139, 1400, 1211, 1310, 1499, 1257, 1510, 1303, 1215, 1244, 1550, 1220, 1120, 1220, 900],
				"steps_label": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				"heartRates":[69, 68, 68, 72, 70, 69, 68, 69, 71, 72, 69, 68, 68, 69, 71],
				"heartRates_label":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"N/A",
				"zip":19104
		}; 
		$('#assessment').text('');
		$('#assessment').removeClass('alert alert-info alert-warning');
		var chart = $("#myChart");
		var myChart = new Chart(chart, {
			type: 'line',
			data: {
				labels: data.date,
				datasets: [{
					label: 'Step Count',
					data: data.steps,
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					fill: false,
					pointDotRadius: 10
				},{
					label: 'Step Count + 1 STD',
					data: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500],
					backgroundColor: 'rgba(54, 162, 235, 1)',
					fill: false,
					pointDotRadius: 10
				},{
					label: 'Step Count - 1 STD',
					data: [900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900],
					backgroundColor: 'rgba(255,99,132,1)',
					fill: false,
					pointDotRadius: 10
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
							labelString: 'Step Count (n) / Heart Rate (bpm)'
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
					pointDotRadius: 10
				},{
					label: 'Heart Rate + 1 STD',
					data: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
					backgroundColor: 'rgba(255, 206, 86, 1)',
					fill: false,
					pointDotRadius: 10
				},{
					label: 'Heart Rate - 1 STD',
					data: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
					backgroundColor: 'rgba(75, 192, 192, 1)',
					fill: false,
					pointDotRadius: 10
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
							labelString: 'Step Count (n) / Heart Rate (bpm)'
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
				$('#assessment').addClass('alert alert-info');
			}
			else {
				$('#assessment').addClass('alert alert-warning');
			}
		});
		
	});

	$("#request_fitbit_data").click(function(){
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
