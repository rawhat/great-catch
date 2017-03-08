// functions
$(document).ready(function(){
	// when you click on submit
	$("#signUn_submit").click(function(){
		var firstName = $('[name="firstname"]').val();
		var lastName = $('[name="lastname"]').val();
		var email = $('[name="email"]').val();
		var passWord = $('[name="pw"]').val();
		
		$.post(
			"http://localhost:3000/graphql",
			'<some query>',
			function(response){
				if (response.errors){
					console.log("error");
				}else{
					console.log(response.data);
				}
			}
		)
		
	});
})
