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
	
	// TODO: this is supid, need to change the DB to store first/last name
	var names = username.split(/(?=[A-Z])/);
	$("#userName").empty().append(names[0] + " " + names[1] + "!");
	$("#firstName").empty().append(names[0]);
	$("#lastName").empty().append(names[1]);
	$("#eAddress").empty().append(email);
	
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