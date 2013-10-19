var dbase = require('../lib/dbase');
exports.login = function(req, res) {
	res.render('login');
};
exports.authenticate = function(req, res) {
	var user = req.body;
	dbase.find('users', user, function(error, data) {
		if (error) {
			res.send(404, error);
			return;
		}
		if (data) {
			res.redirect('/albums');
			req.session.user = data;
			return;
		}
		res.redirect('/login');
	});
};
exports.register = function(req, res) {
	res.render('register');
};

exports.createUser = function(req, res) {
	var newuser = req.body;
	dbase.save('users', newuser, function(error) {
		if (error) {
			res.send(404, error);
			return;
		}
		res.redirect('/login');
	});
	//save user to db
	//redirect to login.
};
exports.singout = function(req, res) {
	res.render('logout');
};
exports.quit = function(req, res) {
	if (req.session.user) {
		req.session.user = null;
		res.redirect('/login');
	}
};
