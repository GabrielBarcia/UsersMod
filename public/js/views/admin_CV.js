define(['text!templates/admin_userCreate.html', 
		'account'], 
	   function ( templateUserCreate, 
				  account){
	
	var viewAdminCV = Backbone.View.extend({
		
		el: $('#frameDetails'),
		
		render: function() {
			console.log('Reached render on admin_CV.js');
			//this.$el.html(templateUserCreate);
			$('#frameDetails').html(templateUserCreate);
			
			//disable the user create button, this should be done before calling this view.
			$('#btnUserCreate').prop( 'disabled', true );
			
		},

		events: {
		
			// ### CreateView (CV) ###
			'click #btnCV_Create': 'CV_Create',
			'click #btnCV_btnCancel': 'CV_Cancel',
			'click #btnCV_btnClear': 'CV_Clear'
			
		},
		
		CV_Create: function () {
			event.preventDefault();
			var that = this;
		
			userToRegister = new account.userModel;
			userToRegister.set('username', $('#formCV_Create fieldset input#inputCV_UserName').val() );
			userToRegister.set('email', $('#formCV_Create fieldset input#inputCV_UserEmail').val() );
			userToRegister.set('password', $('#formCV_Create fieldset input#inputCV_UserPassword').val() );

			account.quickRegister ( userToRegister);
			
			//Clear the form fields values
			$('#formCV_Create fieldset input').val('');
			
			//update user list
			//Admin view has to know that something has change.
			//look for an available event or something
			this.render();
			
		},
		
		CV_Cancel: function () {
			$('#btnUserCreate').prop( 'disabled', false );
			$('#frameDetails').html('');
		
		},
										 
		CV_Clear: function () {
			event.preventDefault();
			$('#formCV_Create fieldset input').val('');
		},
		
	});
	return viewAdminCV;
	
});