jQuery('#post-form').on('submit',function(e){
e.preventDefault();
 var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      var user=JSON.parse(this.responseText);
      window.location.href='/homepage.html';
    }
  };
  xhttp.open("POST", "http://localhost:8000/api/post", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
  var jsonObj={
  	text : jQuery('#post-text').val(),
  	postType : $("#post-type option:selected").text()
  };
  xhttp.send(JSON.stringify(jsonObj));
});