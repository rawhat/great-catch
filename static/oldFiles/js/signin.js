// functions
$(document).ready(function(){
	// when you click on submit
	$("#signInBtn").click(function(){
		// parse all information
		var userName = $('[name="username"]').val();
		var passWord = $('[name="pw"]').val();

		// send a post to /login endpoint
		$.post(
			// url
			"/login",
			// data
			{ 
				username: userName,
				password: passWord
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