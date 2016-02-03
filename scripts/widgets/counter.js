module.exports = function($context, script){ "use strict";
	var isPoorBrowser = $('html').hasClass('poor-browser');
	if(isPoorBrowser) return;
	$context.find('.counter .count').each(function(){
		var $this = $(this);
		var count = parseInt($this.text());
		var tl = new TimelineLite();
		tl.pause();
		tl.fromTo($this[0], 1, {innerHTML: 0}, {innerHTML: count, roundProps: "innerHTML"});
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