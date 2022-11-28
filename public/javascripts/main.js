function login() {
    $username=$('#username')[0].value;
    //alert($username);
    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
      };
      
      fetch("./setCookie", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    $("#dialog").html($username);
    $( "#dialog" ).dialog();
}
/*$( function() {
    $( "#dialog" ).dialog();
  } );*/