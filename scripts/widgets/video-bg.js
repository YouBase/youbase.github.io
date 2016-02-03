module.exports = function(){ "use strict";
	var $videoBgs = $(".video-bg");
	var isPlayVideo = (function(){
		var isMobile = $('html').hasClass('mobile');
		var v=document.createElement('video');
		var canMP4 = v.canPlayType ? v.canPlayType('video/mp4') : false;
		return canMP4 && !isMobile;
	})();
	if( !isPlayVideo ){
		$videoBgs.each(function(){
			var $videoBg = $(this);
			var alt = $videoBg.data('alternative');
			if(alt){
				var $img = $('<img alt class="bg" src="'+alt+'"/>');
				$videoBg.after($img).remove();
			}
		});
		return;
	}
	$videoBgs.each(function(){
		var $divBg = $(this);
		$divBg.data('loading', function(done){
			var $videoBg = $('<video class="video-bg"></video>');
			if($divBg.data('mute')==='yes') $videoBg[0].muted = true;
			var vol = $divBg.data('volume');
			if(vol !== undefined) $videoBg[0].volume= vol/100;
			var doDone = function(){
				var vw = $videoBg.width();
				var vh = $videoBg.height();
				var vr = vw/vh;
				var $window = $(window);
				var resize = function(){
					var ww = $window.width();
					var wh = $window.height();
					var wr = ww/wh;
					var w, h;
					if(vr > wr){
						h = Math.ceil(wh);
						w = Math.ceil(h * vr);
					}else{
						w = Math.ceil(ww);
						h = Math.ceil(w / vr);
					}
					$videoBg.css({
						width:  w+'px',
						height: h+'px',
						top: Math.round((wh - h)/2)+'px',
						left: Math.round((ww - w)/2)+'px'
					});
				};
				$window.resize(resize);
				resize();
				$videoBg[0].play();
				done();
			};
			$videoBg.on('ended', function(){
				this.currentTime = 0;
				this.play();
				if(this.ended) {
					this.load();
				}
			});
			var isNotDone = true;
			$videoBg.on('canplaythrough', function(){
				if(isNotDone){
					isNotDone = false;
					doDone();
				}else{
					this.play();
				}
			});
			$videoBg[0].src = $divBg.data('video');
			$videoBg[0].preload="auto";
			$divBg.after($videoBg);
			$divBg.remove();
		});
	});
};