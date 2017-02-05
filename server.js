var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var store = [];

function getStats() {
	var stats = {
		killCount: {}, // entityType: int
		spellCount: {}, // spellName: int
		leaderBoard: [], // [ { playerName: stats } ]
	};

	var playerStats = {};

	store.map(function (event) {
		console.log(event);
		switch (event.eventType) {
			case "playerKilledEntity":
				// killCount
				var entityType = event.entityType;
				if (!stats.killCount[entityType]) {
					stats.killCount[entityType] = 0;
				}
				stats.killCount[entityType]++;

				// playerStats
				var playerName = event.playerName;
				if (!playerStats[playerName]) {
					// if (!playerStats[playerName]) {
					playerStats[playerName] = {
						spellCount: {},
						killCount: {},
						totalSpells: 0,
						totalKills: 0,
						totalEvents: 0
					};
				}
				if (!playerStats[playerName].killCount[entityType]) {
					playerStats[playerName].killCount[entityType] = 0;
				}
				playerStats[playerName].killCount[entityType]++;
				playerStats[playerName].totalKills++;
				playerStats[playerName].totalEvents++;
				break;

			case "playerCastSpell":
				// spellCount
				var spellName = event.spellName;
				if (!stats.spellCount[spellName]) {
					stats.spellCount[spellName] = 0;
				}
				stats.spellCount[spellName]++;

				// playerStats
				var playerName = event.playerName;
				if (!playerStats[playerName]) {
					playerStats[playerName] = {
						spellCount: {},
						killCount: {},
						totalSpells: 0,
						totalKills: 0,
						totalEvents: 0
					};
				}
				if (!playerStats[playerName].spellCount[spellName]) {
					playerStats[playerName].spellCount[spellName] = 0;
				}
				playerStats[playerName].spellCount[spellName]++;
				playerStats[playerName].totalSpells++;
				playerStats[playerName].totalEvents++;
				break;

		}
	});

	for (var playerName in playerStats) {
		playerStats[playerName].playerName = playerName;
		stats.leaderBoard.push(playerStats[playerName]);
	}

	stats.leaderBoard.sort(sortPlayerStats);

	return stats;
}

function sortPlayerStats(a, b) {
	if (a.totalEvents > b.totalEvents)
		return -1;
	if (a.totalEvents < b.totalEvents)
		return 1;
	return 0;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
	res.header('Access-Control-Expose-Headers', 'Content-Length');
	res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
	if (req.method === 'OPTIONS') {
		return res.send(200);
	} else {
		return next();
	}
});

// app.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
// });

// Consumes data from mock emitter.
app.post('/eat', function (req, res) {
	let data;
	if (req.body.eventType === "playerCastSpell") {
		if (req.body.spellName !== "fulmen" || req.body.spellName !== "ignifera") {
			return res.json({ok: true, msg: "Not logging this spell"});
		} else {
			data = {
				spellName: req.body.spellName,
				playerName: req.body.playerName,
				eventType: req.body.eventType
			}
		}
	}
	if (req.body.eventType === "playerKilledEntity") {
		data = {
			eventType: req.body.eventType,
			entityType: victim,
			playerName: victim.killer
		}
	}
	if (typeof data === "undefined") {
		return res.json({ok: true, msg: "Not logging this"});
	}
	store.push(req.body);
	console.log('store');
	console.log(data);
	res.json({
		msg: 'Nom nom!',
		query: data
	});
});

// Serves data collected from mock emitter.
app.get('/store', function (req, res) {
	res.json({
		msg: 'Eat Suck Suckface!',
		data: store
	});
});

// Serves data collected from mock emitter.
app.get('/stats', function (req, res) {
	res.json({
		msg: 'Whos who!',
		data: getStats()
	});
});

// Clears data from the store.
app.get('/dumpit', function (req, res) {
	store = [];
	res.json({
		msg: 'Ahhhmazing dump!',
	});
});

app.use(express.static('app/'));

app.listen(8666, function () {
	console.log('Example app listening on port 8666!')
});