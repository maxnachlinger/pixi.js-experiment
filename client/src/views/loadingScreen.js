"use strict";
var PIXI = require('pixi');

module.exports = LoadingScreen;

function LoadingScreen(stage, renderer) {
	if (!(this instanceof LoadingScreen)) return new LoadingScreen(stage, renderer);

	var graphics = new PIXI.Graphics(stage, renderer);
	stage.addChild(graphics);

	graphics.lineStyle(5, 0x000000, 1);
	graphics.beginFill(0xffffff);
	graphics.drawRect(renderer.view.x, renderer.view.y, renderer.view.width, renderer.view.height);
	graphics.endFill();

	var centerPoint = new PIXI.Point(
		Math.round(renderer.view.width / 2),
		Math.round(renderer.view.height / 2)
	);

	var text = new PIXI.Text('Loading', {font: "12px Arial", fill: "black", align: "center"});
	text.position.x = (centerPoint.x - text.width) / 2;
	text.position.y = (centerPoint.y - text.height) / 2;
	graphics.addChild(text);

	renderer.render(stage);

	function progress(percentage) {
		console.log('Loading - ' + percentage + '%');
		text.setText('Loading - ' + percentage + '%');
		text.position.x = (centerPoint.x - text.width) / 2;
		text.position.y = (centerPoint.y - text.height) / 2;
		renderer.render(stage);
	}

	function complete() {
		stage.removeChild(graphics);
	}

	return {
		progress: progress,
		complete: complete
	};
}
