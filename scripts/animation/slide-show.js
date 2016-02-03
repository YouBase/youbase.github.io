module.exports = function(){ "use strict";
	var appShare = require('../app/app-share.js');
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var fadeTime = 4;
	var moveTime = 12;
	var st0 = {scale: 1};
	var st1 = {scale: 1.15};
	var rules = [
		[st0, st1],
		[st1, st0],
	];
	var lastRule = rules.length -1;
	var fadeEase = Power4.easeInOut;
	var moveEase = Linear.easeNone;
	this.run = function($slides) {
		var lastI = $slides.length - 1;
		if (isPoorBrowser) {
			return;
		} else {
			$slides.each(function(){
				var $slide = $(this).css({opacity: ''});
				var oldTl = $slide.data('time-line');
				if(oldTl){
					oldTl.kill();
				}
			})
			show(lastI, true);
		}
		function show(i, isFirstRun) {
			var slide = $slides.get(i);
			var $slide = $(slide);
			var tl = new TimelineLite();
			$slide.data('time-line', tl);
			var dataRi = $slide.data('rule-index');
			var ri = dataRi ? dataRi : Math.round(Math.random() * lastRule);
			$slide.data('rule-index', ri);
			var normalScale = $slide.data('normal-scale');
			var state0 = {'scale': rules[ri][0]['scale'] * normalScale};
			var state1 = {'scale': rules[ri][1]['scale'] * normalScale};
			state1.ease = moveEase;
			state1.force3D = appShare.force3D;
			tl.set(slide, state0);
			if (i === lastI && !isFirstRun) {
				tl.to(slide, fadeTime, {opacity: 1, ease: fadeEase});
				tl.set($slides, {opacity: 1});
			}
			tl.to(slide, moveTime, state1, 0);
			tl.add(function(){
				$slide.data('rule-index', null);
			});
			if (i > 0) {
				tl.add(function() {
					show(i - 1);
				}, '-=' + fadeTime + '');
				tl.to(slide, fadeTime, {opacity: 0, ease: fadeEase}, '-=' + fadeTime + '');
			} else {
				tl.add(function() {
					show(lastI);
				}, '-=' + fadeTime + '');
			}
		}
	}
};