function nomnom() {
  var restURL = localStorage.getItem('restURL');

  var request = $.ajax({
    method: "GET",
    url: restURL,
  })
    .done(function(res) {
      const data = res.data || {};
      updateScoreboard(data);
    })
    .fail(function( jqXHR, textStatus ) {
      // console.log('jqXHR');
      // console.log(jqXHR);
      // console.log('textStatus');
      // console.log(textStatus);
    });

  // console.log('request');
  // console.log(request);


  var eventDispatchLog = $('#eventDispatchLog').val();
  eventDispatchLog = eventDispatchLog.length === 0 ? randomEvent : eventDispatchLog + "\n" + randomEvent;
  $('#eventDispatchLog').val(eventDispatchLog);

  var endpointLog = localStorage.getItem('endpointLog');
  $('#endpointLog').val(endpointLog);

  // console.log('dispatchEvent: ' + randomEvent);
}
