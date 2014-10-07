"use strict";
var css = require('./css/style.css');
var PIXI = require('pixi');
var easing = require('./util/easing');
var random = require('./util/random');
var EstimateBoard = require('./views/estimateBoard');
//var LoadingScreen = require('./views/loadingScreen');

var stage, renderer, estimateBoard, cardTexture, cardSpriteSize;
var estimates = [];
var amtEstimatesAnimated = 0;
var running = false;

module.exports.setup = function(params, cb) {
	var gameCanvasId = params.gameCanvasId;
	var cardImageUrl = params.cardImageUrl;
	var backgroundTileUrl = params.backgroundTileUrl;
	// could be 0, so || DEFAULT wouldn't work
	var boardMargin = params.hasOwnProperty('boardMargin') ? params.boardMargin : 10;
	var rows = params.rows || 5;
	var cols = params.cols || 6;
	var cellPadding = params.hasOwnProperty('cellPadding') ? params.cellPadding : 5;

	stage = new PIXI.Stage(0xffffff, true);
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
		cardSpriteSize = new PIXI.Rectangle(0, 0, cardSprite.width, cardSprite.height);

		estimateBoard = new EstimateBoard({
			boardMargin: boardMargin,
			rows: rows,
			cols: cols,
			colSize: new PIXI.Rectangle(0, 0, cardSpriteSize.width + (2 * cellPadding), cardSpriteSize.height + (2 * cellPadding)),
			colPadding: cellPadding
		});
		estimateBoard.debugDrawEstimateBoard(stage, renderer);
		cb();
	};
	//loader.on('onProgress', function (e) {
	//	loadingScreen.progress((1 - (e.content.loadCount / e.content.assetURLs.length)) * 100);
	//});
	loader.load();
};

module.exports.addEstimate = function(estimateData) {
	var estimateBlock = estimateBoard.getNextEmptyCell();
	estimateBlock.data = estimateData;

	// get random off-screen point
	var startX = [
		random.getRandomIntInRange(-cardSpriteSize.width, (2 * -cardSpriteSize.width)), // left off-screen
		random.getRandomIntInRange(renderer.width, renderer.width + (2 * cardSpriteSize.width)) // right off-screen
	][random.getRandomIntInRange(0, 1)];
	var startY = [
		random.getRandomIntInRange(-cardSpriteSize.height, (2 * -cardSpriteSize.height)), // top off-screen
		random.getRandomIntInRange(renderer.height, renderer.height + (2 * cardSpriteSize.height)) // bottom off-screen
	][random.getRandomIntInRange(0, 1)];

	estimateBlock.currentLocation = new PIXI.Point(startX, startY);
	estimateBlock.center = new PIXI.Point(startX + (cardSpriteSize.width / 2), startY + (cardSpriteSize.height / 2))

	estimateBlock.animateInEasingFn = function (tick) {
		return new PIXI.Point(
			easing.easeInCubic(tick, estimateBlock.currentLocation.x, estimateBlock.rect.x - estimateBlock.currentLocation.x, 60),
			easing.easeInCubic(tick, estimateBlock.currentLocation.y, estimateBlock.rect.y - estimateBlock.currentLocation.y, 60)
		);
	};

	estimateBlock.flipFn = function(e) {
		var scaleX = e.sprite.scale.x * -1;
		var positionX = e.center.x - scaleX * e.rect.width / 2;
		return {
			scaleX: scaleX,
			position: new PIXI.Point(positionX, e.sprite.position.y)
		};
	};

	estimateBlock.frameNumber = 0;
	estimateBlock.animationNeeded = 'animateIn';
	estimateBlock.sprite = new PIXI.Sprite(cardTexture);
	estimateBlock.addedToStage = false;

	estimates.push(estimateBlock);
	animate({mode: 'triggered'})();
};

module.exports.showEstimates = function() {
	amtEstimatesAnimated = 0;
	for (var i = 0, c = estimates.length; i < c; i++) {
		estimates[i].animationNeeded = 'flip';
	}
	requestAnimFrame(animate({mode: 'triggered'}));
};

function animate(params) {
	return function() {
		var mode = params.mode;
		if (mode === 'triggered' && running) {
			console.log('triggered but already running.');
			return;
		}

		running = true;

		if (amtEstimatesAnimated >= estimates.length) {
			console.log('added all, stopping');
			running = false;
			return;
		}

		animateEstimates();
		requestAnimFrame(animate({mode: 'auto'}));
	};
}

function animateEstimates() {
	var e = {};
	for (var i = 0, c = estimates.length; i < c; i++) {
		e = estimates[i];
		if (!e.addedToStage)
			stage.addChild(e.sprite);

		if(e.animationNeeded == 'animateIn') {
			e.currentLocation = e.animateInEasingFn(++e.frameNumber);
			e.sprite.position = e.currentLocation;
		}
		if(e.animationNeeded == 'flip') {
			var flipData = e.flipFn(e);
			console.log(e.currentLocation.x, e.sprite.width, flipData.position.x)
//			e.currentLocation.x -= e.sprite.width;
//			e.sprite.position.x = e.currentLocation.x;
//			e.sprite.scale.x *= flipData.scaleX;
		}

		// we're done animating when we're back at our correct spot
		if (e.currentLocation.x == e.rect.x && e.currentLocation.y == e.rect.y) {
			if (e.animationNeeded) {
				e.animationNeeded = null;
				amtEstimatesAnimated++;
			}
			console.log(amtEstimatesAnimated, 'item(s) done animating.');
		}
	}
	renderer.render(stage);
}
