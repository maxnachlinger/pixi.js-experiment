"use strict";
var stage = new PIXI.Stage(0xFFFFFF, true);
stage.setInteractive(true);

var renderer = new PIXI.autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);

var estimateBoard = new PIXI.Graphics();
stage.addChild(estimateBoard);

var estimates = [];
var estimatesToDraw = [];
var startX = -100;

function addEstimate(estimate) {
	estimates.push(estimate);

	startX += 110;
	estimatesToDraw.push({
		rect: new PIXI.Rectangle(startX, 0, 100, 100),
		text: new PIXI.Text(estimate.estimate + "\n" + estimate.name, {font: "32px Arial", fill: "white", align: "center"}),
		added: false
	});
}

function drawEstimates() {
	estimateBoard.clear();

	estimatesToDraw.forEach(function (e, idx) {
		estimateBoard.beginFill(0xff0000);
		estimateBoard.lineStyle(2, 0x000000, 1);
		estimateBoard.drawRect(e.rect.x, e.rect.y, e.rect.width, e.rect.height);

		e.text.position.x = e.rect.x + 15;
		e.text.position.y = e.rect.y + 15;
		if (!e.added)
			stage.addChild(e.text);

		estimatesToDraw[idx].added = true;
	});
}

function animate() {
	requestAnimFrame(animate);

	estimatesToDraw = estimatesToDraw.map(function (estimate) {
		if((estimate.rect.y + 1) < 500)
			estimate.rect.y++;
		return estimate;
	});

	drawEstimates();
	renderer.render(stage);
}

/* test */
var testEstimates = [
	{name: 'Crab', estimate: '8'},
	{name: 'Monkey', estimate: '10'},
	{name: 'Mr. Fun Fun', estimate: '12'}
];
var testEstimates2 = [
	{name: 'Crab', estimate: '8'},
	{name: 'Monkey', estimate: '10'},
	{name: 'Mr. Fun Fun', estimate: '12'}
];
var testInterval = setInterval(function() {
	if(testEstimates.length === 0)
		return clearInterval(testInterval);
	addEstimate(testEstimates.pop());
}, 1000);
var testInterval2 = setInterval(function() {
	if(testEstimates2.length === 0)
		return clearInterval(testInterval2);
	addEstimate(testEstimates2.pop());
}, 3000);
animate();