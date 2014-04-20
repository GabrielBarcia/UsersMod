module.exports = function ( models, mongoose ) {
	
	//user.actions check if authenticated
	var authenticated = function(req, res){
		if( req.session.loggedIn ) {
			res.send(200);
		} else {
			res.send(401);
		}
	};
	

	//user.actions register
	var register = function ( req, res ) {
		if ( req.body.username === '' || 
			req.body.email === '' || 
			req.body.password === '' ) {

			//Some field is blank - insufficient information
			console.log('User creation failure: Insufficient data');
			res.json(400);

		} else {

			var newUser = new models.account.user ({
				username: req.body.username,
				email: req.body.email,
				password: req.body.password
			});

			models.account.register ( newUser, function (succ) {
				console.log (succ);
				if ( succ === true ) {
					res.json(200);
				} else {
					res.json(400);
				}
			});
		}
	};


	//user.actions login
	var login = function ( req, res ) {
		
		var email = req.body.email;
		var password = req.body.password;
		
		if ( email === '' ||
		   password === '' ) {
			
			//Some field is blank - insufficient information
			console.log('User creation failure: Insufficient data');
			res.json(400);
			
		} else {

			models.account.login ( email, password, function ( result ) {
				console.log ( result );
				if ( result != null ) {
					console.log('Login Succesful');
					req.session.loggedIn = true;
					req.session.accountId = result._id;
					res.json (200, {});
				} else {
					console.log('Login NOT Succesful');
					res.json (401, {});
				}
			});
		}
		
	};


	var userList = function ( req, res ) {
		var page = req.param('page');
		var itemsPerPage = req.param('itemsPerPage');
		
		models.account.userList( page, itemsPerPage, function ( result ) {
			res.json ( 200, result );
		});
		
	};
	
	var userInfo = function ( req, res ) {
		var id = req.param('id');
		models.account.getUserInfo ( id, function ( result ) {
			res.json ( 200, result );
		});
		
	};
	
	return {
		authenticated: authenticated,
		register: register,
		login: login,
		userList: userList,
		userInfo: userInfo
	};

}
