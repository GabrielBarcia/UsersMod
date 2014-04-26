define(['text!templates/admin.html', 
		'text!templates/admin_userCreate.html', 
		'text!templates/admin_userViewEdit.html',
		'account'], 
	   function (templateAdmin, 
				  templateUserCreate, 
				  templateViewEdit,
				  account){
	var viewAdmin = Backbone.View.extend({
		
		el: $('#content'),
		
		render: function() {
			this.$el.html(templateAdmin);
			this.getUserList ( 1, 5 );
		},

		events: {
		
			// ### MAIN ###
			'click #btnUserCreate': 'userCreate',
			'click #btnUserEdit': 'userEdit',
			//click #btnUserDelete': 'userDelete',
			'click #lnkPrevious': 'userListPagePrevious',
			'click #lnkNext': 'userListPageNext',
			
			// ### CreateView (CV) ###
			'click #btnCV_Create': 'CV_Create',
			'click #btnCV_btnCancel': 'CV_Cancel',
			'click #btnCV_btnClear': 'CV_Clear',
			
			// ### Details View (DV) ###
			'click td a.linkshowuser': 'DV_Show',
			'click #btnDV_Close': 'DV_Close',
			'click #btnDV_Cancel': 'DV_Cancel',
			'click #btnDV_Save': 'DV_Save'
			
		},
		
		userListPagePrevious: function () {
			event.preventDefault();
			var page = $(lnkPrevious).attr('rel');
			var itemsPerPage = 5;
			this.getUserList ( page, itemsPerPage );
		},
		
		userListPageNext: function () {
			event.preventDefault();

			var page = $(lnkNext).attr('rel');
			var itemsPerPage = 5;
			this.getUserList ( page, itemsPerPage );
		},
		
		getUserList: function ( page, itemsPerPage ) {
			$.ajax ({
				dataType: 'json',
				type: 'GET',
				url:  '/user/list',
				data: {
					page: page,
					itemsPerPage: itemsPerPage
				},
				success: function ( result ) {
					console.log ('Userlist Query Success');
				    var userListTable = '<table>';
					
					//Headers
					userListTable += '<tr>';
					userListTable += '<td> Username </td>' ;
					userListTable += '<td> Email </td>' ;
					userListTable += '</tr>';
					
					// body
					$.each(result, function(){
						userListTable += '<tr>';
						userListTable += '<td><a href="#" class="linkshowuser" data-rel="' + this._id + '" title="Show Details">' + this.username + '</td>';
						userListTable += '<td>' + this.email + '</td>';
						userListTable += '</tr>';
					});
					userListTable += '</table>';
					// Previous Next
					var previousPage = ( page - 1 ) < 1 ? 1 : page - 1 ;
					var nextPage = previousPage + 2;
					
					userListTable += '<a id="lnkPrevious" href="#" class="pagePrevious" rel="' + previousPage  + '" title="Previous"> Previous </a></br>';
					userListTable += '<a id="lnkNext" href="#" class="pageNext" rel="' + nextPage  + '" title="Next"> Next </a></br>';
					
					$('#frameMain').html(userListTable);
					//$('#content #frameMain').html(userListTable);
				},
				error: function () {
					alert ('error');
				}
			});
		},
		
		/*   =====================
		     ==== USER CREATE ====
		     =====================   */
		
		userCreate: function () {
			event.preventDefault();
			$('#btnUserCreate').prop( 'disabled', true );
			$('#frameDetails').html(templateUserCreate);
			
		},
		
		CV_Create: function () {
			event.preventDefault();
		
			userToRegister = new account.userModel;
			userToRegister.set('username', $('#formCV_Create fieldset input#inputCV_UserName').val() );
			userToRegister.set('email', $('#formCV_Create fieldset input#inputCV_UserEmail').val() );
			userToRegister.set('password', $('#formCV_Create fieldset input#inputCV_UserPassword').val() );

			account.quickRegister ( userToRegister);
			
			//Clear the form fields values
			$('#formCV_Create fieldset input').val('')
		},
		
		CV_Cancel: function () {
			$('#btnUserCreate').prop( 'disabled', false );
			$('#frameDetails').html('');
		
		},
										 
		CV_Clear: function () {
			event.preventDefault();
			$('#formCV_Create fieldset input').val('');
		},
		
		/*   ======================
		     ==== User Details ====
		     ======================   */
		
		DV_Show: function ( event ) {
			event.preventDefault();
			var id = $( event.currentTarget ).data( 'rel' );
			$('#frameDetails').html(templateViewEdit);
			$('#btnUserEdit').prop('disabled', false);
			$('#btnUserDelete').prop('disabled', false);
			$('#btnUserCreate').prop( 'disabled', true );
			$('#btnDV_Close').show();
			
			account.getUserInfo ( id, function( details ){
				
				//Display the properties
				$('#inputDV_id').val(details._id).prop('disabled', true);
				$('#inputDV_UserName').val(details.username).prop('disabled', true);
				$('#inputDV_UserEmail').val(details.email).prop('disabled', true);
				$('#inputDV_UserPassword').val(details.password).prop('disabled', true);
			});
			/*
			<input id="inputDV_id" type="text" style="display:none;"/>
			*/
		},
		
		DV_Close: function ( event ) {
			event.preventDefault();
			$('#btnUserEdit').prop('disabled', true);
			$('#btnUserDelete').prop('disabled', true);
			$('#btnUserCreate').prop( 'disabled', false);
			$('#frameDetails').html('');
			
		},
		
		userEdit: function ( event ) {
			event.preventDefault();
			$('#btnUserEdit').prop('disabled', true);
			$('#btnUserDelete').prop('disabled', true);
			$('#btnUserCreate').prop( 'disabled', true );
			$('#btnDV_Save').show();
			$('#btnDV_Cancel').show();
			$('#btnDV_Close').hide() ;
			$('#inputDV_UserName').prop('disabled', false);
			$('#inputDV_UserEmail').prop('disabled', false);
			$('#inputDV_UserPassword').prop('disabled', false);
			
		},

		DV_Cancel: function ( event ) {
			event.preventDefault();
			
			var confirmation = confirm('All the changes made will not be saved. Do you want to cancel anyway?');
			if ( confirmation == true ) {
				$('#btnUserEdit').prop('disabled', true);
				$('#btnUserDelete').prop('disabled', true);
				$('#btnUserCreate').prop( 'disabled', false);
				$('#frameDetails').html('');

			} else {
				//do nothing
			}
		},
		
		DV_Save: function ( event ) {
			event.preventDefault();
			
			var confirmation = confirm('Do you want to save the changes?');
			if ( confirmation == true ) {
				
				userToUpdate = new account.userModel;
				userToUpdate.set('_id', $('#inputDV_id').val() );
				userToUpdate.set('username', $('#inputDV_UserName').val() );
				userToUpdate.set('email', $('#inputDV_UserEmail').val() );
				userToUpdate.set('password', $('#inputDV_UserPassword').val() );
				
				account.update (userToUpdate, function() {
					console.log ('update ready, closing dialog');
					
					// Probably best idea is to transform DV_Close() into an event
					// with an even agregator and use it instead of repeating code
					
					$('#btnUserEdit').prop('disabled', true);
					$('#btnUserDelete').prop('disabled', true);
					$('#btnUserCreate').prop( 'disabled', false);
					$('#frameDetails').html('');
					
				});
				//userToUpdate.update();
				
			} else {
				//do nothing
			}
			
		}
		
		
	});
	
	return viewAdmin;
});