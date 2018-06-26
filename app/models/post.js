const mongoose  = require('mongoose');

const Schema	= mongoose.Schema;

var CommentSchema = new Schema({
	text : {
		type : String,
		minlength : 1,
		required : true
	},
	createdBy : {
		type : Schema.ObjectId,
		required : true
	},
	createdAt : {
		type : Number,
		required : true
	}
});

var PostSchema 	= new Schema({

	text : {
		type : String,
		minlength : 1,
		required : true
	},
	createdBy : {
		type : Schema.ObjectId,
		required : true
	},
	postType : {
		type : String,
		required : true
	},
	likedBy :[Schema.ObjectId],
	sharedBy : [Schema.ObjectId],
	createdAt : {
		type : Number,
		required : true
	},
	commentedBy : [CommentSchema]

});


module.exports = mongoose.model('Post',PostSchema);

