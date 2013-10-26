var dbase = require('../lib/dbase');
exports.login = function(req, res) {
	res.render('login', {
		values : {
			username : "",
			password : ""
		}
	});
};
exports.authenticate = function(req, res) {
	var user = req.body;
	console.log(user);
	var error, view = {};

	if (!user.username) {
		error = true;
		view.username = "please enter your username";
	}
	else if(!user.password) {
		error = true;
		view.password = "please enter your password";
	}
	dbase.find('users', user, function(err, users) {
		if (!users[0]) {
			error = true;
			view.password = "give valid username password";
		}
		if (error) {
		res.render('login', {
			error : view,
			values : user
		});
		return;
		}
		if (users[0]) {
			res.redirect('/albums');
			req.session.user = users[0];
			return;
		}
	});
};
exports.register = function(req, res) {
	res.render('register', {
		values : {
			username : "",
			password : "",
			confirmPassword : ""
		}
	});
};

exports.createUser = function(req, res) {
	var newuser = req.body;
	console.log(newuser);
	var error, view = {};
	if (!newuser.username) {
		error = true;
		view.username = "please enter your username";
	} 
	else if (newuser.username.length < 8 || newuser.username.length > 20) {
		error = true;
		view.username = "username required min 8 max 20 character";
	}
	else if (!newuser.password) {
		error = true;
		view.password = "please enter your password";
	} 
	else if (newuser.password.length < 8 || newuser.password.length >= 12) {
		error = true;
		view.password = "password required min 8 max 12 character";
	} 
	else if (newuser.password !== newuser.confirmPassword) {
		error = true;
		view.confirmPassword = "unmatch your password";
	}
	dbase.find('users', {username:newuser.username}, function(err, users) {
	if (users[0]) {
		error = true;
		view.confirmPassword = "please give valid username password";
	}
	if (error) {
		res.render('register', {
			error : view,
			values : newuser
		});
		return;
	}
	dbase.save('users', newuser, function(error) {
		if (error) {
			res.send(404, error);
			return;
		}
		res.redirect('/login');
	});
});
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