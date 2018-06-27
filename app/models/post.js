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
	commentedBy : [CommentSchema],
	stats :{
		likes : {
			type:Number,
			default:0
		},
		shares :{
			type : Number,
			default: 0
		}
	}
});

PostSchema.pre('save',function(next){
	post=this;
	if(post.isModified('likedBy')||post.isModified('sharedBy'))
	{
		post.stats.likes=post.likedBy.length;
		post.stats.shares=post.sharedBy.length;
		next();
	}
	else
	{
		next();
	}
});
module.exports = mongoose.model('Post',PostSchema);

