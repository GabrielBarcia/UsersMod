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
		
		if ( user._id == false ) {
			console.log ('Insufficient data to update the user');
		} else {
			console.log ( 'account updating id:' + user.get('_id') );
			user.save(
				null,
				{
					success: function ( model, response, options ) {
						callback();
					}
				}
			);
		}
	}
	
	var del = function ( user, callback ) {
		
		if ( user._id == false ) {
			console.log ('Insufficient data to delete the user');
		} else {
			console.log ('Deleting user ' + user.get('_id'));
			user.destroy (
				null,
				{
					success: function ( model, response, options ) {
						console.log ('Delet user _id: ' + user.get('_id'));
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
		update: update,
		del: del
	};
});