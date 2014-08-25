"use strict";
var css = require('../css/style.css');
var PIXI = require('pixi');
var EstimateBoard = require('./estimateBoard');
var easing = require('./easing');

var stage = new PIXI.Stage(0xc0c0c0);
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
	if(!cell) throw new Error('No cell left for this estimate, the board is too small.');

	cell.data = estimate;
	cell.added = false;

	// place estimate in its column off screen
	cell.yEasingCurrent = -cell.rect.height;
	cell.yEasing = function(tick) {
		return easing.easeInCubic(tick, 0, cell.rect.y + cell.rect.y, 30);
	};
	cell.currentTime = 0;
	cell.easingComplete = false;

	estimatesToAnimateIn.push(cell);
	animate({mode: 'triggered'});
}

function drawEstimates() {
	estimateBoardGfx.clear();

	var e = {};
	for (var i = 0, c = estimatesToAnimateIn.length; i < c; i++) {
		e = estimatesToAnimateIn[i];

		if(e.yEasingCurrent < e.rect.y)
			e.yEasingCurrent = e.yEasing(++e.currentTime);

		estimateBoardGfx.beginFill(0xff0000);
		estimateBoardGfx.lineStyle(1, 0x000000, 1);
		estimateBoardGfx.drawRect(e.rect.x, e.yEasingCurrent, e.rect.width, e.rect.height);
		estimateBoardGfx.endFill();

//		e.text.position.x = e.rect.x + 15;
//		e.text.position.y = e.rect.y + 15;
//		if (!e.added)
//			stage.addChild(e.text);

		e.added = true;

		if(e.yEasingCurrent >= e.rect.y) {
			if(!e.easingComplete) {
				e.easingComplete = true;
				amtAdded++;
			}
			console.log(amtAdded, 'item(s) done easing in.');
		}
	}
	renderer.render(stage);
}

var amtAdded = 0;
var running = false;

function animate(params) {
	var mode = params.mode;
	if(mode === 'triggered' && running) {
		console.log('triggered but already running.');
		return;
	}

	running = true;

	if(amtAdded >= estimatesToAnimateIn.length) {
		console.log('added all, stopping');
		running = false;
		return;
	}

	drawEstimates();
	requestAnimFrame(function() { animate({mode: 'auto'}); });
}

renderer.render(stage);

function addTestEstimates() {
	var testInterval, testInterval2;
	var testEstimates = [];
	var testEstimates2 = [];

	for(var i = 0; i < 24; i++) {
		if(i < 20) {
			testEstimates.push({name: 'Test'+i, estimate: i});
			continue;
		}
		testEstimates2.push({name: 'Test'+i, estimate: i});
	}

	testInterval = setInterval(function () {
		if (testEstimates.length === 0)
			return clearInterval(testInterval);
		addEstimate(testEstimates.pop());
	}, 200);

	testInterval2 = setInterval(function () {
		if(testEstimates.length > 0) return; // do the second second, um, second!
		if (testEstimates2.length === 0)
			return clearInterval(testInterval2);
		addEstimate(testEstimates2.pop());
	}, 1000);
}
