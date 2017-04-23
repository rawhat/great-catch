$(document).ready(function(){

	$('.form').find('input, textarea').on('keyup blur focus', function (e) {
		var $this = $(this),
		label = $this.prev('label');
		
		if (e.type === 'keyup') {
			if ($this.val() === '') {
				label.removeClass('active highlight');
			} else {
				label.addClass('active highlight');
			}
		} else if (e.type === 'blur') {
			if( $this.val() === '' ) {
				label.removeClass('active highlight'); 
			} else {
				label.removeClass('highlight');   
			}   
		} else if (e.type === 'focus') {
			if( $this.val() === '' ) {
				label.removeClass('highlight'); 
			} else if( $this.val() !== '' ) {
				label.addClass('highlight');
			}
		}
	});

	$('.tab a').on('click', function (e) {
		e.preventDefault();
		$(this).parent().addClass('active');
		$(this).parent().siblings().removeClass('active');
		target = $(this).attr('href');
		$('.tab-content > div').not(target).hide();
		$(target).fadeIn(600);
	});
	
	// click sign up submit
	$('#signUpSubmit').click(function(){
		var firstName = $('#firstName').val();
		var lastName = $('#lastName').val();
		var email = $('#email').val();
		var passWord = $('#passWord').val();
		var passWordRepeat = $('#passWordRepeat').val();
		
		//post info
		$.post(
			"/user/create",
			{
				username: firstName+lastName,
				email,
				password: passWord,
				password_repeat: passWordRepeat
			},
			function(data, status){
				if (status == "success"){
					sessionStorage.setItem("sessionToken", data.token);
					sessionStorage.setItem("userName", data.username);
					sessionStorage.setItem("email", data.email);
					window.location.href = "/html/profile.html";
				}else{
					alert("Failed");
				}
			}
		)
	});
	
	// click sign in submit
	$('#loginSubmit').click(function(){
		var loginUserName = $('#loginUserName').val();
		var loginPassWord = $('#loginPassWord').val();
		
		// send post
		$.post(
			"/login",
			{
				username: loginUserName,
				password: loginPassWord
			},
			
			function(data, status){
				if (status == "success"){
					sessionStorage.setItem("sessionToken", data.token);
					sessionStorage.setItem("userName", data.username);
					sessionStorage.setItem("email", data.email);
					
					window.location.href = "/html/profile.html"
				}else{
					alert("Failed");
				}
			}
		)
	});
});