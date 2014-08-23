"use strict";
var PIXI = require('pixi');
var EstimateBoardGrid = require('./ui/estimateBoardGrid');

var stage = new PIXI.Stage(0xFFFFFF, true);
stage.setInteractive(true);

var estimateBoardGrid = new EstimateBoardGrid({
	rows: 6,
	cols: 6,
	colRect: new PIXI.Rectangle(0, 0, 110, 110),
	colPadding: 5
});

function debugDrawEstimateBoard(stage, graphics) {
	estimateBoardGrid.cells.forEach(function (cell, cellIdx) {
		graphics.lineStyle(1, 0x000000, 1);
		graphics.beginFill(0xffffff);
		graphics.drawRect(cell.rect.x, cell.rect.y, cell.rect.width, cell.rect.height);

		graphics.lineStyle(1, 0xc0c0c0, 1);
		graphics.beginFill(0xf2f2f2);

		graphics.drawRect(cell.estimateRect.x, cell.estimateRect.y, cell.estimateRect.width, cell.estimateRect.height);

		var estText = new PIXI.Text('(' + cellIdx + ') ' + cell.rect.x + ',' + cell.rect.y, {font: "14px Arial", fill: "black", align: "left", wordWrap: true, wordWrapWidth: cell.estimateRect.width});
		estText.position.x = cell.estimateRect.x + 5;
		estText.position.y = cell.estimateRect.y + 5;
		stage.addChild(estText);

		graphics.drawRect(cell.nameRect.x, cell.nameRect.y, cell.nameRect.width, cell.nameRect.height);
	})
}

var renderer = new PIXI.autoDetectRenderer(grid.rect.width, grid.rect.height);
document.body.appendChild(renderer.view);

var estimateBoard = new PIXI.Graphics();
stage.addChild(estimateBoard);
debugDrawEstimateBoard(stage, estimateBoard);

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