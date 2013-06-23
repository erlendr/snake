$(document).ready(function() {
	AUDIO.init();
	SNAKE.init(GRAPHICS);
	if(GRAPHICS.init(SNAKE)) {
		console.log("GRAPHICS init ok! yay!");
	}
	else {
		//displayMessage("Your browser does not seem to support HTML5 canvas...");
	}
});
