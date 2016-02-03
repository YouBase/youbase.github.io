module.exports = function(scrolling, script){ "use strict";
	var appShare = require('../app/app-share.js');
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var me = this;
	var $views = $('.view');
	var tools = require('../tools/tools.js');
	var appShare = require('./app-share.js');
	this.scroll = function(){
		$views.each(function(i){
			var $view = $(this);
			var viewPos = scrolling.calcPosition($view);
			if(viewPos.visible){
				var viewOffset = viewPos.top - scrolling.windowTopPos;
				$view.children('.bg:not(.static)').each(function(){
					var bg = this;
					var $bg = $(this);
					if(appShare.force3D === "auto"){
						$(this).removeClass('sleep');
					}
					TweenLite.set(bg, {force3D: appShare.force3D, y: $bg.data('normal-y')+appShare.parallaxMargin(script, i, viewOffset)});
				});
			}else{
				if(appShare.force3D === "auto"){
					$view.children('.bg:not(.static)').addClass('sleep');
				}
			}
		});
	};
};