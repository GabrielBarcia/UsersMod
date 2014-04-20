define(['text!templates/index.html', 'account'], function (templateIndex, account){
	var viewIndex = Backbone.View.extend({
		el: $('#content'),
		
		render: function() {
			this.$el.html(templateIndex);
		},

		events: {
			'click #btnRegisterNow': 'register',
			'click #btnLogin': 'login'
		},
		
		register: function () {
			event.preventDefault();
		
			userToRegister = new account.userModel;
			
			userToRegister.set('username', $('#formQuickRegister fieldset input#inputUserName').val() );
			userToRegister.set('email', $('#formQuickRegister fieldset input#inputUserEmail').val() );
			userToRegister.set('password', $('#formQuickRegister fieldset input#inputUserPassword').val() );

			account.quickRegister ( userToRegister);
			
			//Clear the form fields values
			$('#formQuickRegister fieldset input').val('')
		},
		
		login: function() {
			event.preventDefault();
			
			$.ajax ({
				type: 'POST',
				url:  '/login',
				data: {
					email: $('#formLogin fieldset input#inputLoginUserName').val(),
					password: $('#formLogin fieldset input#inputLoginUserPassword').val()
				},
				success: function () {
					
					window.location.hash = 'admin';
					//router.navigate('/admin');
				},
				error: function () {
					alert ('error');
				}
			});
		}
	});
	
	return viewIndex;
});