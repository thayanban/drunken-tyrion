exports.login = function(req, res) {
	res.render('login');
};

exports.register = function(req, res) {
	res.render('register');
};

exports.createUser = function(req, res) {
	res.render('register');
	var user = req.body
	;
	//save user to db
	//redirect to login. 
};
exports.authenticate = function(req, res) {
	res.render('register');
	var user = req.body
	;
	//save user to db
	//redirect to login. 
};
