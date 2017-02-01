
function updateScoreboard(stats) {
    // console.log('stats', stats);

    $('#killCount ul').html( function() {
        var listItems = [];
        for (var entityType in stats.killCount) {
          listItems.push("<li><span class=\"slabel\">" + entityType + ":</span> <span class=\"stat\">" + stats.killCount[entityType] + "</span></li>");
        }
        return listItems.join("\n");
    });

    $('#spellCount ul').html( function() {
        var listItems = [];
        for (var spellName in stats.spellCount) {
          listItems.push("<li><span class=\"slabel\">" + spellName + ":</span> <span class=\"stat\">" + stats.spellCount[spellName] + "</span></li>");
        }
        return listItems.join("\n");
    });

    $('#leaderBoard ul').html( function() {
        var listItems = [];
        for (var i = 0; i < stats.leaderBoard.length; i++) {
            playerStats = stats.leaderBoard[i];
            listItems.push("<li><h4>" + playerStats.playerName + "</h4><span class=\"slabel\">Score:</span> <span class=\"stat\">" + playerStats.totalEvents + "</span></li>");
        }
        return listItems.join("\n");
    });


}
