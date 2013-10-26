/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var album = require('./routes/album');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({ uploadDir:__dirname + '/uploads' }));
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var restrict = function (req, res, next) {
	if (req.session.user) {
		next();
		return;
	}
	res.redirect('/login');
};
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', restrict, routes.index);
app.get('/login', user.login);
app.get('/register', user.register);
app.get('/logout',restrict, user.singout);
app.post('/logout', user.quit);

app.post('/register', user.createUser);
app.post('/login', user.authenticate);

app.get('/albums', restrict, album.list);
app.get('/albums/:id', restrict, album.displayAlbum);
app.get('/createAlbum', restrict, album.createAlbum);
app.get('/albums/:id/:name', restrict, album.serveImage);

app.post('/createAlbum', album.insertAlbum);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
