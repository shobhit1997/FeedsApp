var express =	require('express');
var app		=	express();
var bodyParser = require('body-parser');
var mongoose	=	require('mongoose');
var _	=	require('lodash');
var User 	=	require('./app/models/user');
var Post 	=	require('./app/models/post');
var url = require('url');
// var {authenticate} = require('./middleware/authenticate');

mongoose.connect('mongodb://shobhit:shobhit1997@ds117701.mlab.com:17701/feeds_app');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


// app.use(express.static('./public'));

//middleware
var authenticate = function(req,res,next){
	var token = req.header('x-auth');
	User.findByToken(token).then(function(user){
		if(!user){
			return Promise.reject();	
		}
		req.user=user;
		req.token=token;
		next();
	}).catch(function(e){
		res.status(401).send();
	});

};



app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'x-auth');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With,content-type, Accept , x-auth');
    // res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

var port= process.env.PORT||8000;

var router = express.Router();

router.use(function(req, res, next) {

    console.log('Something is happening.');
    next(); 
});


router.get('/',function(req,res){
	res.json({message : 'welcome'});
});



router.route('/signup')
	.post(function(req,res){

		var body=_.pick(req.body,['name','phone','email','password']);
		var user = new User(body);
		
		user.save().then(function(){
			 return user.generateAuthToken();
		}).then(function(token){
			console.log(token);
			res.header('x-auth',token).send(user);
		}).catch(function(e){
			res.status(400).send(e);
		});
	});

router.route('/login')
	.post(function(req,res){
		var body=_.pick(req.body,['phone','password']);
		User.findByCredentials(body.phone,body.password).then(function(user){
			return user.generateAuthToken().then(function(token){
			res.header('x-auth',token).send(user);
		});
		}).catch(function(e){
			res.status(400).send(e);
		});
	});



	router.route('/user/me')
	.get(authenticate, function(req,res){
		res.send(req.user);
	});


	router.route('/user/:id')
	.get(authenticate, function(req,res){
		var _id=req.params.id;
		User.findById(_id).then(function(user){
			res.send(user);
		}).catch(function(e){
			res.status(400).send();
		});
	});
	
router.route('/users')
	.get(authenticate, function(req,res){
		User.find().then(function(users){
			res.send(users);
		}).catch(function(e){
			res.status(400).send();
		});
	});

	router.route('/user/follow/:id')
	.post(authenticate,function(req,res){
		 
		var id=req.params.id;
		var msg='Follow';
		User.findById(id).then(function(user){

			if(user.followers.indexOf(req.user._id)>=0)
			{
				user.followers.splice(user.followers.indexOf(req.user._id),1);
				req.user.follow.splice(req.user.follow.indexOf(user._id),1);
				msg='Follow';
			}
			else
			{
				user.followers.push(req.user._id);
				req.user.follow.push(user._id);
				msg='Unfollow';	
			}
			user.save().then(function(user){
				res.send(msg);
			});
			req.user.save().then(function(user){
				// res.send(user);
			});
		}).catch(function(e){
			res.status(400).send();
		});
});



router.route('/post')
	.post(authenticate,function(req,res){
		// res.send(req.user);

		var body={
			text : req.body.text,
			createdBy : req.user._id,
			postType : req.body.postType,
			createdAt : new Date().getTime()
		};
		var post=new Post(body);
		post.save().then(function(post){
			res.send(post);
		});
});



router.route('/post')
	.get(authenticate,function(req,res){
		// res.send(req.user);
		var params=url.parse(req.url,true).query;
		if(Object.keys(params).length === 0)
		{
			Post.find({createdBy : req.user._id}).then(function(posts){
				res.send(posts);
			});	
		}
		else
		{
			var type= params.type;
			var id = params.id;
			console.log(id);
			if(type==='like' && id===undefined)
			{
			Post.find({likedBy : {_id :req.user._id}}).then(function(posts){
				res.send(posts);
				console.log(posts);
			});
			}
			else if(type==='like')
			{
			Post.find({likedBy : {_id :id}}).then(function(posts){
				res.send(posts);
				console.log(posts);
			});	
			}
			else if(type==='share' && id=== undefined){
			Post.find({sharedBy : {_id :req.user._id}}).then(function(posts){
				res.send(posts);
				console.log(posts);
			});	
			}
			else if(type==='share'){
			Post.find({sharedBy : {_id :id}}).then(function(posts){
				res.send(posts);
				console.log(posts);
			});	
			}
			else if(type==='id'){
				var id = params.id;
				Post.findById(id).then(function(post){
				res.send(post);
				console.log(post);
			});	
			}		
		}
		
});

router.route('/post/all')
	.get(authenticate,function(req,res){
		// res.send(req.user);
		Post.find().then(function(posts){
			res.send(posts);
		});
});
router.route('/post/like/:id')
	.post(authenticate,function(req,res){
		// res.send(req.user);
		var id=req.params.id;
		var msg='Like';
		Post.findById(id).then(function(post){

			if(post.likedBy.indexOf(req.user._id)>=0)
			{
				post.likedBy.splice(post.likedBy.indexOf(req.user._id),1);
				req.user.likedPosts.splice(req.user.likedPosts.indexOf(post._id),1);
				msg='Like';
			}
			else
			{
				post.likedBy.push(req.user._id);
				req.user.likedPosts.push(post._id);
				msg='Unlike';	
			}
			post.save().then(function(post){
				res.send(msg);
			});
			req.user.save().then(function(user){
				// res.send(user);
			});
		}).catch(function(e){
			res.status(400).send();
		});
});

router.route('/post/share/:id')
	.post(authenticate,function(req,res){
		// res.send(req.user);
		var id=req.params.id;
		var msg='Share';
		Post.findById(id).then(function(post){

			
			if(post.sharedBy.indexOf(req.user._id)>=0)
			{
				post.sharedBy.splice(post.sharedBy.indexOf(req.user._id),1);
				req.user.sharedPosts.splice(req.user.sharedPosts.indexOf(post._id),1);
				msg='Share';
			}
			else
			{
				post.sharedBy.push(req.user._id);
				req.user.sharedPosts.push(post._id);
				msg='Shared';	
			}
			post.save().then(function(post){
				res.send(msg);
			});
			req.user.save().then(function(user){
				// res.send(user);
			});
		}).catch(function(e){
			res.status(400).send();
		});
});

app.use('/api',router);

// app.use('/login',function(req,res){

// 	res.sendFile('login.html');
// });

// app.use('/',function(req,res){

// 	res.sendFile('index.html');
// });

// app.use(express.static('public', {
//   extensions: ['html']
// }));

app.use(express.static('./public'));



app.listen(port);
console.log('Running on Port '+ port);