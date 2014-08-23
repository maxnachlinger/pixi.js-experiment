"use strict";
var PIXI = require('pixi');
var EstimateTile = require('./estimateTile');

module.exports = EstimateBoardGrid;

function EstimateBoardGrid(params) {
	if (!(this instanceof EstimateBoardGrid)) return new EstimateBoardGrid(params);

	var rows = params.rows || 6;
	var cols = params.cols || 6;
	var colRect = params.colRect || new PIXI.Rectangle(0, 0, 110, 110);
	// colPadding could be 0, for || 5 wouldn't work
	var colPadding = params.hasOwnProperty('colPadding') ? params.colPadding : 5;

	var board = {
		rect: new PIXI.Rectangle(0, 0, cols * colRect.width, rows * colRect.height),
		cells: []
	};

	// backwards since we want 0,0 (the first estimate) to be at the bottom left
	for (var j = cols - 1; j >= 0; j--) {
		for (var i = 0; i < rows; i++) {
			board.cells.push(new EstimateTile({
				rect: new PIXI.Rectangle(
					(i * colRect.width),
					(j * colRect.height),
					colRect.width,
					colRect.height
				),
				padding: colPadding
			}));
		}
	}

	return board;
}
