var defaultInterval = 1000;
var interval = localStorage.getItem('interval') ? localStorage.getItem('interval') : defaultInterval;
localStorage.setItem('interval', interval);
$('#interval').val(interval);

var defaultRestURL = '/js/endpoint.js';
var restURL = localStorage.getItem('restURL') ? localStorage.getItem('restURL') : defaultRestURL;
localStorage.setItem('restURL', restURL);
$('#restURL').val(restURL);

function saveSettings() {
  localStorage.setItem('interval', $('#interval').val());
  localStorage.setItem('restURL', $('#restURL').val());
  localStorage.setItem('eventTypeJSONs', $('#eventTypeJSONs').val());
  window.location.reload();
}

function resetSettings() {
  localStorage.removeItem('interval');
  localStorage.removeItem('restURL');
  localStorage.removeItem('eventTypeJSONs');
  window.location.reload();
}