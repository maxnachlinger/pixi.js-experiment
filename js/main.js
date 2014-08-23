"use strict";
var stage = new PIXI.Stage(0xFFFFFF, true);
stage.setInteractive(true);

var estimatesPerRow = 6;
var amtRows = 6;
var cellWidth = 110;
var cellHeight = 110;
var cellPadding = 5;
var grid = [];

function setupGrid() {
	var row = [];
	var lastRowIdx = -1;
	var rowIdx = 0;
	var rect = new PIXI.Rectangle();

	for (var i = 0, c = estimatesPerRow * amtRows; i < c; i++) {
		rowIdx = Math.floor(i / estimatesPerRow);
		if (rowIdx != lastRowIdx) {
			if (row.length)
				grid.push(row);

			lastRowIdx = rowIdx;
			row = [];
		}
		rect = new PIXI.Rectangle(
				row.length * cellWidth,
				rowIdx * cellHeight,
				cellWidth,
				cellHeight
		);
		row.push({
			data: null,
			location: rect,
			contentLocation: new PIXI.Rectangle(
					rect.x + cellPadding,
					rect.y + cellPadding,
					rect.width - (2 * cellPadding),
					rect.height - (2 * cellPadding)
			)
		});
	}

	if(row.length)
		grid.push(row);

	// we expect 0,0 to be at the bottom left, since the 1st estimate will go there
	grid.reverse();
}

function debugDrawGrid() {
	grid.forEach(function(row, rowIdx) {
		row.forEach(function(cell, cellIdx) {

			estimateBoard.lineStyle(1, 0x000000, 1);
			estimateBoard.beginFill(0xffffff);
			estimateBoard.drawRect(cell.location.x, cell.location.y, cell.location.width, cell.location.height);

			estimateBoard.lineStyle(1, 0xc0c0c0, 1);
			estimateBoard.beginFill(0xf2f2f2);
			estimateBoard.drawRect(cell.contentLocation.x, cell.contentLocation.y, cell.contentLocation.width, cell.contentLocation.height);

			var text = new PIXI.Text(rowIdx + ',' + cellIdx, {font: "16px Arial", fill: "black", align: "center", wordWrap: true, wordWrapWidth: cell.contentLocation.width});
			text.position.x = cell.contentLocation.x + 15;
			text.position.y = cell.contentLocation.y + 15;
			text.position.anchor = new PIXI.Point(0.5, 0.5);
			stage.addChild(text);
		})
	});
}

setupGrid();
console.log(grid);

var renderer = new PIXI.autoDetectRenderer(
		estimatesPerRow * cellWidth,
		amtRows * cellHeight
);
document.body.appendChild(renderer.view);

var estimateBoard = new PIXI.Graphics();
stage.addChild(estimateBoard);
debugDrawGrid();

renderer.render(stage);

/*
var estimates = [];

var estimatesToDraw = [];
var startX = -estimateSize.width;
var estimateIdx = -1;
var row = 0;

function addEstimate(estimate) {
	estimates.push(estimate);

	row = Math.floor(++estimateIdx / estimatesPerRow);
	if (estimateIdx && estimateIdx % estimatesPerRow === 0)
		startX = -estimateSize.width;

	startX += estimateSize.width + estimatePaddingLeft;
	estimatesToDraw.push({
		baseY: row * (estimateSize.height + estimatePaddingBottom),
		rect: new PIXI.Rectangle(startX, 0, estimateSize.width, estimateSize.height),
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

// todo - halt animation when every estimate is placed
function animate() {
	requestAnimFrame(animate);

	estimatesToDraw = estimatesToDraw.map(function (estimate) {

		if ((estimate.rect.y + estimate.baseY + 1) < (renderer.height - estimateSize.height))
			estimate.rect.y++;

		return estimate;
	});

	drawEstimates();
	renderer.render(stage);
}

var testEstimates = [
	{name: 'Crab', estimate: '8'},
	{name: 'Monkey', estimate: '10'},
	{name: 'Mr. Fun Fun', estimate: '12'},
	{name: 'Chicklet', estimate: '8'},
	{name: 'Rama Lama', estimate: '10'},
	{name: 'Ding Dong', estimate: '12'},
	{name: 'Crab', estimate: '8'},
	{name: 'Monkey', estimate: '10'},
	{name: 'Mr. Fun Fun', estimate: '12'},
	{name: 'Chicklet', estimate: '8'},
	{name: 'Rama Lama', estimate: '10'},
	{name: 'Ding Dong', estimate: '12'},
	{name: 'Crab', estimate: '8'},
	{name: 'Monkey', estimate: '10'},
	{name: 'Mr. Fun Fun', estimate: '12'},
	{name: 'Chicklet', estimate: '8'}
];
var testInterval = setInterval(function () {
	if (testEstimates.length === 0)
		return clearInterval(testInterval);
	addEstimate(testEstimates.pop());
}, 750);
animate();
*/