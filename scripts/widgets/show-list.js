module.exports = function($context, script){ 'use strict';
	var tools = require('../tools/tools.js');
	var appShare = require('../app/app-share.js');
	var isPoorBrowser = $('html').hasClass('poor-browser');
	$context.find('.show-list').each(function(){
		var $showList = $(this);
		var $showItems = $showList.find('.show-item');
		var resize = function(){
			var listH = 0;
			$showItems.each(function(){
				var $showItem = $(this);
				var itemH = $showItem.height();
				if (itemH > listH){
					$showList.height(itemH);
					listH = itemH;
				}
			});
		}
		$(window).resize(resize);
		resize();
		if(isPoorBrowser){
			$showItems.hide();
			$showItems.first().css({opacity:1}).show();
			return;
		}
		if(Modernizr.cssanimations){
			$showItems.css({display: 'none'});
			var cursor = 0;
			var paused = true;
			var showed = undefined;
			var start = function(){
				paused = false;
				if(cursor !== showed){
					showed = cursor;
					var $item = $($showItems[showed]);
					$item.removeClass('hide-animation').css({display: 'block'}).addClass('show-animation');
					$item.one(tools.animationEnd, function(){
							$item.removeClass('show-animation').addClass('hide-animation');
							cursor = cursor === ($showItems.length-1) ? 0 : cursor+1;
							if(!paused) start();
					});
				}
			}
			var resume = start;
			var pause = function(){
				paused = true;
			}
			script.players.addPlayer($showList, start, pause, resume);
		}else{
			var tl = new TimelineLite();
			tl.pause();
			$showItems.each(function(i){
				var $showItem = $(this);
				tl.fromTo($showItem, 5, {opacity:0, x:"+=-150"}, {force3D: appShare.force3D, opacity:0.7, x:0, ease:Power2.easeOut}, 7*i);
				tl.to($showItem, 2, {force3D: appShare.force3D, opacity:1, /*scaleX: 1.1, scaleY:1.1, */ease:Power2.easeInOut});
				tl.to($showItem, 5, {force3D: appShare.force3D, opacity:0, y:"+=100", rotation:20, ease:Power2.easeOut});
			});
			tl.add(function(){tl.restart()});
			var pause = function(){
				tl.pause();
			}
			var resume = function(){
				tl.resume();
			}
			var start = resume;
			script.players.addPlayer($showList, start, pause, resume);
		}
	});
};