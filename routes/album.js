var dbase = require('../lib/dbase')
;
exports.createAlbum = function(req, res) {
	res.render('createAlbum');
};

exports.insertAlbum = function(req, res) {
	var album = req.body
	;
	
	album.userId = req.session.user._id;
	
	dbase.save('albums', album, function(error) {
		if (error) {
			res.send(404, error);
			return;
		}
		res.redirect('/albums');
	});
};

exports.list = function(req, res) {
	var userId = req.session.user._id
	;
	dbase.find("albums", {userId : userId}, function(err, albums) {
		if(err) {
			return res.send(404, err);
		}
		res.render('albums', {user: req.session.user, albums: albums});
	});
};
