// functions
$(document).ready(function(){
	// when you click on submit
	$("#signUn_submit").click(function(){
		// parse all information
		var firstName = $('[name="firstname"]').val();
		var lastName = $('[name="lastname"]').val();
		var email = $('[name="email"]').val();
		var passWord = $('[name="pw"]').val();
		
		// send a post to /user/create endpoint
		$.post(
			// url
			"/user/create",
			// data
			{ 
				username: firstName+lastName,
				email,
				password: passWord,
				password_repeat: passWord	
			},
			// function after data received
			function(data, status){
				// TODO: exact function to be implemented
				if (status == "success"){
					// token manage
					sessionStorage.setItem("sessionToken", data.token);
					sessionStorage.setItem("userName", data.username);
					sessionStorage.setItem("email", data.email);
					//console.log(sessionStorage.getItem("sessionToken"));
					
					// redirect to profile page
					window.location.href = "/html/profile.html"
				}else{
					alert("Failed");
				}
			}
			
		)
		
	});
})
