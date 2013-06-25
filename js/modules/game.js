//Game
var SNAKE = (function(s) {
	//Public object
	var s = {};
	s.version = "0.2";

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
	var gameIsOver = false;
	var snakeIsUpdating = false;

	//Snake
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
	s.init = function(GRAPHICS) {
		s.graphics = GRAPHICS;

		s.currentHeading = s.headings.north;
		createGameBoard(GAMEBOARD_XSIZE, GAMEBOARD_YSIZE);
		createSnake(INIT_SNAKE_LENGTH);
		initFoods(START_FOOD);
		initKeyboard();
		gameScore = 0;
		lastEatTime = new Date();
		updateGameScore();
		gameIsOver = false;
		s.pause();
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

			PubSub.publish("ADD SNAKE PART", newSnakePart);

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
			PubSub.publish("ADD FOOD", food);
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

				PubSub.publish( "PLAY", "audioEat" );
			}
			else {
				console.error("WTF: Trying to eat food at empty or snake pos?");
				gameOver();
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

	var handleKeyboard = function(event) {
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
	}

	function initKeyboard() {
		//Keyboard handling
		$(document).unbind("keydown");
		var throttledHandleKeyboard = _.throttle(handleKeyboard, 100);
		$(document).keydown(throttledHandleKeyboard);
	}

	s.play = function() {
		console.log("PLAY");
		s.gameTimer = setInterval(function() {
			gameLoop();
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
		PubSub.publish("CLEAR");
		s.init();
	};

	function gameOver() {
		PubSub.publishSync("PLAY", "gameOver");
		gameIsOver = true;
		s.pause();

		PubSub.publishSync("DRAW END SCREEN", {color: "black", score: gameScore});

		alert("GAME OVER - SCORE:" + gameScore);
		s.restart();
	}

	function gameLoop() {
		updateSnakePosition();
		PubSub.publish("GAME TICK")
	}

	function updateSnakePosition() {
		snakeIsUpdating = true;
		var currentHead = SNAKE.snake[SNAKE.snake.length-1];

		var destinationPosX = currentHead.posX + s.currentHeading[0];
		var destinationPosY = currentHead.posY + s.currentHeading[1];

		if(isColliding(
			destinationPosX,
			destinationPosY,
			SNAKE.getGameboardSize().xSize,
			SNAKE.getGameboardSize().ySize
			)) {
			console.log("Collision with wall @", destinationPosX, destinationPosY);
			gameOver();
		}
		else {
			//Wall not hit, check if snake itself or food is next hit
			var newSnakeHead;
			//If game board has something at destination position
			if(typeof(gameBoard[destinationPosX][destinationPosY]) !== "undefined") {
				//Check if destination collides with snake itself
				if(typeof(gameBoard[destinationPosX][destinationPosY].snake) === "boolean") {
					gameOver();
				}
				//Else check if food is at next destination
				else if(typeof(gameBoard[destinationPosX][destinationPosY].food) === "boolean") {
					//Eat food
					s.eatFood(destinationPosX, destinationPosY);
					//Increase length of snake by one part
					newSnakeHead = new snakePart(0,0);
				}
			}
			else {
				//Move head of snake
				newSnakeHead = SNAKE.snake.shift();
				//GRAPHICS.clearBox(newSnakeHead.posX, newSnakeHead.posY); //Remove tail graphically
				PubSub.publishSync("CLEAR SNAKE PART", newSnakeHead);
				gameBoard[newSnakeHead.posX][newSnakeHead.posY] = undefined; //Clear tail from gameBoard
			}

			//Update snake head position
			newSnakeHead.posX = currentHead.posX + s.currentHeading[0];
			newSnakeHead.posY = currentHead.posY + s.currentHeading[1];
			SNAKE.snake.push(newSnakeHead);
			gameBoard[newSnakeHead.posX][newSnakeHead.posY] = newSnakeHead;

			//GRAPHICS.drawBox(newSnakeHead.posX, newSnakeHead.posY, "black");
			PubSub.publish("ADD SNAKE PART", newSnakeHead);
			snakeIsUpdating = false;
		}
	}

	function isColliding(posX, posY, gameBoardXSize, gameBoardYSize) {
		return (
			//Wall collision
			posX === gameBoardXSize ||
			posY === gameBoardYSize ||
			posX === -1 ||
			posY === -1)
	}

	function updateGameScore() {
		$(".gameScore").html(gameScore);
	}

	return s;
})(SNAKE || {});