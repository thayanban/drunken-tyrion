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
	var userId = req.session.user._id
	, album = req.body
	, files = req.files.imagename
	, i = 0
	, albumId = dbase.ObjectId()
	, _files = []
	, root = uploadsRoot + 'useralbums/'
	, userRoot = root + userId + '/'
	;
	
	//console.log(req.files);
	
	var exists = fs.existsSync(userRoot);
	
	if(!exists) {
		fs.mkdirSync(userRoot);
	} 
	
	var albumRoot = userRoot + albumId + '/';
	
	exists = fs.existsSync(albumRoot);
	
	if(!exists) {
		fs.mkdirSync(albumRoot);
	} 
	if(!files.length) {
		files = [files];
	}
	
	for(i; i < files.length; i++) {
		var file = files[i]
		, fileName = dbase.ObjectId().toString()
		, originalFilename = file.originalFilename
		, extension = 	originalFilename.split('.')[1]
		, fullname = fileName + '.' + extension
		, fullPath = albumRoot + fullname
		;
		fs.createReadStream(file.path).pipe(fs.createWriteStream(fullPath));
		_files.push({originalName: originalFilename, path: fullPath, id: fileName, contentType: file.type});		
	}
	
	album.userId = req.session.user._id;
	album.files = _files;
	album._id = albumId;
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
	//console.log(req.session.user);
	dbase.find("albums", {userId : userId}, function(err, albums) {
		if(err) {
			return res.send(404, err);
		}
		//console.log(albums);
		res.render('albums', {user: req.session.user, albums: albums});
	});
};

exports.serveImage = function(req, res) {
	var albumId = req.query.albumId
	, fileId = req.query.fileId
	;
	console.log(fileId);
	dbase.find("albums", {'files.id': fileId}, function(err, albums) {
		if(err) {
			return res.send(404, err);
		}
		if(!albums.length) {
			return res.send(404, err);
		}
		var album = albums[0]
		;
		var files = album.files
		, file
		;
	console.log(files);
		for(var i = 0; i < files.length; i++) {
			var f = files[i]
			;
			if(fileId === f.id) {
				file = f;
				break;
			}
		}
		if(!file) {
			return res.send(404);
		}
		var image = fs.readFileSync(file.path)
		;
		res.writeHead(200, {'Content-Type': file.contentType});
		res.end(image, 'binary');
	});	
};

exports.displayAlbum = function(req, res) {
	console.log(req.params.id);
	var albumId = req.params.id
	;
	dbase.find("albums", {_id:dbase.ObjectId.createFromHexString(albumId)}, function(err, albums) {
		if(err) {
			return res.send(404, err);
		}
		if(!albums[0]) {
			return res.send(404, err);
		}
		res.render('album', albums[0]);
	});
};