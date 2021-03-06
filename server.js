var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var recentEvents = [];
var recentEventsLogCount = 20;
var recentSpells = []; // Tracks recent spells for fudge-assignment of kill events to a player.
var recentSpellsLogCount = 5;
var playerStats = {};

var throughputLogging = true;
var throughputTimer = null;
var eventCountLastSecond = 0;
var throughputCounter = [];
var throughputCounterLimit = 600; // 10 mins

var zombieTenMinuteCounter = [];
var zombieTenMinuteTimer = null;
var mostZombiesKilledInTenMins = 8675;
var zombiesKilledLastSecond = 0;

/**
 *
 */
function startZombieTenMinuteLogging() {
	zombieTenMinuteTimer = setInterval(
		function() {
			if (zombieTenMinuteCounter.length >= 30) {
				zombieTenMinuteCounter.splice(-1,1);
			}
			zombieTenMinuteCounter.unshift(zombiesKilledLastSecond);
			zombiesKilledLastSecond = 0;
		},
		1000
	);
}

function zombieTenMinuteIntervalCount(interval) {
	if (zombieTenMinuteCounter.length < interval) {
		interval = zombieTenMinuteCounter.length;
	}

	var count = 0;
	var intervalKills = zombieTenMinuteCounter.slice(0, interval);
	for (var i = 0; i < intervalKills.length; i++) {
		count += intervalKills[i];
	}

	return count;
}


/**
 *
 */
function startThroughputLogging() {
	throughputLogging = true;

	throughputTimer = setInterval(
		function() {
			if (throughputCounter.length >= throughputCounterLimit) {
				throughputCounter.splice(-1,1);
			}
			throughputCounter.unshift(eventCountLastSecond);
			eventCountLastSecond = 0;
		},
		1000
	);
}

function throughputStats() {
	var stats = {};

	stats.oneSec = throughputIntervalCount(1);
	stats.tenSecs = throughputIntervalCount(10);
	stats.thirtySecs = throughputIntervalCount(30);
	stats.oneMin = throughputIntervalCount(60);
	stats.twoMins = throughputIntervalCount(120);
	stats.fiveMins = throughputIntervalCount(300);
	stats.tenMins = throughputIntervalCount(600);

	return stats;
}

function throughputIntervalCount(interval) {
	if (throughputCounter.length < interval) {
		return 'wait a bit...';
	}

	var count = 0;
	var intervalEvents = throughputCounter.slice(0, interval);
	for (var i = 0; i < intervalEvents.length; i++) {
		count += intervalEvents[i];
	}
	return count;
}

/**
 *
 */
function getScoreboard() {
	var zombieTenMinuteKillCount = zombieTenMinuteIntervalCount(600);
	if (zombieTenMinuteKillCount > mostZombiesKilledInTenMins) {
		mostZombiesKilledInTenMins = zombieTenMinuteKillCount;
	}

	var scoreboard = {
		leaderBoard: getLeaderBoard(),
		killCount: getKillCounts(),
		spellCount: getSpellCounts(),
		zombieTenMinuteKillCount: zombieTenMinuteKillCount,
		mostZombiesKilledInTenMins: mostZombiesKilledInTenMins,
	};

	return scoreboard;
}

/**
 *
 */
function iterateStats(event) {
	var playerName = event.playerName;
	// Ensure event has playerName.
	if (typeof(playerName) === "undefined" || typeof(playerName) === null || !playerName || playerName.length === 0) {
		if (event.eventType === "playerKilledEntity") {
			playerName = getRandomPlayerNameFromRecentSpells();
		}

		if (!playerName || typeof(playerName) === null) {
			playerName = "GOD";
		}
	}


	// Ensure playerStats[playerName] is initialized.
	if (!playerStats[playerName]) {
		playerStats[playerName] = {
			playerName: playerName, // need this later.
			spells: {},
			kills: {},
			totalSpells: 0,
			totalKills: 0,
			totalEvents: 0
		};
	}

	switch (event.eventType) {
		case "playerKilledEntity":
			// Ensure playerStats[playerName].kills[entityType] is initialized.
			if (!playerStats[playerName].kills[event.entityType]) {
				playerStats[playerName].kills[event.entityType] = 0;
			}
			playerStats[playerName].kills[event.entityType]++;
			playerStats[playerName].totalKills++;
			playerStats[playerName].totalEvents++;
			break;

		case "playerCastSpell":
			addSpellToRecentSpells(event);
			// Ensure playerStats[playerName].kills[entityType] is initialized.
			if (!playerStats[playerName].spells[event.spellName]) {
				playerStats[playerName].spells[event.spellName] = 0;
			}
			playerStats[playerName].spells[event.spellName]++;
			playerStats[playerName].totalSpells++;
			playerStats[playerName].totalEvents++;
			break;
	}
}

/**
 *
 */
function getSpellCounts() {
	var spellCounts = {};
	for (var playerName in playerStats) {
		for (var spellName in playerStats[playerName].spells) {
			if (!spellCounts[spellName]) {
				spellCounts[spellName] = 0;
			}
			spellCounts[spellName] += playerStats[playerName].spells[spellName];
		}
	}
	return spellCounts;
}

/**
 *
 */
function getKillCounts() {
	var killCounts = {};
	for (var playerName in playerStats) {
		for (var entityType in playerStats[playerName].kills) {
			if (!killCounts[entityType]) {
				killCounts[entityType] = 500;
			}
			killCounts[entityType] += playerStats[playerName].kills[entityType];
		}
	}
	return killCounts;
}

/**
 *
 */
function getLeaderBoard() {
	var leaderBoard = [];
	for (var playerName in playerStats) {
		leaderBoard.push(playerStats[playerName]);
	}
	return leaderBoard.sort(sortPlayerStats);
}

/**
 *
 */
function sortPlayerStats(a, b) {
	if (a.totalEvents > b.totalEvents)
		return -1;
	if (a.totalEvents < b.totalEvents)
		return 1;
	return 0;
}

/**
 *
 */
function getRandomPlayerNameFromRecentSpells() {
	if (recentSpells.length === 0) {
		return null;
	}

	var spellEvent = recentSpells[Math.floor(Math.random() * recentSpells.length)];
	return spellEvent.playerName;
}

/**
 *
 */
function addSpellToRecentSpells(event) {
	if (event.eventType !== "playerCastSpell") {
		return;
	}

	// If not attack spell, skip.
	if (event.spellName !== "shakti" && event.spellName !== "infierno") {
		return;
	}

	if (recentSpells.length >= recentSpellsLogCount) {
		recentSpells.splice(-1,1);
	}
	recentSpells.unshift(event);
}

/**
 *
 */
function logEventToRecentEvents(event) {
	if (recentEvents.length >= recentEventsLogCount) {
		recentEvents.splice(-1,1);
	}
	recentEvents.unshift(event);
}

/**
 *
 */
function validateEvent(event) {
	if (event.eventType === "playerCastSpell") {
		if (typeof(event.spellName) === 'undefined' ) {
			return false;
		}
		if (event.spellName.length === 0) {
			return false;
		}
		if (typeof(event.playerName) === "undefined" || typeof(event.playerName) === null || event.playerName.length === 0) {
			return false;
		}
		return true;
	}

	if (event.eventType === "playerKilledEntity") {
		if (typeof(event.entityType) === 'undefined' ) {
			return false;
		}
		if (event.entityType.length === 0) {
			return false;
		}

		// playerName validation skipped for now.

		return true;
	}
}

/**
 *
 */
function cleanEvent(event) {
	if (event.eventType === "playerCastSpell") {
		//
	}

	if (event.eventType === "playerKilledEntity") {
		event.entityType = event.entityType.replace("Craft", "");
  	event.entityType = event.entityType.split('{')[0];
	}

  return event;
}

/**
 *
 */
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

// Consumes data from mock emitter.
app.post('/eat', function (req, res) {
	var event = {};
	// Support data keyed under req.body OR under req.query.
	if (req.body && Object.keys(req.body).length !== 0) {
		event = req.body;
	}
	else if (req.query && Object.keys(req.query).length !== 0) {
		event = req.query;
	}

	var isValid = validateEvent(event);
	if (!isValid) {
		return res.json({
			ok: true,
			msg: "yuck! invalid event",
			event: event
		});
	}

	event = cleanEvent(event);


	// console.log() gets picked up Gandelf, and shipped put via UDP.
	console.log(JSON.stringify({
		type: 'event',
		data: event,
	}));

	// Main action.
	logEventToRecentEvents(event);
	iterateStats(event);

	// throughput logging
	if (throughputLogging) {
		eventCountLastSecond++;
	}

	if (event.eventType === "playerKilledEntity" && event.entityType === "Zombie") {
		zombiesKilledLastSecond++;
	}

	return res.json({
		ok: true,
		msg: "nomnom",
	});
});

// Serves data collected from mock emitter.
app.get('/scoreboard', function (req, res) {
	var scoreboard = getScoreboard();

	// console.log() gets picked up Gandelf, and shipped put via UDP.
	console.log(JSON.stringify({
		type: 'scoreboard',
		data: scoreboard,
	}));

	return res.json({
		msg: 'Whos who!',
		data: scoreboard
	});
});

// Serves data collected from mock emitter.
app.get('/snapshot', function (req, res) {
	var file = req.query.file;
	var scoreboard = $.getJSON("../snapshots/" + file, function(json) {
		return JSON.parse(json);
  });

	return res.json({
		msg: 'Whos who!',
		data: scoreboard
	});
});

// Serves data collected from mock emitter.
app.get('/playerStats', function (req, res) {
	return res.json({
		msg: 'playerStats',
		data: playerStats
	});
});

// Serves recentEvents.
app.get('/recentEvents', function (req, res) {
	return res.json({
		msg: 'recentEvents',
		data: recentEvents
	});
});

// Serves recentSpells.
app.get('/recentSpells', function (req, res) {
	return res.json({
		msg: 'recentSpells',
		data: recentSpells
	});
});

/**
 * Clears data from the store.
 */
app.get('/reset', function (req, res) {
	recentEvents = [];
	recentSpells = [];
	playerStats = {};
	zombieTenMinuteCounter = [];
	zombiesKilledLastSecond = 0;

	return res.json({
		msg: 'Reset!',
	});
});

/**
 *
 */
app.get('/throughput', function (req, res) {
	return res.json({
		msg: 'throughput',
		data: {
			throughputStats: throughputStats(),
			throughputCounterLimit: throughputCounterLimit,
			throughputCounter: throughputCounter,
		}
	});
});

app.use(express.static('app/'));

app.listen(8666, function () {
	console.log('Zombie Scoreboard app listening on port 8666!');
	if (throughputLogging) {
		startThroughputLogging();
	}
	startZombieTenMinuteLogging();
});
