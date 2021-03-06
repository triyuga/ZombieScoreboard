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
  var surprise = (Math.floor((Math.random() * 4) + 1) === 4);
  // surprise = true;
  if (surprise) {
    var faceeater = (Math.floor((Math.random() * 2) + 1) === 2);
    if (faceeater) {
      interval = 1500;
      $("body").addClass("faceeater");
    }
    else {
      interval = 3000;
      $("body").addClass("rocker");
    }
    setTimeout(waitForTheZapZap, interval);
  }
  else {
    $("body").addClass("zapzap");
    // Show random feature graphic, if turned on.
    var showFeatureGraphics = localStorage.getItem('showFeatureGraphics');
    if (showFeatureGraphics !== 'false') {
      var unhide = Math.floor((Math.random() * 3) + 1);
      $(".feature-graphic--" + unhide).addClass("revealed");
    }
    interval = Math.floor((Math.random() * 5) + 3) * 1000;
    setTimeout(waitForTheZapZap, interval);
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
  $("body").removeClass("rocker");
  $(".feature-graphic").removeClass("revealed");
}
