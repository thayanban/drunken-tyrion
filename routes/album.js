var dbase = require('../lib/dbase')
;
var fs = require('fs')
, uploadsRoot = __dirname
;
uploadsRoot = uploadsRoot.split('/');
uploadsRoot.pop();
uploadsRoot = uploadsRoot.join('/') + '/uploads/';
exports.createAlbum = function(req, res) {
	res.render('createAlbum');
};

exports.insertAlbum = function(req, res) {
	var album = req.body
	, files = req.files.imagename
	, i = 0
	;
	console.log(files);	
	for(i; i < files.length; i++) {
		delete files[i].headers;
		delete files[i].ws;
		delete files[i].fieldname;
	}
	
	album.userId = req.session.user._id;
	album.files = files;
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
	console.log(req.session.user);
	dbase.find("albums", {userId : userId}, function(err, albums) {
		if(err) {
			return res.send(404, err);
		}
		res.render('albums', {user: req.session.user, albums: albums});
	});
};
exports.serveImage = function(req, res) {
	var imageName = req.name
	;
	var stream = fs.createReadStream(uploadsRoot + imageName);
	stream.pipe(res);
};
