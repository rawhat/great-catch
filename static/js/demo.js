// functions
$(document).ready(function(){
	
	// click submit
	$("#getCase").click(function(){
		$('#assessment').text('');
		$('#assessment').removeClass('alert alert-info alert-warning');
		var chart = $("#myChart");
		var choice = $('#caseChoice').find(":selected").val();
		var data = getData(choice);
		$('#infoDisplay').html("Medication: " + data.drug + "<br>Zip Code: " + data.zip);
		var myChart = new Chart(chart, {
			type: 'line',
			data: {
				labels: data.date,
				datasets: [{
					label: 'Step Count - past ' + data.steps.length + ' days',
					data: data.steps.slice(0, -1),
					borderColor: 'rgba(255, 99, 132, 0.2)',
					fill: false,
					borderWidths: 10
				},{
					label: 'Step Count - past ' + data.steps.length + ' days',
					data: data.steps.slice(1, data.steps.length),
					borderColor: 'rgba(255, 153, 0, 0.4)',
					fill: false,
					borderWidths: 10
				},{
					label: 'Heart Rate - past ' + data.steps.length + ' days',
					data: data.heartRates.slice(0, -1),
					borderColor: 'rgba(255, 206, 86, 0.2)',
					fill: false,
					borderWidths: 10
				},{
					label: 'Heart Rate - past ' + data.steps.length + ' days',
					data: data.heartRates.slice(1, data.heartRates.length),
					borderColor: 'rgba(153, 102, 255, 0.2)',
					fill: false,
					borderWidths: 10
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
	
	// return fake data
	function getData(choice){
		var data;
		if (choice == 'case1'){
			// no change
			data = {
				"steps":[1000, 1000, 1000],
				"heartRates":[60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3"],
				"drug":"N/A",
				"zip":19104
			}; 
		}else if (choice == 'case2'){
			// increase
			data = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"N/A",
				"zip":19104
			};
		}else if (choice == 'case3'){
			// decrease
			data = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 1000],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"N/A",
				"zip":19104
			}; 
		}else if (choice == 'case4'){
			// decrease due to weather
			data = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 1000],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"N/A",
				"zip":19104
			}; 
		}else if (choice == 'case5'){
			// decrease due to medication
			data = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 1000],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"Ritalin",
				"zip":19104
			}; 
		}else if (choice == 'case6'){
			// decrease due to both weather and medication
			data = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 300],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"LETAIRIS",
				"zip":19104
			}; 
		}
		return data;
	};
	
	// go back to profile
	$('#goBack').click(function(){
		window.location.href = "/html/profile.html";
	});
	
});