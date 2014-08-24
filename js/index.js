"use strict";
var stage = new PIXI.Stage(0xc0c0c0, true);
stage.setInteractive(true);

var estimateBoardGrid = new EstimateBoardGrid({
	rows: 5,
	cols: 6,
	colSize: new PIXI.Rectangle(0, 0, 110, 110),
	colPadding: 5
});

var renderer = new PIXI.autoDetectRenderer(estimateBoardGrid.rect.width, estimateBoardGrid.rect.height);
renderer.view.style.display = "block";
document.body.appendChild(renderer.view);

var estimateBoard = new PIXI.Graphics();
stage.addChild(estimateBoard);

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

var estimatesToAnimateIn = [];

function addEstimate(estimate) {
	var cell = estimateBoardGrid.getNextCell();
	if(!cell) throw new Error('No cell left for this estimate, the board is too small.');

	cell.data = estimate;
	cell.added = false;
	// place estimate in its column off screen
	cell.startPoint = new PIXI.Point(cell.rect.x, -cell.rect.height);

	estimatesToAnimateIn.push(cell);
}

function drawEstimates() {
//	if(estimatesToAnimateIn.length === 0) {
//		haltAnimation = true;
//		return;
//	}

	estimateBoard.clear();

	estimatesToAnimateIn.forEach(function (e, idx) {
		estimateBoard.beginFill(0xff0000);
		estimateBoard.lineStyle(1, 0x000000, 1);
		estimateBoard.drawRect(e.rect.x, e.startPoint.y, e.rect.width, e.rect.height);
		estimateBoard.endFill();

//		e.text.position.x = e.rect.x + 15;
//		e.text.position.y = e.rect.y + 15;
//		if (!e.added)
//			stage.addChild(e.text);

		estimatesToAnimateIn[idx].added = true;
	});
}

// todo - halt animation when every estimate is placed

var haltAnimation = false;

function animate() {
	if(haltAnimation) return;
	requestAnimFrame(animate);

	for (var i = 0, c = estimatesToAnimateIn.length; i < c; i++) {
		if (estimatesToAnimateIn[i].startPoint.y < estimatesToAnimateIn[i].rect.y) {
			estimatesToAnimateIn[i].startPoint.y += 5;
		}
	}

	drawEstimates();
	renderer.render(stage);
}

animate();
renderer.render(stage);

function EstimateBoardGrid(params) {
	if (!(this instanceof EstimateBoardGrid)) return new EstimateBoardGrid(params);

	var rows = params.rows || 6;
	var cols = params.cols || 6;
	var colSize = params.colSize || new PIXI.Rectangle(0, 0, 110, 110);
	// colPadding could be 0, for || 5 wouldn't work
	var colPadding = params.hasOwnProperty('colPadding') ? params.colPadding : 5;

	var cells = [];
	var boardRect = new PIXI.Rectangle(0, 0, cols * colSize.width, rows * colSize.height);
	var rect = new PIXI.Rectangle();
	var contentRect = new PIXI.Rectangle();
	var estimateRectHeight = 0;

	// we want 0,0 to be at the bottom left for the first estimate
	for (var i = 0, bottomOffset = 1; i < rows; i++, bottomOffset++) {
		for (var j = 0; j < cols; j++) {

			rect = new PIXI.Rectangle(
				(j * colSize.width),
				(boardRect.height - (colSize.height * bottomOffset)),
				colSize.width,
				colSize.height
			);
			contentRect = new PIXI.Rectangle(
				(rect.x + colPadding),
				(rect.y + colPadding),
				(rect.width - (2 * colPadding)),
				(rect.height - (2 * colPadding))
			);
			estimateRectHeight = Math.round(contentRect.height * 0.5); // estimate takes up the top 1/2

			cells.push({
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
				),
				data: null,
				added: false
			});
		}
	}

	function debugDrawEstimateBoard(stage) {
		var graphics = new PIXI.Graphics();

		estimateBoardGrid.cells.forEach(function (cell, idx) {
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

	function getNextCell() {
		for (var i = 0, c = cells.length; i < c; i++) {
			if (!cells[i].data) return cells[i];
		}
		return null;
	}

	return {
		rect: boardRect,
		cells: cells,
		debugDrawEstimateBoard: debugDrawEstimateBoard,
		getNextCell: getNextCell
	};
}
