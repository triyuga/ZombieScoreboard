
function updateScoreboard(data) {
    console.log('data', data);

    let stats = {
        killCount: data.killCount || "Zero Kill",
        spellCount: data.spellCount || "No Spell",
        leaderBoard: data.leaderBoard || "No Leaders",
    };

    $('#killCount').append( function() {
        return stats.killCount.map(function(item){
            return "<li>" + item + "</li>";
        });
    });

}