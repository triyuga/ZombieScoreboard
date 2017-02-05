var defaultInterval = 2000;
var interval = localStorage.getItem('interval') ? localStorage.getItem('interval') : defaultInterval;
localStorage.setItem('interval', interval);
$('#interval').val(interval);

var defaultRestURL = 'http://localhost:8666/stats';
var restURL = localStorage.getItem('restURL') ? localStorage.getItem('restURL') : defaultRestURL;
localStorage.setItem('restURL', restURL);
$('#restURL').val(restURL);

var showFeatureGraphics = (localStorage.getItem('showFeatureGraphics') === 'false') ? false : true;
localStorage.setItem('showFeatureGraphics', showFeatureGraphics);
$('#showFeatureGraphics').prop('checked', showFeatureGraphics);

var showAzureLogo = (localStorage.getItem('showAzureLogo') === 'false') ? false : true;
localStorage.setItem('showAzureLogo', showFeatureGraphics);
$('#showAzureLogo').prop('checked', showAzureLogo);

function saveSettings() {
  localStorage.setItem('interval', $('#interval').val());
  localStorage.setItem('restURL', $('#restURL').val());
  localStorage.setItem('eventTypeJSONs', $('#eventTypeJSONs').val());
  localStorage.setItem('showFeatureGraphics', $('#showFeatureGraphics').is(":checked"));
  localStorage.setItem('showAzureLogo', $('#showAzureLogo').is(":checked"));
  window.location.reload();
}

function resetSettings() {
  localStorage.removeItem('interval');
  localStorage.removeItem('restURL');
  localStorage.removeItem('eventTypeJSONs');
  localStorage.removeItem('showFeatureGraphics');
  localStorage.removeItem('showAzureLogo');
  window.location.reload();
}

if (showAzureLogo) {
  $('.azure-logo').removeClass('hidden');
}
