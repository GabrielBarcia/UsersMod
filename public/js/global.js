/*

// DOM Ready ============================================
$(document).ready( function () {

    // Register new user click
    $('#btnRegisterNow').on('click', register);
	$('#linkAdmintool').on('click', openAdmintool);

});

// Functions ============================================

function openAdmintool (event) {
	event.preventDefault();
	window.location.href = '/useradmin';
}


function register (event) {
    event.preventDefault();
    
    User = Backbone.Model.extend({
        urlRoot: '/user',
        
        defaults: {
            'username': '',
            'email': '',
            'password': ''
        },
    
        initialize: function() {
        }
    });
    
	newUser = new User;

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
	);
}



define(['jQuery', 'account'], function( jQuery, account ){
	$(document).ready( function () {

    // Register new user click
    $('#btnRegisterNow').on('click', account.register());
	//$('#linkAdmintool').on('click', openAdmintool);

	});
	
});

*/

define(['router'], function (router) {
	var initialize = function (){
	   checkLogin(runApplication);
	};
	
	var checkLogin = function (callback) {
		$.ajax('/account/authenticated', {
			method: 'GET',
			success: function () {
				return callback(true);
			},
			error: function() {
				return callback(false);
			}
		});
	};
	
	var runApplication = function (authenticated) {
		if (authenticated) {
			window.location.hash = 'login';
		} else {
			window.location.hash = 'index';
		}
		//Backbone.history.start({pushState: true});
		Backbone.history.start();
	};
	
	return {
	   initialize: initialize
	};
});
