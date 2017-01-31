$(document).ready(function() {
    waitForTheZapZap();

    // let stats = {
    //     killCount: ["Mega Kill"],
    //     spellCount: ["Super Nuke"],
    //     leaderBoard: ["Death667b"],
    // };
    let stats = {};

    updateScoreboard(stats);
});

/**
 *
 */
function doTheZapZap() {
  // doTheZapZap!f
  // console.log('doTheZapZap');
  var interval = Math.random() * (5000 - 2000) + 2000;
  var zapzapTimer = setTimeout(waitForTheZapZap, interval);
  $("body").addClass("zapzap");
}

/**
 *
 */
function waitForTheZapZap() {
  // waitForTheZapZap!
  // console.log('waitForTheZapZap');
  var interval = Math.random() * (7000 - 3000) + 3000;
  setTimeout(doTheZapZap, interval);
  $("body").removeClass("zapzap");
}
