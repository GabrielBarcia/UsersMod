// Functions ============================================
define(['Backbone'], function () {

	userModel = Backbone.Model.extend({
		urlRoot: '/user',

		defaults: {
			'username': '',
			'email': '',
			'password': ''
		},
			initialize: function() {
		}
		
	});

	newUser = new userModel;

	quickRegister = function (newUser) {

		newUser.save (
			null,
			{
				success: function( model, response ) {
					console.log('Created user ' + newUser.get('username'));
					//Clear the form fields values
					//$('#formQuickRegister fieldset input').val('')
			},
			error: function(model, response) {
				console.log('Error creating user '+ newUser.get('username'));
			}
		});
	};
	
	var getUserInfo = function ( id, callback ) {
		
		$.ajax ({
			dataType: 'json',
			type: 'GET',
			url: '/user',
			data: {
				id: id
			},
			success: function ( result ) {
				return callback ( result );
			},
			error: function () {
				//error
			}
			
		});
			
	};

	
	return {
		userModel: userModel,
		quickRegister: quickRegister,
		getUserInfo: getUserInfo
	};
});
	   

/*
define(['Backbone'], function (event) {
	
	register = function (event) {
		event.preventDefault();
		
		userToRegister = newUser;
		userToRegister.set('username', $('#formQuickRegister fieldset input#inputUserName').val() );
		userToRegister.set('email', $('#formQuickRegister fieldset input#inputUserEmail').val() );
		userToRegister.set('password', $('#formQuickRegister fieldset input#inputUserPassword').val() );
		
		account.quickRegister ( userToRegister);
		
	};
	
	
	return {
		register: register
	};
});



	function openAdmintool (event) {
		event.preventDefault();
		window.location.href = '/useradmin';
	}
*/
	   
	
// Save just in fCase
	
/*
		quickRegister = function (newUser) {
			
			newUser.save (
			{
				'username': $('#formQuickRegister fieldset input#inputUserName').val(),
				'email': $('#formQuickRegister fieldset input#inputUserEmail').val(),
				'password': $('#formQuickRegister fieldset input#inputUserPassword').val()
			},
			{
				success: function(model, response) {
					console.log('Created user ' + newUser.get('username'));
					//Clear the form fields values
					$('#formQuickRegister fieldset input').val('')
				},
				error: function(model, response) {
					console.log('Error creating user '+ newUser.get('username'));
				}
			}

		======================================================================
		
		{
			'username': newUser.get('username'),
			'email': newUser.get('email'),
			'password': newUser.get('password')
		}


*/
	
	