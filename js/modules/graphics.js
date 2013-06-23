//Graphics
var GRAPHICS = (function (g) {
	var g = {};
	g.context;
	g.canvasWidth = 500;
	g.canvasHeight = 500;

	g.init = function(GAME) {
		g.game = GAME;

		if($("#snakeCanvas")[0].getContext) {
			g.context = $("#snakeCanvas")[0].getContext("2d");
			g.clearAll();
			return true;
		}
		else {
			return false;
		}
	};

	g.drawBox = function(x,y, fillStyle) {
		g.context.fillStyle = fillStyle;
		g.context.fillRect(x*(g.canvasWidth/g.game.getGameboardSize().xSize), y*(g.canvasHeight/SNAKE.getGameboardSize().ySize), g.canvasWidth/SNAKE.getGameboardSize().xSize, g.canvasHeight/SNAKE.getGameboardSize().ySize);
	}

	g.drawEndScreen = function(fillStyle, score) {
		console.log("drawEndScreen", fillStyle, score);
		g.context.fillStyle = fillStyle;
		g.context.fillRect(0,0,g.canvasWidth,g.canvasHeight, fillStyle);
		g.context.textAlign = "center";

		g.context.fillStyle = "WHITE";
		g.context.font="36pt Comfortaa";
		g.context.fillText("GAME OVER!", g.canvasWidth/2, g.canvasWidth/2);

		g.context.font="24pt Comfortaa";
		g.context.fillText("SCORE: " + score, g.canvasWidth/2, (g.canvasWidth/2) + 100);
	}

	g.clearBox = function(x,y) {
		g.context.clearRect(x*(g.canvasWidth/g.game.getGameboardSize().xSize), y*(g.canvasHeight/SNAKE.getGameboardSize().ySize), g.canvasWidth/SNAKE.getGameboardSize().xSize, g.canvasHeight/SNAKE.getGameboardSize().ySize);
	}

	g.clearAll = function() {
		console.log("clearAll");
		g.context.clearRect(0,0,10000,100000);
	}

	function drawFood(msg, foodItem) {
		console.log(msg, foodItem);
		g.drawBox(foodItem.posX, foodItem.posY, "red");
	}

	function drawSnakePart(msg, snakePart) {
		console.log(msg, snakePart);
		g.drawBox(snakePart.posX, snakePart.posY, "black");
	}

	function handleDrawEndScreen(msg, data) {
		console.log(msg, data);
		g.drawEndScreen(data.color, data.score);
	}
	//Setup subscription for ADD FOOD event
	PubSub.subscribe("ADD FOOD", drawFood);
	PubSub.subscribe("DRAW FOOD", drawFood);
	PubSub.subscribe("ADD SNAKE PART", drawSnakePart);
	PubSub.subscribe("CLEAR", g.clearAll);
	PubSub.subscribe("DRAW END SCREEN", handleDrawEndScreen);

	return g;
})(GRAPHICS || {});