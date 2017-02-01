function nomnom() {
  var restURL = localStorage.getItem('restURL');

  $.ajax({
    method: "GET",
    url: restURL,
  })
  .done(function(res) {
    // console.log('res');
    // console.log(res);
    updateScoreboard(res.data);
  })
  .fail(function( jqXHR, textStatus ) {
    // console.log('jqXHR');
    // console.log(jqXHR);
    // console.log('textStatus');
    // console.log(textStatus);
  });
}

nomnom();
var interval = localStorage.getItem('interval');
setInterval(nomnom, interval);
