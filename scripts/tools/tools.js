module.exports = new (function(){ "use strict";
	var me = this;
	var script = require('../script.js');
	var isAndroidBrowser4_3minus = $('html').hasClass('android-browser-4_3minus');
	this.animationEnd = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';
	this.transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';
	this.transition = ['-webkit-transition', '-moz-transition', '-ms-transition', '-o-transition', 'transition'];
	this.transform = ["-webkit-transform", "-moz-transform", "-ms-transform", "-o-transform", "transform"];
	this.property = function(keys, value, obj){
		var res = obj ? obj : {};
		for(var i=0; i<keys.length; i++){
			res[keys[i]]=value;
		}
		return res;
	}
	this.windowYOffset = function(){
		return window.pageYOffset != null ? window.pageYOffset : (document.compatMode === "CSS1Compat" ? document.documentElement.scrollTop : document.body.scrollTop);
	}
	this.getUrlParameter = function(sParam){
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				return decodeURI(sParameterName[1]);
			}
		}
	}
	this.selectTextarea = function($el){
		$el.focus(function() {
			var $this = $(this);
			$this.select();
			// Work around Chrome's little problem
			$this.mouseup(function() {
				// Prevent further mouseup intervention
				$this.unbind("mouseup");
				return false;
			});
		});
	}
	var timer;
	this.time = function(label){
		if(!timer){
			timer = Date.now();
			console.log('==== Timer started'+(label ? ' | '+label : ''))
		}else{
			var t = Date.now();
			console.log('==== '+(t-timer)+' ms'+(label ? ' | '+label : ''));
			timer = t;
		}
	}
	this.scrollTo = function(y, callback, time){
		if(time === undefined) time = 1.2;
		var tl = new TimelineLite();
		tl.to(window, time, {scrollTo:{y:y, autoKill:false}, ease:Power2.easeInOut});
		if(callback){
			tl.add(callback);
		}
	}
	this.androidStylesFix = function($q){
		if(isAndroidBrowser4_3minus){
			$q.hide();
			$q.get(0).offsetHeight;
			$q.show();
		}
	}
	this.transformCss = function(str, origin){
		var res = {
			'-webkit-transform': str,
			'-moz-transform': str,
			'-ms-transform': str,
			'-o-transform': str,
			'transform':  str
		};
		if(origin){
			res['-webkit-transform-origin'] = origin;
			res['-moz-transform-origin'] = origin;
			res['-ms-transform-origin'] = origin;
			res['-o-transform-origin'] = origin;
			res['transform-origin'] = origin;
		}
		return res;
	}
})();