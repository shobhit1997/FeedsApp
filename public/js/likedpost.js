// var socket=io();

function scrollToBottom(){
	var posts=jQuery('#posts-list');
	var newPost=posts.children('li:last-child');

	var clientHeight=posts.prop('clientHeight');
	var scrollTop=posts.prop('scrollTop');
	var scrollHeight=posts.prop('scrollHeight');
	var newMessageHeight=newPost.innerHeight();
	var lastMessageHeight=newPost.prev().innerHeight();

	if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight)
	{
		// console.log('Should Scroll');
		posts.scrollTop(scrollHeight);
	}
}

// socket.on('connect',function() {
// 	// console.log("Connected to Server");

// 	var params=jQuery.deparam(window.location.search);
// 	socket.emit('join',params,function(err){
// 		if(err){
// 			alert(err);
// 			window.location.href="/";
// 		}
// 		else{
// 			console.log("No error");
// 		}
// 	});

// 	var xhttp = new XMLHttpRequest();
//   	xhttp.onreadystatechange = function() {
// 	    if (this.readyState == 4 && this.status == 200) {
// 	      console.log(this.responseText);
// 	      var messages=JSON.parse(this.responseText);
// 	      console.log(messages);
// 	      messages.forEach(function(message){
// 				if(message.messageType==="text"){
// 					var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm a');
// 					var template = jQuery('#message-template').html();
// 					var html = Mustache.render(template,{
// 					 	text : message.text,
// 					 	from : message.from,
// 					 	createdAt : formattedTime
// 					 });
// 					jQuery('#messages').append(html);
// 				}
// 				else{
// 					var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm a');
// 					var template = jQuery('#location-message-template').html();
// 					var html = Mustache.render(template,{
// 					 	url : message.url,
// 					 	from : message.from,
// 					 	createdAt : formattedTime
// 					});
// 					jQuery('#messages').append(html);
					
// 				}
// 				scrollToBottom();
// 			});

// 	    }
//   	};
//   	xhttp.open("GET", "https://thawing-mesa-63770.herokuapp.com/api/messages/"+params.room, true);
//   	xhttp.setRequestHeader("Content-type", "application/json");
//   	xhttp.send();


	
// });
// socket.on('disconnect',function(users){

// });

// socket.on('updateUserList',function(users){
// 	// console.log('User List',users);
// 	var ol= jQuery('<ol></ol>');
// 	users.forEach(function(user){
// 		ol.append(jQuery('<li></li>').text(user));
// 	});
// 	jQuery('#users').html(ol);
// });

// socket.on('newMessage',function(message){
// 	console.log("New Message Received",message);
// 	var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm a');
// 	var template = jQuery('#message-template').html();
// 	var html = Mustache.render(template,{
// 	 	text : message.text,
// 	 	from : message.from,
// 	 	createdAt : formattedTime
// 	 });
// 	 jQuery('#messages').append(html);
// 	 scrollToBottom();
// 	// var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm a');	
// 	// var li=jQuery('<li></li>');
// 	// li.text(message.from +" "+formattedTime+" : "+message.text);
// 	// jQuery('#messages').append(li);
// });

// socket.on('newLocationMessage',function(message){

// 	console.log(message);
// 	var formattedTime = moment(message.createdAt).format('MMM Do, YYYY h:mm a');
// 	var template = jQuery('#location-message-template').html();
// 	var html = Mustache.render(template,{
// 	 	url : message.url,
// 	 	from : message.from,
// 	 	createdAt : formattedTime
// 	 });
// 	 jQuery('#messages').append(html);
// 	 scrollToBottom();
// 	// var li=jQuery('<li></li>');
// 	// var a=jQuery('<a target="_blank">My current location</a>');
// 	// li.text(message.from+" "+formattedTime+":");
// 	// a.attr('href',message.url);
// 	// li.append(a);
// 	// jQuery('#messages').append(li);
// });



// // socket.emit('createMessage',{

// // 		'from' : "abc",
// // 		'text' : "Hello"

// // 	},function(data){
// // 		console.log('Got it',data);
// // 	});

// $('#message-form').on('submit',function(e){

// e.preventDefault();
// var params=jQuery.deparam(window.location.search);
// var messageTextbox=jQuery("[name='message']");
// socket.emit('createMessage',{
// 	from : params.name,
// 	text : messageTextbox.val()
// },function(data){
// 	console.log(data);
// 	messageTextbox.val('');
// });

// });



// var locationButton=$('#send-location');
// locationButton.click(function(){
// 	console.log("clicked");
// if(!navigator.geolocation){
// 	return alert('Geolocation not supported');
// }

// locationButton.attr('disabled','disabled').text('Sending.....');
// navigator.geolocation.getCurrentPosition(function(position){
// 	console.log(position);

// 	socket.emit('createLocationMessage',{
// 		latitude: position.coords.latitude,
// 		longitude: position.coords.longitude
// 	},function(data){
// 		console.log(data)
// 		locationButton.removeAttr('disabled').text('Send Location');
// 	});

// },function(){
// 	locationButton.removeAttr('disabled').text('Send Location');
// 	alert('Unable to fetch location');
// });
// });

$( document ).ready(function() {
    $('#name').html(localStorage.getItem('name'));
    $('#email').html(localStorage.getItem('email'));
    $('#phone').html(localStorage.getItem('phone'));
    populatePost();
    populateUsers();
});

function populatePost() {
	var params=jQuery.deparam(window.location.search);
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	      console.log(this.responseText);
	      var posts=JSON.parse(this.responseText);
	      posts.forEach(function(post){
				getUserName(post);
			});

	    }
  	};
  	
  	// console.log("http://localhost:8000/api/post/?type="+params.type);
  	xhttp.open("GET", "http://localhost:8000/api/post/?type=like", true);	
  	xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
  	xhttp.send();

}
function getUserName(post)
{

	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	     	var formattedTime = moment(post.createdAt).format('MMM Do, YYYY h:mm a');
					var template = jQuery('#post-template').html();
					var html = Mustache.render(template,{
					 	text : post.text,
					 	from : JSON.parse(this.responseText).name,
					 	createdAt : formattedTime,
					 	'like-id' : post._id+"-like",
					 	'share-id' : post._id+"-share"
					 });
					jQuery('#posts-list').append(html);
					if(post.likedBy.indexOf(localStorage.getItem('_id'))>=0)
					{
						jQuery('#'+post._id+"-like").html('Unlike');	
					}
					jQuery('#'+post._id+"-like").click(function(){
						likePost(post);
					});
					if(post.sharedBy.indexOf(localStorage.getItem('_id'))>=0)
					{
						jQuery('#'+post._id+"-share").html('Unshare');	
					}
					jQuery('#'+post._id+"-share").click(function(){
						sharePost(post);
					});
				scrollToBottom();

	    }
  	};
  	xhttp.open("GET", "http://localhost:8000/api/user/"+post.createdBy, true);
  	xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
  	xhttp.send();

}
function likePost(post)
{
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	     	// console.log('liked');
	     	jQuery('#'+post._id+"-like").html(this.responseText);
	    }
  	};
  	xhttp.open("POST", "http://localhost:8000/api/post/like/"+post._id, true);
  	xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
  	xhttp.send();
}
function sharePost(post)
{
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	     	// console.log('liked');
	     	jQuery('#'+post._id+"-share").html(this.responseText);
	    }
  	};
  	xhttp.open("POST", "http://localhost:8000/api/post/share/"+post._id, true);
  	xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
  	xhttp.send();
}
function populateUsers()
{
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	      console.log(this.responseText);
	      var users=JSON.parse(this.responseText);
	      users.forEach(function(user){
	      	if(user._id!== localStorage.getItem('_id'))
	      	{
					var template = jQuery('#user-template').html();
				
					var html = Mustache.render(template,{
					 	name : user.name,
					 	'follow-id' : user._id+"-follow",
					 	'followers' : user.followers.length+" followers"
					 });
					jQuery('#user-list').append(html);
					if(user.followers.indexOf(localStorage.getItem('_id'))>=0)
					{
						jQuery('#'+user._id+"-follow").html('Unfollow');	
					}
					jQuery('#'+user._id+"-follow").click(function(){
						console.log('Cliked');
						followUser(user);
					});
				scrollToBottom();
			}
			});

	    }
  	};
  	xhttp.open("GET", "http://localhost:8000/api/users", true);
  	xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
  	xhttp.send();

}