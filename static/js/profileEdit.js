if(localStorage.tasks!="")
  document.getElementById("EmailList").innerHTML=localStorage.tasks;

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


  if (window.localStorage) {
      localStorage.setItem("tasks",document.getElementById("list").innerHTML);
    } else {
      Cookie.write("tasks", document.getElementById("list").innerHTML);
    }
}

function addMedicine(){
  var taskcontent=document.getElementById("medicineContent").value;
  var taskbox=document.createElement("div");
  taskbox.className="task";
  document.getElementById("MedicineList").appendChild(taskbox);
  var inputtext=document.createElement("label");
  inputtext.innerHTML=taskcontent;
  taskbox.appendChild(inputtext);


}
