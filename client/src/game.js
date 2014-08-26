"use strict";
var css = require('./css/style.css');
var PIXI = require('pixi');
var easing = require('./util/easing');

module.exports = function(stage, renderer, estimateBoard) {
	var tilingSprite = new PIXI.TilingSprite(PIXI.Texture.fromImage('images/background.jpg'), window.innerWidth, window.innerHeight);
	stage.addChild(tilingSprite);

	estimateBoard.debugDrawEstimateBoard(stage, renderer);

	var estimateBoardGfx = new PIXI.Graphics(stage, renderer);
	stage.addChild(estimateBoardGfx);

	var estimatesToAnimateIn = [];
	addTestEstimates();

	function addEstimate(estimate) {
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
		cell.sprite = new PIXI.Sprite(PIXI.Texture.fromImage('images/card.png'));
		cell.added = false;

		estimatesToAnimateIn.push(cell);
		animate({mode: 'triggered'});
	}

	function getRandomOffscreenPoint() {
		var x = [
			getRandomInt(-110, (2 * -110)), // left off-screen
			getRandomInt(renderer.width, renderer.width + (2 * 110)) // right off-screen
		][getRandomInt(0, 1)];

		var y = [
			getRandomInt(-110, (2 * -110)), // top off-screen
			getRandomInt(renderer.height, renderer.height + (2 * 110)) // bottom off-screen
		][getRandomInt(0, 1)];

		return new PIXI.Point(x, y);
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var amtAdded = 0;
	var running = false;

	function animate(params) {
		var mode = params.mode;
		if (mode === 'triggered' && running) {
			console.log('triggered but already running.');
			return;
		}

		running = true;

		if (amtAdded >= estimatesToAnimateIn.length) {
			console.log('added all, stopping');
			running = false;
			return;
		}

		drawEstimates();
		requestAnimFrame(function () { animate({mode: 'auto'}); });
	}

	function drawEstimates() {
		estimateBoardGfx.clear();

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
					amtAdded++;
				}
				console.log(amtAdded, 'item(s) done easing in.');
			}
		}
		renderer.render(stage);
	}

	function addTestEstimates() {
		var testInterval, testInterval2;
		var testEstimates = [], testEstimates2 = [];

		for (var i = 0, c = getRandomInt(1, 15); i < c; i++) {
			testEstimates.push({name: 'Test', estimate: i});
		}
		for (var i = 0, c = getRandomInt(1, 15); i < c; i++) {
			testEstimates2.push({name: 'Test', estimate: i});
		}

		testInterval = setInterval(function () {
			if (testEstimates.length === 0) {
				clearInterval(testInterval);
				return;
			}
			addEstimate(testEstimates.pop());
		}, 300);
		testInterval2 = setInterval(function () {
			if (testEstimates2.length === 0) {
				clearInterval(testInterval2);
				return;
			}
			addEstimate(testEstimates2.pop());
		}, 750);
	}

	function reset() {
		estimatesToAnimateIn = [];
		amtAdded = 0;
		estimateBoardGfx.clear();
		estimateBoard.clear();
		renderer.render(stage);
	}
};
