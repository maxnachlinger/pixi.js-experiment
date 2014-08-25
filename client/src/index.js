"use strict";
var css = require('./css/style.css');
var PIXI = require('pixi');
var EstimateBoard = require('./estimateBoard');
var easing = require('./easing');

var stage = new PIXI.Stage(0xffffff);
stage.setInteractive(true);

var estimateBoard = new EstimateBoard({
	rows: 5,
	cols: 6,
	colSize: new PIXI.Rectangle(0, 0, 110, 110),
	colPadding: 5
});

// TODO - listen for window resize and resize the renderer
var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
renderer.view.style.display = "block";
document.body.appendChild(renderer.view);

var estimateBoardGfx = new PIXI.Graphics();
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
	cell.currentTime = 0;
	cell.easingComplete = false;

	estimatesToAnimateIn.push(cell);
	animate({mode: 'triggered'});
}

function getRandomOffscreenPoint() {
	var x =  [
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

		if (e.easingCurrent.x != e.rect.x || e.easingCurrent.y != e.rect.y)
			e.easingCurrent = e.easing(++e.currentTime);

		estimateBoardGfx.beginFill(0xff0000);
		estimateBoardGfx.lineStyle(1, 0x000000, 1);
		estimateBoardGfx.drawRect(e.easingCurrent.x, e.easingCurrent.y, e.rect.width, e.rect.height);
		estimateBoardGfx.endFill();

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
	var testInterval;
	var testEstimates = [];

	for (var i = 0, c = getRandomInt(8,30); i < c; i++) {
		testEstimates.push({name: 'Test', estimate: i});
	}

	testInterval = setInterval(function () {
		if (testEstimates.length === 0) {
			clearInterval(testInterval);
			return;
		}
		addEstimate(testEstimates.pop());
	}, 300);
}

function reset() {
	estimatesToAnimateIn = [];
	amtAdded = 0;
	estimateBoardGfx.clear();
	estimateBoard.clear();
	renderer.render(stage);
}
