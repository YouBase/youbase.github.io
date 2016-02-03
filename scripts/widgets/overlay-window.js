module.exports = function($overlay, widgets, unwidgets, hideFunc){ "use strict";
	var $overlayClose = $overlay.find('.cross');
	var $overlayZoom = $($overlay.data('overlay-zoom'));
	var $overlayView = $overlay.find('.overlay-view');
	var $overlayClose = $overlay.find('.cross');
	var me = this;
	this.show = function(load, callback) {
		var open = function() {
			$overlayZoom.addClass('overlay-zoom');
			$overlay.transitionEnd(function(){
				if (load) {
					var $loader = $overlay.find('.loader');
					var $loadedContent = $('<div class="loaded-content"></div>');
					$loader.addClass('show');
					$loadedContent.addClass('content-container').appendTo($overlayView);
					$loadedContent.load(load, function(xhr, statusText, request) {
						if (statusText !== "success" && statusText !== "notmodified") {
							$loadedContent.text(statusText);
							return;
						}
						var $images = $loadedContent.find('img');
						var nimages = $images.length;
						if (nimages > 0) {
							$images.load(function() {
								nimages--;
								if (nimages === 0) {
									show();
								}
							});
						} else {
							show();
						}
						function show() {
							if(widgets){
								widgets($loadedContent);
							}
							$loadedContent.addClass('show');
							$loader.removeClass('show');
							if(callback){
								callback();
							}
						}
					});
				}else{
					if(callback){
						callback();
					}
				}
			}).addClass('show');
		};
		if ($overlay.hasClass('show')) {
			me.hide(open);
		} else {
			open();
		}
	}
	this.hide = function(callback) {
		$overlayZoom.removeClass('overlay-zoom');
		$overlay.removeClass('show');
		setTimeout(function() {
			var $loadedContent = $overlay.find('.loaded-content');
			if($loadedContent.length>0){
				if(unwidgets){
					unwidgets($loadedContent);
				}
				stopIframeBeforeRemove($loadedContent, function() {
					$loadedContent.remove();
					if(hideFunc){
						hideFunc();
					}
					if (callback) {
						callback();
					}
				});
			}else{
				if(hideFunc){
					hideFunc();
				}
				if (callback) {
					callback();
				}
			}
		}, 500);
	}
	function stopIframeBeforeRemove($context, callback) {
		var isDoStop = $('html').hasClass('ie9')
				|| $('html').hasClass('ie10');
		if (isDoStop) {
			$context.find('iframe').attr('src', '');
			setTimeout(function() {
				callback();
			}, 300);
		} else {
			callback();
		}
	}
	$overlayClose.click(function(e){
		e.preventDefault();
		me.hide();
	});
};