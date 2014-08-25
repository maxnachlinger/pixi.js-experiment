"use strict";
// cubic easing in - accelerating from zero velocity
module.exports.easeInCubic = function (currentTime, startValue, changeInValue, duration) {
	currentTime /= duration;
	return changeInValue * currentTime * currentTime * currentTime + startValue;
};
