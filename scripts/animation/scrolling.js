module.exports = function(script){ "use strict";
	var me = this;
	var tools = require('../tools/tools.js');
	var ScrollAnimation = require('../app/scroll-animation.js');
	var $window = $(window);
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var scrollAnimation = new ScrollAnimation(me, script);
	this.windowTopPos = undefined;
	this.windowBottomPos = undefined;
	this.windowH = undefined;
	this.scroll = function(windowTopP){
		me.windowH = $window.height();
		me.windowTopPos = windowTopP
		me.windowBottomPos = windowTopP+me.windowH;
		if(me.windowTopPos < script.topNav.state1Top()){
			script.topNav.state1();
		}else{
			script.topNav.state2();
		}
		scrollAnimation.scroll()
		for(var i=0; i<script.players.length; i++){
			var viewPos = me.calcPosition(script.players[i].$view);
			if(viewPos.visible){
				script.players[i].play();
			}else{
				script.players[i].pause();
			}
		}
	}
	this.calcPosition = function ($block){
		var blockH = $block.height();
		var blockTopPos = $block.data('position');
		var blockBottomPos = blockTopPos + blockH;
		return {
			top: blockTopPos,
			bottom: blockBottomPos,
			height: blockH,
			visible: blockTopPos<me.windowBottomPos && blockBottomPos>me.windowTopPos
		};
	}
};