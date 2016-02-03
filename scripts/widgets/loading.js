module.exports = new (function(){ "use strict";
	var tools = require('../tools/tools.js');
	var $gate = $('.gate');
	var $gateCount = $gate.find('.gate-count .count');
	var $gateBar = $gate.find('.gate-bar');
	var $gateLoader = $gate.find('.loader');
	var tickerQueue = new (require('../tools/ticker-queue.js'))();
	var isAndroidBrowser4_3minus = $('html').hasClass('android-browser-4_3minus');
	this.load = function(callback){
		var urls = [];
		$('*:visible:not(script)').each(function(){
			var $el = $(this);
			var name = $el[0].nodeName.toLowerCase();
			var bImg = $el.css("background-image");
			var src = $el.attr('src');
			var func = $el.data('loading');
			if(func){
				urls.push(func);
			}else if(name === 'img' && src && $.inArray(src, urls) === -1){
				urls.push(src);
			}else if (bImg != 'none'){
				var murl = bImg.match(/url\(['"]?([^'")]*)/i);
				if(murl && murl.length>1 && $.inArray(murl[1], urls) === -1){
					urls.push(murl[1]);
				}
			}
		});
		var loaded = 0;
		if(urls.length === 0){
			callback();
		}else{
			$gateLoader.addClass('show');
			var waterPerc = 0;
			var done = function(){
				loaded++;
				waterPerc = loaded/urls.length * 100;
				$gateBar.css({width: waterPerc+'%'});
				$gateCount.html(Math.ceil(waterPerc));
				if(loaded === urls.length){
					if($gate.length<1 || $gateLoader.length<1){
						callback();
					}else{
						$gateLoader.transitionEnd(function(){
							$gateLoader.removeClass('hided');
							callback();
						}, 200).addClass('hided').removeClass('show');
					}
				}
			}
			for(var i=0; i<urls.length; i++){
				if(typeof(urls[i]) == 'function'){
					urls[i](done);
				}else{
					var img = new Image();
					$(img).one('load', function(){tickerQueue.add(done)});
					img.src = urls[i];
				}
			}
		}
	}
	this.gate = function(callback){
		$gateCount.html('0');
		$gateBar.css({width: '0%'});
		$gate.transitionEnd(function(){
			if(callback){
				callback();
			}
		}).css({opacity: 1, visibility: 'visible'});
	}
	this.ungate = function(callback){
		$gate.transitionEnd(function(){
			if(isAndroidBrowser4_3minus){
				tools.androidStylesFix($('body'));
			}
			if(callback){
				callback();
			}
		}).css({opacity: 0, visibility: 'hidden'});
	};
})();