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
})