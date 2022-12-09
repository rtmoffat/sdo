function login() {
    var $username=$('#username')[0].value;
    //alert($username);
    var requestOptions = {
        method: 'POST',
        redirect: 'follow',
        headers:{'username':$username}
      };
      
      fetch("./setCookie", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    $("#dialog").html($username);
    $( "#dialog" ).dialog();
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