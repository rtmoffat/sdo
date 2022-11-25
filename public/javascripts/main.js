function login() {
    $username=$('#username')[0].value;
    //alert($username);
    $("#dialog").html($username);
    $( "#dialog" ).dialog();
}
/*$( function() {
    $( "#dialog" ).dialog();
  } );*/