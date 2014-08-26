"use strict";
var game = require('./game');
var PIXI = require('pixi');
var EstimateBoard = require('./views/estimateBoard');
//var LoadingScreen = require('./views/loadingScreen');

var stage = new PIXI.Stage(0xffffff);
stage.setInteractive(true);

var gameCanvas = document.getElementById("game-canvas");
//var renderer = new PIXI.autoDetectRenderer(gameCanvas.width, gameCanvas.height, gameCanvas);
var renderer = new PIXI.autoDetectRenderer(560, 630, gameCanvas);

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

	var cardSprite = new PIXI.Sprite(PIXI.Texture.fromImage('images/card.png'));
	var estimateBoard = new EstimateBoard({
		boardMargin: 10,
		rows: 5,
		cols: 6,
		colSize: new PIXI.Rectangle(0, 0, cardSprite.width + 10, cardSprite.height + 10),
		colPadding: 5
	});

	game(stage, renderer, estimateBoard);
}
