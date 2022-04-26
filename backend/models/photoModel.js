var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'name' : String,
	'path' : String,
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'views' : Number,
	'likes' : Array,
	'datetime' : Date,
	'comments': [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'photoComments'
	}],
	'reports': Array,
	'hidden': Boolean,
	'score': { type: Number, default: 0 }
});

module.exports = mongoose.model('photo', photoSchema);
