//Sound
var AUDIO = (function(a) {
	var a = {};

	a.play = function(id) {
		if($("#" + id).length) {
			$("#" + id)[0].play();
		}
	}

	var playSubscriber = function(msg, data){
		console.log(msg, data);
		a.play(data);
	};

	//Setup subscription for PLAY event
	PubSub.subscribe("PLAY", playSubscriber);

	a.init = function() {
		console.log("AUDIO init done");
	}

	return a;
})(AUDIO || {});
