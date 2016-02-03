var players=[];
players.addPlayer = function($view, startFunc, pauseFunc, resumeFunc){
	players.push(
		new (function(){
			var played = false;
			var started = false;
			this.$view = $view;
			$view.addClass('player').data('player-ind', players.length);
			this.play = function(){
				if(!played){
					played = true;
					if(!started){
						started = true;
						startFunc();
					}else{
						resumeFunc();
					}
				}
			};
			this.pause = function(){
				if(played){
					played = false;
					pauseFunc();
				}
			};
		})()
	);
};
module.exports = players;