jQuery('#signup-form').on('submit',function(e){
e.preventDefault();
 var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      var user=JSON.parse(this.responseText);
      // console.log(window.location.href);
      var x_auth = xhttp.getResponseHeader('x-auth');
      localStorage.setItem('_id',user._id);
      localStorage.setItem('name',user.name);
      localStorage.setItem('email',user.email);
      localStorage.setItem('phone',user.phone);
      localStorage.setItem('x-auth',x_auth);

      window.location.href='/homepage.html';
    }
  };
  xhttp.open("POST", "https://mighty-cove-44302.herokuapp.com/api/signup", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  var jsonObj={
    name : jQuery("[name='name']").val(),
  	phone : jQuery("[name='phone']").val(),
  	password : jQuery("[name='password']").val(),
    email   : jQuery("[name='email']").val()
  };
  xhttp.send(JSON.stringify(jsonObj));
});