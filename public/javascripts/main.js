function login() {
    var $username=$('#username')[0].value;
    var $password=$('#password')[0].value;
    //alert($username);
    var requestOptions = {
        method: 'POST',
        redirect: 'follow',
        headers:{'username':$username,'password':$password}
      };
      
      fetch("./login/setCookie", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        //.then(location.href='./game/1')
        .catch(error => console.log('error', error));
    $("#dialog").html($username);
    $( "#dialog" ).dialog();
}
function logout() {
  var $username=$('#username')[0].value;
  
  //delete the local cookie
}
function addComment() {
  $comment=$('#new-comment')[0].value;
  var requestOptions = {
    method: 'POST',
    redirect: 'follow',
    headers:{'comment':$comment}
  };
  fetch("./addComment", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
//$("#dialog").html($username);
//$( "#dialog" ).dialog();
}
/*$( function() {
    $( "#dialog" ).dialog();
  } );*/
function initWebSocket() {
          
  if ("WebSocket" in window) {
      //alert("WebSocket is supported by your Browser!");
      var ws = new WebSocket("ws://localhost:3001/game/echo");

      ws.onopen = function() {
        ws.send("Hi server from client!");
        console.log("Message is sent from client");
      };

      ws.onmessage = function (evt) { 
        var received_msg = evt.data;
        console.log("Message is received from server!! "+received_msg);
      };

      ws.onclose = function() { 
        console.log("websocket is closed");
        // websocket is closed.
        //alert("Connection is closed..."); 
      };
  } else {
    
      // The browser doesn't support WebSocket
      alert("WebSocket NOT supported by your Browser!");
  }
}