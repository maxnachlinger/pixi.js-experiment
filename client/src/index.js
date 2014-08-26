"use strict";
var game = require('./game');
var PIXI = require('pixi');
var EstimateBoard = require('./views/estimateBoard');
//var LoadingScreen = require('./views/loadingScreen');

var stage = new PIXI.Stage(0xffffff);
stage.setInteractive(true);

var gameCanvas = document.getElementById("game-canvas");
var renderer = new PIXI.autoDetectRenderer(gameCanvas.width, gameCanvas.height, gameCanvas);
//var loadingScreen = new LoadingScreen(stage, renderer);

var assetsToLoad = ['images/card.png', 'images/background.jpg'];

var loader = new PIXI.AssetLoader(assetsToLoad);
loader.onComplete = setupGame;
//loader.on('onProgress', function (e) {
//	loadingScreen.progress((1 - (e.content.loadCount / e.content.assetURLs.length)) * 100);
//});
loader.load();

function setupGame() {
	//loadingScreen.complete();

	var cardTexture = PIXI.Texture.fromImage('images/card.png');
	var cardSprite = new PIXI.Sprite(cardTexture);

	var estimateBoard = new EstimateBoard({
		boardMargin: 10,
		rows: 5,
		cols: 6,
		colSize: new PIXI.Rectangle(0, 0, cardSprite.width + 10, cardSprite.height + 10),
		colPadding: 5
	});

	game.setup({
		stage: stage,
		renderer: renderer,
		estimateBoard: estimateBoard,
		backgroundTexture: PIXI.Texture.fromImage('images/background.jpg'),
		cardTexture: cardTexture
	});
	debugAddEstimates();
}

var random = require('./util/random');
function debugAddEstimates() {
	var testInterval, testInterval2;
	var testEstimates = [], testEstimates2 = [];

	for (var i = 0, c = random.getRandomIntInRange(1, 15); i < c; i++) {
		testEstimates.push({name: 'Test', estimate: i});
	}
	for (var i = 0, c = random.getRandomIntInRange(1, 15); i < c; i++) {
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
