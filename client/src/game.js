"use strict";
var css = require('./css/style.css');
var PIXI = require('pixi');
var easing = require('./util/easing');
var random = require('./util/random');
var EstimateBoard = require('./views/estimateBoard');
//var LoadingScreen = require('./views/loadingScreen');

var stage, renderer, estimateBoard, cardTexture;
var estimatesToAnimateIn = [];
var amtEstimatesAnimated = 0;
var running = false;

module.exports.setup = function(params, cb) {
	var gameCanvasId = params.gameCanvasId;
	var cardImageUrl = params.cardImageUrl;
	var backgroundTileUrl = params.backgroundTileUrl;
	var boardMargin = params.hasOwnProperty('boardMargin') ? params.boardMargin : 10;
	var rows = params.rows || 5;
	var cols = params.cols || 6;
	var cellPadding = params.hasOwnProperty('cellPadding') ? params.cellPadding : 5;

	stage = new PIXI.Stage(0xffffff);
	stage.setInteractive(true);

	var gameCanvas = document.getElementById(gameCanvasId);
	renderer = new PIXI.autoDetectRenderer(gameCanvas.width, gameCanvas.height, gameCanvas);

	//var loadingScreen = new LoadingScreen(stage, renderer);
	var loader = new PIXI.AssetLoader([cardImageUrl, backgroundTileUrl]);

	loader.onComplete = function() {
		//loadingScreen.complete();
		var tilingSprite = new PIXI.TilingSprite(PIXI.Texture.fromImage(backgroundTileUrl), renderer.view.width, renderer.view.height);
		stage.addChild(tilingSprite);

		cardTexture = PIXI.Texture.fromImage(cardImageUrl);
		var cardSprite = new PIXI.Sprite(cardTexture);

		estimateBoard = new EstimateBoard({
			boardMargin: boardMargin,
			rows: rows,
			cols: cols,
			colSize: new PIXI.Rectangle(0, 0, cardSprite.width + (2 * cellPadding), cardSprite.height + (2 * cellPadding)),
			colPadding: cellPadding
		});
		cb();
	};
	//loader.on('onProgress', function (e) {
	//	loadingScreen.progress((1 - (e.content.loadCount / e.content.assetURLs.length)) * 100);
	//});
	loader.load();
};

module.exports.addEstimate = function(estimate) {
	var estimateBlock = estimateBoard.getNextEmptyCell();
	estimateBlock.data = estimate;

	// place estimate in its column off screen
	var startPoint = getRandomOffscreenPoint();
	estimateBlock.currentLocation = startPoint;

	estimateBlock.easing = function (tick) {
		var x = easing.easeInCubic(tick, startPoint.x, estimateBlock.rect.x - startPoint.x, 60);
		var y = easing.easeInCubic(tick, startPoint.y, estimateBlock.rect.y - startPoint.y, 60);
		return new PIXI.Point(x, y);
	};
	estimateBlock.frameNumber = 0;
	estimateBlock.moveComplete = false;
	estimateBlock.sprite = new PIXI.Sprite(cardTexture);
	estimateBlock.added = false;

	estimatesToAnimateIn.push(estimateBlock);
	animate({mode: 'triggered'});
};

function animate(params) {
	var mode = params.mode;
	if (mode === 'triggered' && running) {
		console.log('triggered but already running.');
		return;
	}

	running = true;

	if (amtEstimatesAnimated >= estimatesToAnimateIn.length) {
		console.log('added all, stopping');
		running = false;
		return;
	}

	drawEstimates();
	requestAnimFrame(function () { animate({mode: 'auto'}); });
}

function drawEstimates() {
	var estimateBlock = {};
	for (var i = 0, c = estimatesToAnimateIn.length; i < c; i++) {
		estimateBlock = estimatesToAnimateIn[i];
		if (!estimateBlock.added)
			stage.addChild(estimateBlock.sprite);

		if (estimateBlock.currentLocation.x != estimateBlock.rect.x || estimateBlock.currentLocation.y != estimateBlock.rect.y)
			estimateBlock.currentLocation = estimateBlock.easing(++estimateBlock.frameNumber);

		estimateBlock.sprite.position = estimateBlock.currentLocation;

		if (estimateBlock.currentLocation.x == estimateBlock.rect.x && estimateBlock.currentLocation.y == estimateBlock.rect.y) {
			if (!estimateBlock.moveComplete) {
				estimateBlock.moveComplete = true;
				amtEstimatesAnimated++;
			}
			console.log(amtEstimatesAnimated, 'item(s) done easing in.');
		}
	}
	renderer.render(stage);
}

function getRandomOffscreenPoint() {
	var x = [
		random.getRandomIntInRange(-110, (2 * -110)), // left off-screen
		random.getRandomIntInRange(renderer.width, renderer.width + (2 * 110)) // right off-screen
	][random.getRandomIntInRange(0, 1)];

	var y = [
		random.getRandomIntInRange(-110, (2 * -110)), // top off-screen
		random.getRandomIntInRange(renderer.height, renderer.height + (2 * 110)) // bottom off-screen
	][random.getRandomIntInRange(0, 1)];

	return new PIXI.Point(x, y);
}
