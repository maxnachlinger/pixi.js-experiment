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
		//graphics.lineStyle(1, 0x000000, 1);
		graphics.beginFill(0xffffff);
		graphics.drawRect(cell.rect.x, cell.rect.y, cell.rect.width, cell.rect.height);

		//graphics.lineStyle(1, 0xc0c0c0, 1);
		graphics.beginFill(0xf2f2f2);

		graphics.drawRect(cell.estimateRect.x, cell.estimateRect.y, cell.estimateRect.width, cell.estimateRect.height);

		var estText = new PIXI.Text('(' + cellIdx + ') ' + cell.rect.x + ',' + cell.rect.y, {font: "14px Arial", fill: "black", align: "left", wordWrap: true, wordWrapWidth: cell.estimateRect.width});
		estText.position.x = cell.estimateRect.x + 5;
		estText.position.y = cell.estimateRect.y + 5;
		stage.addChild(estText);

		graphics.drawRect(cell.nameRect.x, cell.nameRect.y, cell.nameRect.width, cell.nameRect.height);
	})
}

var renderer = new PIXI.autoDetectRenderer(estimateBoardGrid.rect.width, estimateBoardGrid.rect.height);
document.body.appendChild(renderer.view);

var estimateBoard = new PIXI.Graphics();
stage.addChild(estimateBoard);
debugDrawEstimateBoard(stage, estimateBoard);

renderer.render(stage);
