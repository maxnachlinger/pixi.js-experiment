"use strict";
var PIXI = require('pixi');

module.exports = EstimateBoard;

function EstimateBoard(params) {
	if (!(this instanceof EstimateBoard)) return new EstimateBoard(params);

	var rows = params.rows || 6;
	var cols = params.cols || 6;
	var colSize = params.colSize || new PIXI.Rectangle(0, 0, 110, 110);
	// colPadding could be 0, for || 5 wouldn't work
	var colPadding = params.hasOwnProperty('colPadding') ? params.colPadding : 5;

	var cells = [];
	var boardRect = new PIXI.Rectangle(0, 0, cols * colSize.width, rows * colSize.height);
	var colLocationSize = new PIXI.Rectangle();
	var contentRect = new PIXI.Rectangle();
	var estimateRectHeight = 0;

	// we want 0,0 to be at the bottom left for the first estimate
	for (var i = 0, bottomOffset = 1; i < rows; i++, bottomOffset++) {
		for (var j = 0; j < cols; j++) {

			colLocationSize = new PIXI.Rectangle(
				(j * colSize.width),
				(boardRect.height - (colSize.height * bottomOffset)),
				colSize.width,
				colSize.height
			);

			cells.push({
				rect: colLocationSize,
				estimateRect: new PIXI.Rectangle(
					contentRect.x,
					contentRect.y,
					contentRect.width,
					estimateRectHeight
				),
				nameRect: new PIXI.Rectangle(
					contentRect.x,
					(contentRect.y + estimateRectHeight),
					contentRect.width,
					(contentRect.height - estimateRectHeight)
				),
				data: null,
				added: false
			});
		}
	}

	function debugDrawEstimateBoard(stage) {
		var graphics = new PIXI.Graphics();

		cols.forEach(function (cell, idx) {
			graphics.beginFill(0xffffff);
			graphics.lineStyle(1, 0x000000, 1);
			graphics.drawRect(cell.rect.x, cell.rect.y, cell.rect.width, cell.rect.height);
			graphics.endFill();

			graphics.beginFill(0xf2f2f2);
			graphics.lineStyle(1, 0xc0c0c0, 1);
			graphics.drawRect(cell.estimateRect.x, cell.estimateRect.y, cell.estimateRect.width, cell.estimateRect.height);
			graphics.endFill();

			var estText = new PIXI.Text('(' + idx + ') ' + cell.rect.x + ',' + cell.rect.y, {font: "14px Arial", fill: "black", align: "left", wordWrap: true, wordWrapWidth: cell.estimateRect.width});
			estText.position.x = cell.estimateRect.x + 5;
			estText.position.y = cell.estimateRect.y + 5;
			graphics.addChild(estText);

			graphics.beginFill(0xffffff);
			graphics.lineStyle(1, 0x000000, 1);
			graphics.drawRect(cell.nameRect.x, cell.nameRect.y, cell.nameRect.width, cell.nameRect.height);
			graphics.endFill();
		});

		stage.addChild(graphics);
	}

	function getNextEmptyCell() {
		for (var i = 0, c = cells.length; i < c; i++) {
			if (!cells[i].data) return cells[i];
		}
		throw new Error('No cells found.');
	}

	function clear() {
		for (var i = 0, c = cells.length; i < c; i++) {
			cells[i].data = null;
		}
	}

	return {
		rect: boardRect,
		cells: cells,
		clear: clear,
		debugDrawEstimateBoard: debugDrawEstimateBoard,
		getNextEmptyCell: getNextEmptyCell
	};
}
