module.exports = new (function(){ "use strict";
	var appShare = require('./app-share.js');
	var themes = require('./themes.js');
	var SlideShow = require('../animation/slide-show.js');
	var slideShow = new SlideShow();
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isMobile = $('html').hasClass('mobile');
	var skewH = 60;
	var $topNav = $('#top-nav');
	var state1Colors = $topNav.data('state1-colors');
	var state2Colors = $topNav.data('state2-colors');
	var $body = $('body');
	this.prepare = function(callback){
		if(window.location.protocol === 'file:' && !$('body').hasClass('example-page') && window.location.href.indexOf('help.html') < 0){
			$('<div class="file-protocol-alert alert colors-c background-80 heading fade in">	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button> Upload files to web server and open template from web server. If template is opened from local file system, some links, functions and examples may work incorrectly.</div>')
					.appendTo('body');
		}
		if(appShare.force3D === true){
			$('html').addClass('force3d');
		}
		if(isPoorBrowser || isMobile){
			var $bodyBg = $('body>.bg');
			$bodyBg.each(function(i){
				if(i === ($bodyBg.length - 1)){
					$(this).css('display', 'block');
				}else{
					$(this).remove();
				}
			});
			$('.view').each(function(){
				var $viewBg = $(this).children('.bg');
				$viewBg.each(function(i){
					if(i === ($viewBg.length - 1)){
						$(this).css('display', 'block');
					}else{
						$(this).remove();
					}
				});
			});
		}
		if(isMobile){
			var $bodyImg = $('body>img.bg');
			var $defImgSet = $bodyImg.length>0 ? $bodyImg : $('.view>img.bg');
			if($defImgSet.length > 0){
				var $defImg = $($defImgSet[0]);
				$('.view').each(function(){
					var $sec = $(this);
					var $bg = $sec.children('img.bg');
					if($bg.length<1){
						$defImg.clone().prependTo($sec);
					}
				});
			}
			$('body>img.bg').remove();
		}
		callback();
	};
	this.setup = function(callback){
		var $views = $('.view');
		var goodColor = function($el){
			var bg = $el.css('background-color');
			return (
					bg.match(/#/i) ||
					bg.match(/rgb\(/i) ||
					bg.match(/rgba.*,0\)/i)
			);
		};
		$('.view.section-header').each(function(){
			var $this = $(this);
			var $next = $this.nextAll('.view').first().children('.content');
			if($next.length>0 && goodColor($next)){
				$this.children('.content').addClass('skew-bottom-right');
			}
		});
		$('.view.section-footer').each(function(){
			var $this = $(this);
			var $prev = $this.prevAll('.view').first().children('.content');
			if($prev.length>0 && goodColor($prev)){
				$this.children('.content').addClass('skew-top-right');
			}
		});
		$views.find('.content').filter('.skew-top-right, .skew-top-left, .skew-bottom-left, .skew-bottom-right').each(function(){
			var $content = $(this);
			var $view = $content.parent();
			if($content.hasClass('skew-top-right') || $content.hasClass('skew-top-left')){
				var $prev = $view.prevAll('.view').first().children('.content');
				if($prev.length>0 && goodColor($prev)){
					var type = $content.hasClass('skew-top-right') ? 1 : 2;
					$('<div class="skew skew-top-'+(type === 1 ? 'right' : 'left')+'"></div>').appendTo($content).css({
						position: "absolute",
						top: "0px",
						width: "0px",
						height: "0px",
						"border-top-width": type === 2 ? (skewH+"px") : "0px",
						"border-right-width": "2880px",
						"border-bottom-width": type === 1 ? (skewH+"px") : "0px",
						"border-left-width": "0px",
						"border-style": "solid solid solid dashed",
						"border-bottom-color": "transparent",
						"border-left-color":  "transparent"
					}).addClass(getColorClass($prev));
				}
			}
			if($content.hasClass('skew-bottom-left') || $content.hasClass('skew-bottom-right')){
				var $next = $view.nextAll('.view').first().children('.content');
				if($next.length>0 && goodColor($next)){
					var type = $content.hasClass('skew-bottom-left') ? 1 : 2;
					$('<div class="skew skew-bottom-'+(type === 1 ? 'left' : 'right')+'"></div>').appendTo($content).css({
						position: "absolute",
						bottom: "0px",
						width: "0px",
						height: "0px",
						"border-top-width": type === 1 ? (skewH+"px") : "0px",
						"border-right-width": "0px",
						"border-bottom-width": type === 2 ? (skewH+"px") : "0px",
						"border-left-width": "2880px",
						"border-style": "solid dashed solid solid",
						"border-top-color": "transparent",
						"border-right-color": "transparent"
					}).addClass(getColorClass($next));
				}
			}
		});
		callback();
		function getColorClass($el){
			for(var i=0; i<themes.colors; i++){
				var colorClass = 'colors-'+String.fromCharCode(65+i).toLowerCase();
				if($el.hasClass(colorClass)){
					return colorClass;
				}
			}
		}
	};
	this.buildSizes = function(script, isSlow){
		var $views = $('.view');
		var $window = $(window);
		var wh = $window.height();
		var ww = $window.width();
		var $tnav = $('#top-nav:visible');
		var sh = wh;
		var $bbord = $('.page-border.bottom:visible');
		var borderH = $bbord.length > 0 ? $bbord.height() : 0;
		$('.full-size, .half-size, .one-third-size').each(function() {
			var $this = $(this);
			var minPaddingTop = parseInt($this.css({
				'padding-top': '',
			}).css('padding-top').replace('px', ''));
			var minPaddingBottom = parseInt($this.css({
				'padding-bottom': '',
			}).css('padding-bottom').replace('px', ''));
			var minFullH = sh - ($bbord.length > 0 ? borderH : 0);
			var minHalfH = Math.ceil(minFullH / 2);
			var min13H = Math.ceil(minFullH / 3);
			var min = $this.hasClass('full-size') ? minFullH : ($this.hasClass('half-size') ? minHalfH : min13H);
			$this.css({
				'padding-top': minPaddingTop + 'px',
				'padding-bottom': minPaddingBottom + 'px'
			});
			if($this.hasClass('stretch-height') || $this.hasClass('stretch-full-height')){
				$this.css({height: ''});
			}
			var thisH = $this.height();
			if (thisH < min) {
				var delta = min - thisH - minPaddingTop - minPaddingBottom;
				if(delta<0){
					delta=0;
				}
				var topPlus = Math.round(delta / 2);
				var bottomPlus = delta - topPlus;
				var newPaddingTop = minPaddingTop + topPlus;
				var newPaddingBottom = minPaddingBottom + bottomPlus;
				$this.css({
					'padding-top': newPaddingTop + 'px',
					'padding-bottom': newPaddingBottom + 'px'
				});
			}
		});
		$('.stretch-height').each(function(){
			var $this = $(this);
			var $par = $this.parent();
			var $strs = $par.find('.stretch-height');
			$strs.css('height', '');
			if($this.outerWidth()<$par.innerWidth()){
				$strs.css('height', $par.innerHeight()+'px');
			}
		});
		$('.stretch-full-height').each(function(){
			var $this = $(this);
			var $par = $this.parent();
			var $strs = $par.find('.stretch-full-height');
			$strs.css('height', '');
			if($this.outerWidth()<$par.innerWidth()){
				var parH = $par.innerHeight();
				var strsH = wh < parH ? parH : wh;
				$strs.css('height', strsH+'px');
			}
		});
		$views.each(function(i){
			var $view = $(this);
			var $content = $view.find('.content');
			var $skewTop = $content.find('.skew.skew-top-right, .skew.skew-top-left');
			var $skewBottom = $content.find('.skew.skew-bottom-left, .skew.skew-bottom-right');
			var contentWPx = $content.width()+"px";
			$skewBottom.css({
				"border-left-width": contentWPx
			});
			$skewTop.css({
				"border-right-width": contentWPx
			});
			var viewH = $view.height();
			var viewW = $view.width();
			var targetH = (function(){
				var viewOffset1 = -1 * viewH;
				var viewOffset2 = 0;
				var viewOffset3 = wh - viewH;
				var viewOffset4 = wh;
				var marg1 = appShare.parallaxMargin(script, i, viewOffset1);
				var marg2 = appShare.parallaxMargin(script, i, viewOffset2);
				var marg3 = appShare.parallaxMargin(script, i, viewOffset3);
				var marg4 = appShare.parallaxMargin(script, i, viewOffset4);
				var topDelta = function(viewOffset, marg){
					return marg + (viewOffset > 0 ? 0 : viewOffset);
				};
				var bottomDelta = function(viewOffset, marg){
					var bottomOffset = viewOffset + viewH;
					return -marg - (bottomOffset < wh ? 0 : bottomOffset - wh);
				};
				var delta = 0;
				var curDelta;
				curDelta = topDelta(viewOffset1, marg1); if(curDelta > delta) delta = curDelta;
				curDelta = topDelta(viewOffset2, marg2); if(curDelta > delta) delta = curDelta;
				curDelta = topDelta(viewOffset3, marg3); if(curDelta > delta) delta = curDelta;
				curDelta = topDelta(viewOffset4, marg4); if(curDelta > delta) delta = curDelta;
				curDelta = bottomDelta(viewOffset1, marg1); if(curDelta > delta) delta = curDelta;
				curDelta = bottomDelta(viewOffset2, marg2); if(curDelta > delta) delta = curDelta;
				curDelta = bottomDelta(viewOffset3, marg3); if(curDelta > delta) delta = curDelta;
				curDelta = bottomDelta(viewOffset4, marg4); if(curDelta > delta) delta = curDelta;
				return viewH + (2 * delta);
			})();
			$view.children('img.bg').each(function(){ 
				bgSize($(this), targetH, viewW, viewH);
			});
			$view.data('position', $view.offset().top);
		});
		$('section').each(function(){
			var $this = $(this);
			$this.data('position', $this.offset().top);
		});
		$('body').children('img.bg').each(function(){ 
			bgSize($(this), wh, ww, wh);
		});
		$('body, .view').each(function(){
			var $bg = $(this).children('.bg');
			if($bg.length > 1) slideShow.run($bg);
		});
		function bgSize($bg, targetH, viewW, viewH){
			var nat = natSize($bg);
			var scale = (viewW/targetH > nat.w/nat.h) ? viewW / nat.w : targetH / nat.h;
			var newW = nat.w * scale;
			var newH = nat.h * scale;
			var zoomXDelta = (nat.w - newW)/2;
			var zoomYDelta = (nat.h - newH)/2;
			var x = Math.round((viewW - newW)/2 - zoomXDelta);
			var y = Math.round((viewH - newH)/2 - zoomYDelta);
			var newCss = {
				scale: scale,
				x: x,
				y: y
			};
			$bg.data('normal-scale', scale).data('normal-x', x).data('normal-y', y);
			newCss.force3D = appShare.force3D;
			if(isSlow && !isPoorBrowser){
				newCss.ease = Power1.easeInOut;
				TweenLite.to($bg, 2, newCss);
			}else{
				TweenLite.set($bg, newCss);
			}
		}
	};
	this.changeSection = function(script, sectionHash){
	};
	function natSize($bg){
		var elem = $bg.get(0);
		var natW, natH;
		if(elem.tagName.toLowerCase() === 'img'){
			natW = elem.width;
			natH = elem.height;
		}else if(elem.naturalWidth){
			natW = elem.naturalWidth;
			natH = elem.naturalHeight;
		}else{
			var orig = $bg.width();
			$bg.css({width: '', height: ''});
			natW = $bg.width();
			natH = $bg.height();
			$bg.css({width: orig});
		}
		return {w: natW, h: natH};
	}
})();