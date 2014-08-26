"use strict";
module.exports.getRandomIntInRange = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
