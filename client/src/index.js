"use strict";
var game = require('./game');
var PIXI = require('pixi');
var stage = new PIXI.Stage(0xffffff);
stage.setInteractive(true);

var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
renderer.view.style.position = "absolute";
renderer.view.style.top = "0px";
renderer.view.style.left = "0px";
document.body.appendChild(renderer.view);

var assetsToLoad = ['images/red.png'];
var loader = new PIXI.AssetLoader(assetsToLoad);
loader.onComplete = function() {
	var texture, sprite;

	assetsToLoad.forEach(function(image) {
		texture = PIXI.Texture.fromImage(image);
		sprite  = new PIXI.Sprite(texture);
	});

	// run the game
	game(stage, renderer);
};
loader.load();
