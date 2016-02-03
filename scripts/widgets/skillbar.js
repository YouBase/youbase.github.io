module.exports = function($context, script){ "use strict";
	$context.find('.skillbar').each(function(){
		var $this = $(this)
		var $bar = $this.find('.skillbar-bar');
		var tl = new TimelineLite();
		tl.pause();
		tl.fromTo($bar, 1, {width: 0}, {width: $this.attr('data-percent')});
		var pause = function(){
			tl.pause();
		}
		var resume = function(){
			tl.restart();
			tl.resume();
		}
		var start = resume;
		script.players.addPlayer($this, start, pause, resume);
	});
};