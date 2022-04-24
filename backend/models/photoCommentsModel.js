var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoCommentsSchema = new Schema({
	'comment' : String,
	'datetime' : Date,
	'photoId' : String,
	'postedBy' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
   	}
});

var photoComments = mongoose.model('photoComments', photoCommentsSchema);
module.exports = photoComments;
