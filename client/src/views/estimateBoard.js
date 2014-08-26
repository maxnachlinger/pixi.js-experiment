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
	var boardMargin = params.boardMargin || 5;

	var cells = [];
	var boardRect = new PIXI.Rectangle(
		boardMargin,
		boardMargin,
		(cols * colSize.width),
		(rows * colSize.height)
	);

	var colLocationSize = new PIXI.Rectangle();

	// we want 0,0 to be at the bottom left for the first estimate
	for (var i = 0, bottomOffset = 1; i < rows; i++, bottomOffset++) {
		for (var j = 0; j < cols; j++) {

			colLocationSize = new PIXI.Rectangle(
				(j * colSize.width) + colPadding + boardRect.x,
				(boardRect.height - (colSize.height * bottomOffset)) + colPadding + boardRect.y,
				colSize.width - (2 * colPadding),
				colSize.height - (2 * colPadding)
			);

			cells.push({
				rect: colLocationSize
			});
		}
	}

	function debugDrawEstimateBoard(stage, renderer) {
		var graphics = new PIXI.Graphics();

		graphics.lineStyle(1, 0xffffff, 1);
		graphics.drawRect(boardRect.x, boardRect.y, boardRect.width, boardRect.height);

		cells.forEach(function (cell, idx) {
			graphics.lineStyle(1, 0xffffff, 1);
			graphics.drawRect(cell.rect.x, cell.rect.y, cell.rect.width, cell.rect.height);

			var estText = new PIXI.Text('(' + idx + ') ' + cell.rect.x + ',' + cell.rect.y, {font: "12px Arial", fill: "white", align: "left"});
			estText.position.x = cell.rect.x + 5;
			estText.position.y = cell.rect.y + 5;
			graphics.addChild(estText);
		});

		stage.addChild(graphics);
		renderer.render(stage);
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
