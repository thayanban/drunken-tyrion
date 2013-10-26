 var databaseUrl = "localhost:27017/albums"
;
var db = require("mongoskin").db(databaseUrl,{safe:false})
;
exports.ObjectId = db.ObjectID;
exports.save = function(collection, document, cb) {
	db.collection(collection).save(document, cb);
};
exports.find = function(collection, query, cb) {
	db.collection(collection).find(query).toArray(cb);
};