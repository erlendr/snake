var SNAKE = (function(s) {
	//Public object
	var s = {};
	s.version = "0.1";
	
	//Private game vars
	var GAMEBOARD_XSIZE = 50;
	var GAMEBOARD_YSIZE = 50;
	var GAME_SPEED = 50;
	var START_FOOD = 1;
	var gameBoard;
	var SCORE = 0;
	
	var lastEatTime = 0;
	
	//Keyboard
	var KEYCODE_UP = 38;
	var KEYCODE_DOWN = 40;
	var KEYCODE_LEFT = 37;
	var KEYCODE_RIGHT = 39;
	var KEYCODE_R = 82;
	var KEYCODE_P = 80;
	var KEYCODE_SPACE = 32;
	var KEYCODE_ENTER = 13;
	var KEYCODE_PLUS = 187;
	var KEYCODE_MINUS = 189;
	
	//Game state
	s.headings = {
		north: [0,-1],
		east: [-1,0],
		south: [0,1],
		west:[1,0]
	}
	s.currentHeading = {};
	var gamePaused = true;
	var snakeIsUpdating = false;
	
	//Snake
	//s.snake;
	var INIT_SNAKE_LENGTH = 3;
	var snakePart = function(posX, posY) {
		this.posX = posX;
		this.posY = posY;
		this.snake = true;
	};
	
	//Food
	var foodItem = function(posX, posY) {
		this.posX = posX;
		this.posY = posY;
		this.food = true;
	}
	
	//Init game
	s.init = function() {
		s.currentHeading = s.headings.north;
		createGameBoard(GAMEBOARD_XSIZE, GAMEBOARD_YSIZE);
		createSnake(INIT_SNAKE_LENGTH);
		initFoods(START_FOOD);
		initKeyboard();
		gameScore = 0;
		lastEatTime = new Date();
		updateGameScore();
		console.log("SNAKE init done");
	}
	
	function createGameBoard(sizeX, sizeY) {
		gameBoard = new Array(sizeX);
		for (i=0; i < gameBoard.length; ++i) {
			gameBoard[i] = new Array(sizeY);
		}
	}
	
	function createSnake(length) {
		s.snake = new Array();
		for (i=0; i < length; i++) {
			var newSnakePart = new snakePart(GAMEBOARD_XSIZE/2, (GAMEBOARD_XSIZE/2)-i);
			s.snake.push(newSnakePart);
			gameBoard[newSnakePart.posX][newSnakePart.posY] = newSnakePart;
			console.log("snakePart created @" + newSnakePart.posX + "," + newSnakePart.posY);
		}
	}
	
	s.addFood = function(posX,posY) {
		console.log("adding food @", posX, posY);
		if(typeof(gameBoard[posX][posY]) !== "undefined") { 
			console.log("addFood failed! Something (food, snake) already exists at pos", posX, posY, gameBoard[posX][posY]);
			return false;
		}
		else {
			var food = new foodItem(posX, posY);
			gameBoard[posX][posY] = food;
			return food;
		}
	}
	
	s.eatFood = function(posX, posY) {
		if(typeof(gameBoard[posX][posY]) !== "undefined") {
			if(typeof(gameBoard[posX][posY].food) === "boolean") {
				gameBoard[posX][posY] = undefined;
				for(i=0;i < SNAKE.food.length;i++) {
					if(typeof(SNAKE.food[i]) === "object") { 
						if(SNAKE.food[i].posX === posX && SNAKE.food[i].posY === posY) {
							//console.log("food removed from index", i, SNAKE.food[i]);
							SNAKE.food[i] = undefined;
						}
					}
				}
				
				penalty = Math.min(Math.max((new Date() - lastEatTime), 0), 10000);
				console.log(penalty);
				gameScore += 10000 - penalty;

				lastEatTime = new Date();
				updateGameScore();
				initFoods(1);
				AUDIO.play("audioEat");
				//Draw food
				for (i=0; i < SNAKE.food.length; ++i) {
					GRAPHICS.drawBox(SNAKE.food[i].posX,SNAKE.food[i].posY, "blue");
				}
				//console.log("food eaten @", posX, posY);
			}
			else {
				console.log("WTF: Trying to eat food at empty or snake pos?");
			}
		}
	}
	
	function initFoods(items) {
		s.food = new Array();
		for(i=0;i < items;i++) {
			var randPosX = Math.round(Math.random()*(GAMEBOARD_XSIZE-2));
			var randPosY = Math.round(Math.random()*(GAMEBOARD_XSIZE-2));
			s.food.push(s.addFood(randPosX, randPosY));
		}
	}
	
	s.getGameboardSize = function() {
		return {
			xSize: GAMEBOARD_XSIZE,
			ySize: GAMEBOARD_YSIZE
		}
	}
	
	function initKeyboard() {
		//Keyboard handling
		$(document).unbind("keydown");
		$(document).keydown(function(event) {
			switch(event.keyCode) {
				case KEYCODE_UP:
					if(!gamePaused && s.currentHeading !== s.headings.south && !snakeIsUpdating) {
						snakeIsUpdating = true;
						s.currentHeading = s.headings.north;
					}
					break;
				case KEYCODE_DOWN:
					if(!gamePaused && s.currentHeading !== s.headings.north && !snakeIsUpdating) {
						snakeIsUpdating = true;
						s.currentHeading = s.headings.south;
					}
					break;
				case KEYCODE_LEFT:
					if(!gamePaused && s.currentHeading !== s.headings.west && !snakeIsUpdating) {
						snakeIsUpdating = true;
						s.currentHeading = s.headings.east;
					}
					break;	
				case KEYCODE_RIGHT:
					if(!gamePaused && s.currentHeading !== s.headings.east && !snakeIsUpdating) {
						snakeIsUpdating = true;
						s.currentHeading = s.headings.west;
					}
					break;					
				case KEYCODE_R:
					console.log("R PRESSED");
					s.restart();
					break;	
				case KEYCODE_SPACE:
					console.log("SPACE PRESSED");
					if(gamePaused) {
						s.play();
					}else {
						s.pause();
					}
					break;
				case KEYCODE_ENTER:
					console.log("ENTER PRESSED");
					if(gamePaused) {
						s.play();
					}else {
						s.pause();
					}
					break;	
				case KEYCODE_P:
					console.log("P PRESSED");
					if(gamePaused) {
						s.play();
					}else {
						s.pause();
					}
					break;
			}
		});
	}
	
	s.play = function() {
		console.log("PLAY");
		s.gameTimer = setInterval(function() {
			updateSnakePosition();
		}, GAME_SPEED);
		gamePaused = false;
	}
	
	s.pause = function() {
		console.log("PAUSE");
		clearInterval(s.gameTimer);
		gamePaused = true;
	};
	
	s.restart = function() {
		console.log("RESTART");
		s.init();
		GRAPHICS.init();
	}
	
	function gameOver() {
		AUDIO.play("gameOver");
		GRAPHICS.drawEndScreen("black", gameScore);
		s.pause();
		alert("GAME OVER - SCORE:" + gameScore);
		s.restart();
	}
	
	function updateSnakePosition() {
		snakeIsUpdating = true;
		var currentHead = SNAKE.snake[SNAKE.snake.length-1];

		if(
			//Wall collision
			currentHead.posX+1 === SNAKE.getGameboardSize().xSize ||
			currentHead.posY+1 === SNAKE.getGameboardSize().ySize ||
			currentHead.posX === 0 ||
			currentHead.posY === 0) {
			
			gameOver();
		}
		else {
			//Wall not hit, check if snake itself or food is it
			var destinationPosX = currentHead.posX + s.currentHeading[0];
			var destinationPosY = currentHead.posY + s.currentHeading[1];

			if(typeof(gameBoard[destinationPosX][destinationPosY]) !== "undefined") {
				if(typeof(gameBoard[destinationPosX][destinationPosY].snake) === "boolean") {
					gameOver();
				}
				else if(typeof(gameBoard[destinationPosX][destinationPosY].food) === "boolean") {
					s.eatFood(destinationPosX, destinationPosY);
					var newSnakeHead = new snakePart(0,0);
				}
			}
			
			else {
				var newSnakeHead = SNAKE.snake.shift();
				GRAPHICS.clearBox(newSnakeHead.posX, newSnakeHead.posY); //Remove tail graphically
				gameBoard[newSnakeHead.posX][newSnakeHead.posY] = undefined; //Clear tail from gameBoard
			}

			newSnakeHead.posX = destinationPosX;
			newSnakeHead.posY = destinationPosY;
			SNAKE.snake.push(newSnakeHead);
			gameBoard[newSnakeHead.posX][newSnakeHead.posY] = newSnakeHead;
			GRAPHICS.drawBox(newSnakeHead.posX, newSnakeHead.posY, "black");
			snakeIsUpdating = false;
		}
	}
	
	function updateGameScore() {
		$(".gameScore").html(gameScore);
	}
	
	return s;
})(SNAKE || {});

var GRAPHICS = (function (g) {
	var g = {};
	g.context;
	g.canvasWidth = 500;
	g.canvasHeight = 500;
	
	g.init = function() {
		if($("#snakeCanvas")[0].getContext) {
			g.context = $("#snakeCanvas")[0].getContext("2d");
			g.clearAll();
			//Initial drawup
			
			//Draw snake
			for (i=0; i < SNAKE.snake.length; ++i) {
				g.drawBox(SNAKE.snake[i].posX,SNAKE.snake[i].posY, "black");
			}
			
			//Draw food
			for (i=0; i < SNAKE.food.length; ++i) {
				g.drawBox(SNAKE.food[i].posX,SNAKE.food[i].posY, "red");
			}
			
			//Draw walls
			g.drawWalls("red");
			
			
			return true;
		}
		else {
			return false;
		}
	};
	
	g.drawWalls = function(fillStyle) {
		g.context.fillStyle = "white";
		//Draw background
		console.log("drawwalls");
		//g.context.fillRect(0, 0, g.canvasWidth, g.canvasHeight);
		//clear center
		g.context.fillStyle = "black";
		//g.context.clearRect(SNAKE.getGameboardSize().xSize, 
		//SNAKE.getGameboardSize().ySize, (g.canvasHeight/SNAKE.getGameboardSize().ySize), 
		//(g.canvasWidth/SNAKE.getGameboardSize().xSize));
		//g.context.fillRect(SNAKE.getGameboardSize().xSize/4, 
		//SNAKE.getGameboardSize().ySize/4, g.canvasWidth-30, g.canvasHeight);
	}
		
	g.drawBox = function(x,y, fillStyle) {
		g.context.fillStyle = fillStyle;
		g.context.fillRect(x*(g.canvasWidth/SNAKE.getGameboardSize().xSize), y*(g.canvasHeight/SNAKE.getGameboardSize().ySize), g.canvasWidth/SNAKE.getGameboardSize().xSize, g.canvasHeight/SNAKE.getGameboardSize().ySize);
		//console.log("drawBox called @ x:",x,"y:", y, " size = ", 
		//(g.canvasWidth/SNAKE.getGameboardSize().xSize), "x", 
		//(g.canvasWidth/SNAKE.getGameboardSize().ySize), "fillStyle 
		//=",g.context.fillStyle);
	}
	
	g.drawEndScreen = function(fillStyle, score) {
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
		g.context.clearRect(x*(g.canvasWidth/SNAKE.getGameboardSize().xSize), y*(g.canvasHeight/SNAKE.getGameboardSize().ySize), g.canvasWidth/SNAKE.getGameboardSize().xSize, g.canvasHeight/SNAKE.getGameboardSize().ySize);
	}
	
	g.clearAll = function() {
		g.context.clearRect(0,0,10000,100000);
	}

	return g;
})(GRAPHICS || {});

var AUDIO = (function(a) {
	var a = {};
	a.play = function(id) {
		$("#" + id)[0].play();
	}
	
	return a;
})(AUDIO || {});

$(document).ready(function() {
	SNAKE.init();
	if(GRAPHICS.init()) {
		console.log("GRAPHICS init ok! yay!");
	}
	else {
		//displayMessage("Your browser does not seem to support HTML5 canvas...");
	}
});
