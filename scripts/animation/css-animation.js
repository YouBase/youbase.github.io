module.exports = function($context, script){ "use strict";
	var isPoorBrowser = $('html').hasClass('poor-browser');
	if(!Modernizr.cssanimations || isPoorBrowser){
		$('.scroll-in-animation').removeClass('scroll-in-animation');
		$('.scroll-animation').removeClass('scroll-animation');
		return;
	}
	$context.find('.scroll-in-animation, .scroll-animation').each(function(){
		var $this = $(this);
		var delay = $this.data('delay');
		var animation = $this.data('animation')+' animated css-animation-show';
		var pause = function(){
			if(delay){
				setTimeout(function(){$this.removeClass(animation);}, delay);
			}else{
				$this.removeClass(animation);
			}
		}
		var resume = function(){
			if(delay){
				setTimeout(function(){$this.addClass(animation);}, delay);
			}else{
				$this.addClass(animation);
			}
		}
		var start = resume;
		script.players.addPlayer($this, start, pause, resume);
	});
};