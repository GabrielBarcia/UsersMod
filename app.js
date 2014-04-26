
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var MemoryStore = require('connect').session.MemoryStore;

// Database
var mongoose = require('mongoose');

var models = { account: require('./models/account') (mongoose) };
var users = { actions: require('./routes/user') ( models, mongoose) };

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.cookieParser());
app.use(express.session({
	secret: 'AppSecretKey',
	store: new MemoryStore()
}));
app.use(app.router);

mongoose.connect ('mongodb://localhost/test1_users');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get( '/', routes.index);
app.get('/user', users.actions.userInfo);
app.get( '/user/list', users.actions.userList );
app.get( '/account/authenticated', users.actions.authenticated );

app.put( '/user/:id', users.actions.update )

app.post('/user', users.actions.register);
app.post('/login', users.actions.login)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
