// Functions ============================================
define(['Backbone'], function () {

	userModel = Backbone.Model.extend({
		urlRoot: '/user',
		
		idAttribute: '_id',

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

	var update = function ( user, callback ) {
		
		console.log('reach account');
		if ( user._id == false ) {
			console.log ('Insufficient data to update the user');
		} else {
			
			console.log (user);
			
			user.save(
				null,
				{
					success: function () {
						console.log ('Modified user _id: ' + user._id);
						callback();
					}
				}
			);
		}
	}
	
	return {
		userModel: userModel,
		quickRegister: quickRegister,
		getUserInfo: getUserInfo,
		update: update
	};
});