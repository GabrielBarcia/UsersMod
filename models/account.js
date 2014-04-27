module.exports = function ( mongoose ) {
	
	var UserSchema = new mongoose.Schema ({
		username: String,
		email: String,
		password: String,
		status: String
	});

	var user = mongoose.model( 'user', UserSchema );
	
	var register = function ( newUser, callBackFunction ) {
		console.log ('Save command sent.');
		newUser.save ( function ( err ) {
			if (err) {
				console.log(err);
				callBackFunction(false);
			}
			console.log('User Created');
			callBackFunction(true);
		});
	};

	
	var login = function ( email, password, callback ) {
		user.findOne ( {email:email, password: password}, function ( err, doc) {
			callback(doc);
		});
	};
	

	var userList = function ( page, itemsPerPage, callback ) {

		user
		.find()
		.skip( (page - 1) * itemsPerPage )
		.limit ( itemsPerPage )
		.exec ( function ( err, doc ) {
			if (err) {
				//do something if err;
			}
			callback ( doc );
		});
	};
	
	var getUserInfo = function ( id, callback ) {
		user.findOne ( { _id: id }, function ( err, doc ) {
			if (err) {
				console.log ( 'Error');
			} else {
				callback (doc);	
			}
		});
	}
	
	var update = function ( id, username, email, callback ) {
		user.update (
			{ _id: id },
			{ $set: { username: username, email: email}},
			{ upsert: false },
			function () {
				console.log ('Updated user ' + email );
				callback();
			}
		);
	}
	
	var del = function ( id, callback ) {
		
		user.findOneAndRemove ( id, function (err) {
			if (err) {
				return console.log(err);
			} else {
				if (callback){
					return callback();
				}
			}
		});

	}

	
	return {
		userSchema : UserSchema,
		user : user,
		register: register,
		login: login,
		userList: userList,
		getUserInfo: getUserInfo,
		update: update,
		del: del
	};
}
