
function updateScoreboard(stats) {
    if (localStorage.getItem('devMode')) {
        console.log('stats', stats);
    }
    console.log('stats', stats);

    $('#currentZombieTenMinuteCount').html( function() {
        return "<span class=\"slabel\">Zombies Killed Last 10 Mins:</span> <span class=\"stat\">" + stats.zombieTenMinuteKillCount + "</span>";
    });

    $('#bestZombieTenMinuteCount').html( function() {
        return "<span class=\"slabel\">Most Zombies Killed In 10 Mins:</span> <span class=\"stat\">" + stats.mostZombiesKilledInTenMins + "</span>";
    });

    $('#killCount ul').html( function() {
        var listItems = [];
        for (var entityType in stats.killCount) {
          var count = stats.killCount[entityType];
          listItems.push("<li><span class=\"slabel\">" + entityType + ":</span> <span class=\"stat\">" + count + "</span></li>");
        }
        return listItems.join("\n");
    });

    $('#spellCount ul').html( function() {
        var listItems = [];
        for (var spellName in stats.spellCount) {
          var count = stats.spellCount[spellName];
          listItems.push("<li><span class=\"slabel\">" + spellName + ":</span> <span class=\"stat\">" + count + "</span></li>");
        }
        return listItems.join("\n");
    });

    $('#leaderBoard ul').html( function() {
        var listItems = [];
        for (var i = 0; i < stats.leaderBoard.length; i++) {
            var playerName = stats.leaderBoard[i].playerName;
            var score = stats.leaderBoard[i].totalEvents;
            listItems.push("<li><h4>" + playerName + "</h4><span class=\"slabel\">Score:</span> <span class=\"stat\">" + score + "</span></li>");
        }
        return listItems.join("\n");
    });
}
