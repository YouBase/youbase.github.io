module.exports = new (function(){ "use strict";
	var scrollTime = 0.5;
	var scrollDistance = 130;
	$window.on("mousewheel DOMMouseScroll", function(event){		
		event.preventDefault();					
		var delta = event.originalEvent.wheelDelta/120 || -event.originalEvent.detail/3;
		var scrollTop = tools.windowYOffset();
		var finalScroll = scrollTop - parseInt(delta*scrollDistance) * 3;
		var tl = new TimelineLite();
		tl.to(window, scrollTime, {scrollTo:{y:finalScroll}, ease:Power4.easeOut});
	});
})();