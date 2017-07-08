// Uncomment this to consume local JSON snapshot.
var file = "../snapshot/2017-06-13--18-30-00.json";
$.getJSON(file, function(res) {
  var stats = res.data;
  updateScoreboard(stats);
});

// function nomnom() {
//   // var restURL = localStorage.getItem('restURL');

//   $.ajax({
//     method: "GET",
//     url: restURL,
//   })
//   .done(function(res) {
//     // console.log('res');
//     // console.log(res);
//     updateScoreboard(res.data);
//   })
//   .fail(function( jqXHR, textStatus ) {
//     // console.log('jqXHR');
//     // console.log(jqXHR);
//     // console.log('textStatus');
//     // console.log(textStatus);
//   });
// }

// var restURL = localStorage.getItem('restURL');
// var isStaticJSON = (restURL.indexOf(".json"));
// if (isStaticJSON) {
//   $.getJSON(restURL, function(json) {
//     updateScoreboard(json);
//   });
// }
// else {
//   nomnom();
//   var interval = localStorage.getItem('interval');
//   setInterval(nomnom, interval);
// }
