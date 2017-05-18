$(document).ready(function(){
	// TODO: do a ajax request to get this json file
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
	
	$("#firstName").empty().append(data.firstName);
	$("#lastName").empty().append(data.lastName);
	$("#eAddress").empty().append(data.email);
	$("#eContacts").empty().append(data.emergencyContact);
	$("#Medicine").empty().append(data.drug);
	$("#zipCode").empty().append(data.zip);
	$("#occp").empty().append(data.occupation);
	
	$('#viewProfile').click(function(){
		window.location.href = "profile.html";
	})
	
	$('#savebtn').click(function(){
		//TODO: extract info and send to server
	})
	
});



//if(localStorage.tasks!="")
//  document.getElementById("EmailList").innerHTML=localStorage.tasks;

/*
function addEmail(){
  var taskcontent=document.getElementById("emailContent").value;
  var taskbox=document.createElement("div");
  taskbox.className="task";
  document.getElementById("EmailList").appendChild(taskbox);
  var inputtext=document.createElement("label");
  inputtext.innerHTML=taskcontent;
  taskbox.appendChild(inputtext);

  // var inputcheckbox=document.createElement("input");
  // inputcheckbox.type="checkbox";
  // taskbox.appendChild(inputcheckbox);
*/

  

/*
function addMedicine(){
  var taskcontent=document.getElementById("medicineContent").value;
  var taskbox=document.createElement("div");
  taskbox.className="task";
  document.getElementById("MedicineList").appendChild(taskbox);
  var inputtext=document.createElement("label");
  inputtext.innerHTML=taskcontent;
  taskbox.appendChild(inputtext);
}
*/