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
		var maxY = Math.max(...data.steps);
		var dataLength = data.steps.length - 1;
		var myChart = new Chart(chart, {
			type: 'line',
			data: {
				labels: data.date,
				datasets: [{
					label: 'Step Count - past ' + dataLength + ' days',
					data: data.steps.slice(0, -1),
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					fill: false,
					pointDotRadius: 10
				},{
					label: 'Step Count - past ' + dataLength + ' days',
					data: data.steps.slice(1, data.steps.length),
					backgroundColor: 'rgba(255, 153, 0, 0.4)',
					fill: false,
					pointDotRadius: 10
				},{
					label: 'Heart Rate - past ' + dataLength + ' days',
					data: data.heartRates.slice(0, -1),
					backgroundColor: 'rgba(255, 206, 86, 0.2)',
					fill: false,
					pointDotRadius: 10
				},{
					label: 'Heart Rate - past ' + dataLength + ' days',
					data: data.heartRates.slice(1, data.heartRates.length),
					backgroundColor: 'rgba(153, 102, 255, 0.2)',
					fill: false,
					pointDotRadius: 10
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true,
							max: maxY + 200
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
			data = {
				"steps":[1000],
				"heartRates":[70],
				"date":["Day 1"],
				"drug":"N/A",
				"zip":19104
			}; 
		}else if (choice == 'case2'){
			data = {
				"steps":[1000, 1000, 1000, 1000],
				"heartRates":[60, 60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3", "Day 4"],
				"drug":"N/A",
				"zip":19104
			};
		}else if (choice == 'case3'){
			data = {
				"steps":[1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"N/A",
				"zip":19104
			}; 
		}else if (choice == 'case4'){
			data = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"N/A",
				"zip":19104
			}; 
		}else if (choice == 'case5'){
			data = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 1000],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"LETAIRIS",
				"zip":19104
			}; 
		}else if (choice == 'case6'){
			data = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 1000],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"N/A",
				"zip":98104
			}; 
		}else if (choice == 'case7'){
			data = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 1000],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"LETAIRIS",
				"zip":98104
			}; 
		}else if (choice == 'case8'){
			data = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 1000],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"Ritalin",
				"zip":19104
			}; 
		}else if (choice == 'case9'){
			data = {
				"steps":[1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 500],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 100],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"N/A",
				"zip":19104
			}; 
		}else if (choice == 'case10'){
			data = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 100],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"prednisone",
				"zip":19104
			}; 
		}else if (choice == 'case11'){
			data = {
				"steps":[1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 500],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 100],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"prednisone",
				"zip":19104
			}; 
		}else if (choice == 'case12'){
			data = {
				"steps":[1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 100],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"Piroxicam",
				"zip":19104
			}; 
		}else if (choice == 'case13'){
			data = {
				"steps":[1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 500],
				"heartRates":[60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 100],
				"date":["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14"],
				"drug":"prednisone",
				"zip":98104
			}; 
		}
		
		return data;
	};

	// go back to profile
	$('#goBack').click(function(){
		window.location.href = "/html/profile.html";
	});
	
});