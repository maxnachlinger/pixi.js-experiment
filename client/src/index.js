"use strict";
var game = require('./game');

game.setup({
	gameCanvasId: "game-canvas",
	cardImageUrl: "images/card.png",
	backgroundTileUrl: 'images/background.jpg'
}, debugAddEstimates);

var random = require('./util/random');
function debugAddEstimates() {
	var testInterval, testInterval2;
	var testEstimates = [], testEstimates2 = [];

	for (var i = 0, c = random.getRandomIntInRange(1, 8); i < c; i++) {
		testEstimates.push({name: 'Test', estimate: i});
	}
	for (var i = 0, c = random.getRandomIntInRange(1, 4); i < c; i++) {
		testEstimates2.push({name: 'Test', estimate: i});
	}

	testInterval = setInterval(function () {
		if (testEstimates.length === 0) {
			clearInterval(testInterval);
			return;
		}
		game.addEstimate(testEstimates.pop());
	}, 300);
	testInterval2 = setInterval(function () {
		if (testEstimates2.length === 0) {
			clearInterval(testInterval2);
			return;
		}
		game.addEstimate(testEstimates2.pop());
	}, 750);
}

setTimeout(function() {
	game.showEstimates();
}, 5000);
