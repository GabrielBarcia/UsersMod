define(['text!templates/admin.html', 
		'text!templates/admin_userCreate.html', 
		'text!templates/admin_userViewEdit.html',
		'views/admin_CV',
		'account'], 
	   function (templateAdmin, 
				  templateUserCreate, 
				  templateViewEdit,
				  viewAdminCV,
				  account){
	var viewAdmin = Backbone.View.extend({
		
		el: $('#content'),
		
		currentPage: null,
		itemsPerPage: 5,
		
		render: function() {
			this.$el.html(templateAdmin);
			
			if (this.currentPage == null) {
				this.currentPage = 1;
			}
			this.getUserList ( this.currentPage, this.itemsPerPage );
		},

		events: {
		
			// ### MAIN ###
			'click #btnUserCreate': 'userCreate',
			'click #btnUserEdit': 'userEdit',
			'click #btnUserDelete': 'userDelete',
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
			
			if ( this.currentPage == 1 ){
				//Cannot got lower than 1st page
				this.currentPage = 1;
			} else {
				//decrease a page
				this.currentPage--;
			}
			
			return this.getUserList ( this.currentPage, this.itemsPerPage );
		},
		
		userListPageNext: function () {
			event.preventDefault();

			//increase a page
			//Need to add a logic for a top limit page
			this.currentPage++;
			
			return this.getUserList ( this.currentPage, this.itemsPerPage );
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
					
					//probably will need an update when logic for top page is added
					var nextPage = page + 1;
					
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
			//$('#frameDetails').html(templateUserCreate);
			var createView = new viewAdminCV();
			createView.render();
			
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
			$('#formCV_Create fieldset input').val('')
			
			//update user list
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
			var that = this;
			
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
					
					//Update the list
					that.render();
					
				});
				//userToUpdate.update();
				
			} else {
				//do nothing
			}
			
		},
		
		/*   =====================
		     ==== User Delete ====
		     =====================   */
		
		userDelete: function ( event ) {
			event.preventDefault();
			var that = this;
			
			var confirmation = confirm('Do you want to delete this user?');
			if ( confirmation == true ) {
				
				userToDelete = new account.userModel;
				userToDelete.set('_id', $('#inputDV_id').val() );
				
				account.del (userToDelete, function() {
					console.log ('deletion succesful, closing dialog');
					
					// Probably best idea is to transform DV_Close() into an event
					// with an even agregator and use it instead of repeating code
					
					$('#btnUserEdit').prop('disabled', true);
					$('#btnUserDelete').prop('disabled', true);
					$('#btnUserCreate').prop( 'disabled', false);
					$('#frameDetails').html('');
					
					//Update the list
					that.render();
					
				});
				
				
			} else {
				//do nothing
			}
			
		}
		
		
	});
	
	return viewAdmin;
});