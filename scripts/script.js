$(function() { new (function(){ 'use strict';
	var Customize = require('./customize/customize.js');
	var TopNav = require('./widgets/top-nav.js');
	var MenuToggle = require('./widgets/menu-toggle.js');
	var Players = require('./animation/players.js');
	var Scrolling = require('./animation/scrolling.js');
	var tools = require('./tools/tools.js');
	var ShowList = require('./widgets/show-list.js');
	var Gallery = require('./widgets/gallery.js');
	var fluid = require('./widgets/fluid.js');
	var Counter = require('./widgets/counter.js');
	var ChangeColors = require('./widgets/change-colors.js');
	var Sliders = require('./widgets/sliders.js');
	var loading = require('./widgets/loading.js');
	var CssAnimation = require('./animation/css-animation.js');
	var dotScroll = require('./widgets/dot-scroll.js');
	var Map = require('./widgets/map.js');
	var Skillbar = require('./widgets/skillbar.js');
	var YoutubeBG = require('./widgets/youtube-bg.js');
	var VimeoBG = require('./widgets/vimeo-bg.js');
	var VideoBG = require('./widgets/video-bg.js');
	var ShowRithm = require('./tools/show-rithm.js');
	var app = require('./app/app.js');
	var OverlayWindow = require('./widgets/overlay-window.js');
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isAndroid43minus = $('html').hasClass('android-browser-4_3minus');
	var $pageTransition = $('.page-transition');

	var me = this;
	var $window = $(window);
	var $sections = $('section');
	var sectionTriggers = [];
	var lastActiveSectionHash;
	var location = document.location.hash ? document.location.href.replace(new RegExp(document.location.hash+'$'),'') : document.location.href.replace('#','');
	var $navLinks = (function(){
		var $res = jQuery();
		$('#top-nav .navbar-nav a').each(function(){
			var $this = $(this);
			if(
				(!this.hash) ||
				(
					(this.href === location+this.hash) &&
					($('section'+this.hash).length > 0)
				)
			){
				$res = $res.add($this);
			}
		});
		return $res;
	})();
	var isMobile = $('html').hasClass('mobile');
	var scrolling;
	var maxScrollPosition;
	var Ticker = function(){
		var me = this;
		//------------------
		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function(/* function */ callback, /* DOMElement */ element){
					window.setTimeout(callback, 1000 / 60);
				};
		})();
		var lastPosition = -1;
		(function animate(){
			var windowTopPos = tools.windowYOffset();
		//------------------
		//var lastPosition = -1;
		//TweenLite.ticker.addEventListener("tick", function (){
		//	var windowTopPos = tools.windowYOffset();
		//------------------
		//var lastPosition = tools.windowYOffset();
		//scrolling.scroll(lastPosition);
		//$window.scroll( function (){
		//	var windowTopPos = tools.windowYOffset();
		//------------------
		//var lastPosition = 0;
		//$window.on("mousewheel DOMMouseScroll", function(event){
		//	event.preventDefault();
		//	var scrollTime = 0.5;
		//	var scrollDistance = 60;
		//	var delta = event.originalEvent.wheelDelta/120 || -event.originalEvent.detail/3;
		//	var windowTopPos = $window.scrollTop() - parseInt(delta*scrollDistance) * 3;
		//	if(windowTopPos<0) windowTopPos = 0;
		//	var tl = new TimelineLite();
		//	//tl.to(window, scrollTime, {scrollTo:{y:windowTopPos}, ease:Power4.easeOut});
		//	//tl.set(window, {scrollTo:{y:windowTopPos}});
		//	window.scrollTo(0, windowTopPos);
		//------------------
			if (lastPosition !== windowTopPos) {
				scrolling.scroll(windowTopPos);
				trigNavigationLinks(windowTopPos);
			}
			lastPosition = windowTopPos;
		//------------------
		//});
		//------------------
			requestAnimFrame(animate);
		})();
		//------------------
	};
	
	this.topNav = undefined;
	this.players = Players;
	this.afterConfigure = function(){
		var hash = window.location.hash;
		if (history && history.replaceState) {
			history.replaceState("", document.title, window.location.pathname + window.location.search);
		}
		new YoutubeBG();
		new VimeoBG();
		new VideoBG();
		app.prepare(function(){
			loading.load(function (){
				$navLinks = $navLinks.add(dotScroll.links()).click(function(){
					$navLinks.removeClass('target');
					$(this).addClass('target');
				});
				me.topNav = new TopNav();
				new MenuToggle();
				scrolling = new Scrolling(me);
				widgets($('body'));
				new Gallery(onBodyHeightResize, widgets, unwidgets);
				var windowW = $window.width();
				var windowH = $window.height();
				$window.resize(function(){
					var newWindowW = $window.width();
					var newWindowH = $window.height();
					if(newWindowW!==windowW || newWindowH!==windowH){ //IE 8 fix
						windowW = newWindowW;
						windowH = newWindowH;
						fluid.setup($('body'));
						onBodyHeightResize();
					}
				});
				app.setup(function(){
					var finish = function(){
						buildSizes();
						calcNavigationLinkTriggers();
						new Ticker();
						$navLinks.each(function(){
							if(this.href==location){
								$(this).addClass('active');
							}
						});
						$('.bigtext').each(function(){
							$(this).bigtext();
						});
						loading.ungate();
						navigate(window.location.href, hash);
					};
					var test = function(){
						var $imgs = $('img');
						for(var i=0; i<$imgs.length; i++){
							if(!$imgs[i].width || !$imgs[i].height){
								setTimeout(test, 100);
								return;
							}
						}
						finish();
					};
					test();
				});
			});
		});
	}
	function onBodyHeightResize(isSlow) {
		buildSizes(isSlow);
		scrolling.scroll(tools.windowYOffset());
		calcNavigationLinkTriggers();
	}
	function widgets($context){
		new ShowList($context, me);
		new Sliders($context);
		if(!isMobile) $context.find('.hover-dir').each( function() { $(this).hoverdir({speed: 300}); } );
		$context.find("a").click(function(e){
			var $this = $(this);
			if($this.data('toggle')) return;
			navigate(this.href, this.hash, e, $this)
		});
		fluid.setup($context);
		new Map($context);
		new Counter($context, me);
		new ChangeColors($context);
		new Skillbar($context, me);
		$context.find("input,select,textarea").not("[type=submit]").jqBootstrapValidation();
		new CssAnimation($context, me);
		$('.widget-tabs a').click(function (e) {
			e.preventDefault()
			$(this).tab('show')
		});
		$('.widget-tooltip').tooltip();
		$('.widget-popover').popover();
		$context.find('video').each(function(){ // IE 9 Fix
			if($(this).attr('muted')!==undefined){
				this.muted=true;
			}
		});
		$context.find('.open-overlay-window').each(function(){
			var $this = $(this);
			var $overlay = $($this.data('overlay-window'));
			var overlayWindow = new OverlayWindow($overlay);
			$this.click(function(e){
				e.preventDefault();
				overlayWindow.show();
			})
		});
		if(isPoorBrowser){
			$context.find('.tlt-loop').remove();
		}else{
			var $tlt = $context.find('.textillate');
			$tlt.textillate(eval('('+$tlt.data('textillate-options')+')'));
		}
	}
	function unwidgets($context){
		new Sliders($context, true);
		$context.find('.player').each(function(){
			var ind = $(this).data('player-ind');
			me.players[ind].pause();
			me.players.splice(ind, 1);
		})
	}
	function navigate(href, hash, e, $elem) {
		var hrefBH = hash ? href.replace(new RegExp(hash+'$'), '') : href;
		if(location === hrefBH && hash && hash.indexOf("!") === -1){
			var $content = $(hash);
			if (e) {
				e.preventDefault();
			}
			if($content.length > 0){
				var offset = $content.offset().top - me.topNav.state2H;
				var tn = $content.get(0).tagName.toLowerCase();
				if(tn === 'h1' || tn === 'h2' || tn === 'h3' || tn === 'h4' || tn === 'h5' || tn === 'h6'){
					offset -= 20;
				}
				if (offset < 0) offset = 0;
				tools.scrollTo(offset);
			}else{
				tools.scrollTo(0);
			}
		}else if(e && (href !== location+'#')){
			if(!$elem.attr('target')){
				var pageTransition = function(){
					e.preventDefault();
					me.topNav.state1();
					loading.gate(function(){
						window.location = href;
					});
				}
				if($elem.hasClass('page-transition')){
					pageTransition();
				}else{
					$pageTransition.each(function(){
						var container = $(this).get(0);
						if($.contains(container, $elem[0])){
							pageTransition();
						}
					});
				}
			}
		}
	}
	function calcNavigationLinkTriggers(){
		var wh = $window.height();
		var triggerDelta = wh/3;
		sectionTriggers = [];
		$sections.each(function(i){
			var $s = $(this);
			var id = $s.attr('id');
			if(id){
				sectionTriggers.push({hash: '#'+id, triggerOffset: $s.data('position')-triggerDelta});
			}
		});
		trigNavigationLinks(tools.windowYOffset());
	}
	function trigNavigationLinks(windowTopPos){
		var activeSectionHash;
		for(var i=0; i<sectionTriggers.length; i++){
			if(sectionTriggers[i].triggerOffset<windowTopPos){
				activeSectionHash = sectionTriggers[i].hash;
			}
		}
		if(activeSectionHash!=lastActiveSectionHash){
			var sectionLink = location + activeSectionHash;
			lastActiveSectionHash = activeSectionHash;
			$navLinks.each(function(){
				var $a = $(this);
				if(this.href === sectionLink){
					$a.addClass('active');
					$a.removeClass('target');
				}else{
					$a.removeClass('active');
				}
			});
			app.changeSection(me, activeSectionHash);
		}
	}
	function buildSizes(isSlow){
		app.buildSizes(me, isSlow);
		maxScrollPosition = $('body').height() - $window.height();
		for(var i=0; i<me.players.length; i++){
			var $v = me.players[i].$view;
			$v.data('position', $v.offset().top);
		}
	}
	var animEnd = function(elems, end, modern, callback, time){
		var additionTime = 100;
		var defaultTime = 1000;
		return elems.each(function() {
			var elem = this;
			if (modern && !isAndroid43minus) {
				var done = false;
				$(elem).bind(end, function() {
					done = true;
					$(elem).unbind(end);
					return callback.call(elem);
				});
				if(time >= 0 || time === undefined){
					var wTime = time === undefined ? 1000 : defaultTime + additionTime;
					setTimeout(function(){
						if(!done){
							$(elem).unbind(end);
							callback.call(elem);
						}
					}, wTime)
				}
			}else{
				callback.call(elem);
			}
		});
	}
	$.fn.animationEnd = function(callback, time) {
		return animEnd(this, tools.animationEnd, Modernizr.cssanimations, callback, time);
	};
	$.fn.transitionEnd = function(callback, time) {
		return animEnd(this, tools.transitionEnd, Modernizr.csstransitions, callback, time);
	};
	$.fn.transition =  function(css, nonTransitionBrowserSec, callback) {
		return this.each(function() {
			var elem = this;
			if(Modernizr.csstransitions){
				if(callback){
					$(elem).transitionEnd(function(){
						callback.call(elem);
					}, nonTransitionBrowserSec * 1000);
				}
				$(elem).css(css);
			}else{
				var tl = new TimelineLite();
				tl.to(elem, nonTransitionBrowserSec, css);
				if(callback){
					tl.add(function(){callback.call(elem);});
				}
			}
		});
	};
	$.fn.stopTransition = function(){
		return this.css({
			'-webkit-transition': 'none',
			'-moz-transition': 'none',
			'-ms-transition': 'none',
			'-o-transition': 'none',
			'transition':  'none'
		});
	}
	$.fn.cleanTransition = function(){
		return this.css({
			'-webkit-transition': '',
			'-moz-transition': '',
			'-ms-transition': '',
			'-o-transition': '',
			'transition':  ''
		});
	}
	$.fn.nonTransition =  function(css) {
		return this.stopTransition().css(css).cleanTransition();
	};
	$.fn.transform =  function(str, origin) {
		return this.css(tools.transformCss(str, origin));
	};
	$('video').each(function(){ // IE 9 Fix
		if($(this).attr('muted')!==undefined){
			this.muted=true;
		}
	});
	new Customize(me);
})();});