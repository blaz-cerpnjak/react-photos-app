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

module.exports = mongoose.model('photoComments', photoCommentsSchema);
