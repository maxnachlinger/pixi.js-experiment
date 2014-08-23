"use strict";
var PIXI = require('pixi');

module.exports = EstimateTile;

function EstimateTile(params) {
	if (!(this instanceof EstimateTile)) return new EstimateTile(params);

	var rect = params.rect || new PIXI.Rectangle(0, 0, 110, 110);
	// colPadding could be 0, for || 5 wouldn't work
	var padding = params.hasOwnProperty('padding') ? params.padding : 5;
	var data = params.data;

	var contentRect = new PIXI.Rectangle(
		(rect.x + padding),
		(rect.y + padding),
		(rect.width - (2 * padding)),
		(rect.height - (2 * padding))
	);
	var estimateRectHeight = Math.round(contentRect.height * 0.5); // estimate takes up the top 1/2

	var tile = {
		data: null,
		rect: rect,
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
		)
	};

	// TODO - add a data draw method

	return tile;
}
