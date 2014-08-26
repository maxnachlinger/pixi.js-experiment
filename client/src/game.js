"use strict";
var css = require('./css/style.css');
var PIXI = require('pixi');
var easing = require('./util/easing');
var random = require('./util/random');

var stage, renderer, estimateBoard, backgroundTexture, cardTexture;
var estimatesToAnimateIn = [];
var amtEstimatesAnimated = 0;
var running = false;

module.exports.setup = function(params) {
	stage = params.stage;
	renderer = params.renderer;
	estimateBoard = params.estimateBoard;
	backgroundTexture = params.backgroundTexture;
	cardTexture = params.cardTexture;

	var tilingSprite = new PIXI.TilingSprite(backgroundTexture, renderer.view.width, renderer.view.height);
	stage.addChild(tilingSprite);
};

module.exports.addEstimate = function(estimate) {
	var cell = estimateBoard.getNextEmptyCell();
	cell.data = estimate;

	// place estimate in its column off screen
	var startPoint = getRandomOffscreenPoint();
	cell.easingCurrent = startPoint;

	cell.easing = function (tick) {
		var x = easing.easeInCubic(tick, startPoint.x, cell.rect.x - startPoint.x, 60);
		var y = easing.easeInCubic(tick, startPoint.y, cell.rect.y - startPoint.y, 60);
		return new PIXI.Point(x, y);
	};
	cell.frameNumber = 0;
	cell.easingComplete = false;
	cell.sprite = new PIXI.Sprite(cardTexture);
	cell.added = false;

	estimatesToAnimateIn.push(cell);
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
	var e = {};
	for (var i = 0, c = estimatesToAnimateIn.length; i < c; i++) {
		e = estimatesToAnimateIn[i];
		if (!e.added)
			stage.addChild(e.sprite);

		if (e.easingCurrent.x != e.rect.x || e.easingCurrent.y != e.rect.y)
			e.easingCurrent = e.easing(++e.frameNumber);

		e.sprite.position = e.easingCurrent;

		if (e.easingCurrent.x == e.rect.x && e.easingCurrent.y == e.rect.y) {
			if (!e.easingComplete) {
				e.easingComplete = true;
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
