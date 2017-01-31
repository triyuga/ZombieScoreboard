$(document).ready(function() {
    waitForTheZapZap();
});

/**
 *
 */
function doTheZapZap() {
  // doZapzap!
  var interval = Math.random() * (5000 - 2000) + 2000;
  var zapzapTimer = setInterval(pauseZapzap, interval);
  $("body").addClass("zapazap");
}

/**
 *
 */
function waitForTheZapZap() {
  var interval = Math.random() * (5000 - 2000) + 2000;
  setInterval(doZapzap, interval);
  $("body").removeClass("zapazap");
}
