var dbase = require('../lib/dbase');
exports.login = function(req, res) {
	res.render('login', {values:{username:"", password:""}});
};
exports.authenticate = function(req, res) {
	var user = req.body;
	console.log(user);
	var error
	, view = {}
	;
	
	if (!user.username) {
		error = true;
		view.username = "please enter your username";
	}
	if (!user.password) {
		error = true;
		view.password = "please enter your password";
	}
	if (error) {
		res.render('login', {error:view, values:user});
		return;
	}
	dbase.find('users', user, function(error, users) {
		if (error) {
			res.send(404, error);
			return;
		}
		if (users[0]) {
			res.redirect('/albums');
			req.session.user = users[0];
			return;
		}
		res.redirect('/login');
	});
};
exports.register = function(req, res) {
	res.render('register', {values:{username:"", password:"", confirmPassword:""}});
};

exports.createUser = function(req, res) {
	var newuser = req.body;
	console.log(newuser);
	var error
	, view = {}
	;
	if (!newuser.username) {
		error = true;
		view.username = "please enter your username";
	}
	if (!newuser.password) {
		error = true;
		view.password = "please enter your password";
	}
	if (newuser.password!==newuser.confirmPassword) {
		error = true;
		view.confirmPassword = "please enter your confirmPassword";
	}
	if (error) {
		res.render('register',{error:view, values:newuser});
		return;
	}
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
