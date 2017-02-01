$(document).ready(function() {
    $("body").addClass("zapzap");
    setTimeout(waitForTheZapZap, interval);
    // $(".feature-graphic").addClass("revealed");
});

/**
 *
 */
function doTheZapZap() {
  // doTheZapZap!f
  // console.log('doTheZapZap');
  var interval;
  // 1 in 5 chance of a surprise!
  var surprise = (Math.floor((Math.random() * 5) + 1) === 5);
  // susrprise = true;
  if (surprise) {
    interval = 1500;
    setTimeout(waitForTheZapZap, interval);
    $("body").addClass("faceeater");
  }
  else {
    interval = Math.floor((Math.random() * 5) + 3) * 1000;
    setTimeout(waitForTheZapZap, interval);
    $("body").addClass("zapzap");

    // Show random feature graphic, if turned on.
    var showFeatureGraphics = localStorage.getItem('showFeatureGraphics');
    if (showFeatureGraphics !== 'false') {
      var unhide = Math.floor((Math.random() * 3) + 1);
      $(".feature-graphic--" + unhide).addClass("revealed");
    }
  }
}

/**
 *
 */
function waitForTheZapZap() {
  // waitForTheZapZap!
  // console.log('waitForTheZapZap');
  var interval = Math.floor((Math.random() * 5) + 3) * 1000;
  setTimeout(doTheZapZap, interval);
  $("body").removeClass("zapzap");
  $("body").removeClass("faceeater");
  $(".feature-graphic").removeClass("revealed");
}
