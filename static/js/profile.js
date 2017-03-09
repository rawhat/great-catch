// functions
$(document).ready(function(){
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

		$.post(
			// url
			"/api/fitbit",
			// data
			{ 
				data_set: dataType,
				date: startDate,
				period: range	
			},
			// function after data received
			function(data, status){
				// TODO: exact function to be implemented
				if (status == "success"){
					console.log("do something");
				}else{
					alert("Failed");
				}
			}
			
		)
	});
})