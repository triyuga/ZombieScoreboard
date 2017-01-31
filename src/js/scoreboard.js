
function updateScoreboard(data) {
    console.log('data', data);

    let stats = {
        killCount: data.killCount || ["Zero Kill"],
        spellCount: data.spellCount || ["No Spell"],
        leaderBoard: data.leaderBoard || ["No Leaders"],
    };

    $('#killCount').html( function() {
        return stats.killCount.map(function(item){
            return "<li>" + item + Math.random() + "</li>";
        });
    });

    $('#spellCount').html( function() {
        return stats.spellCount.map(function(item){
            return "<li>" + item + "</li>";
        });
    });

    $('#leaderBoard').html( function() {
        return stats.leaderBoard.map(function(item){
            return "<li>" + item + "</li>";
        });
    });


}