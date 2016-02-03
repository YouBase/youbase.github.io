module.exports = function(){ "use strict";
	var $youtubeBgs = $(".youtube-bg");
	if($('html').hasClass('mobile')){
		$youtubeBgs.each(function(){
			var $youtubeBg = $(this);
			var alt = $youtubeBg.data('alternative');
			if(alt){
				var $img = $('<img alt class="bg" src="'+alt+'"/>');
				$youtubeBg.after($img).remove();
			}
		});
		return;
	}
	var dones = [];
	$youtubeBgs.each(function(i){
		var $youtubeBg = $(this);
		var elId = $youtubeBg.attr('id');
		if(!elId) {
			elId = 'youtube-bg-'+i;
			$youtubeBg.attr('id', elId);
		}
		$youtubeBg.data('loading', function(done){
			dones[elId] = done;
		});
	});
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	window.onYouTubeIframeAPIReady = function(){
		$youtubeBgs.each(function(){
			var $youtubeBg = $(this);
			var videoId = $youtubeBg.data('video');
			var vol = $youtubeBg.data('volume');
			var mute = $youtubeBg.data('mute');
			var elId = $youtubeBg.attr('id');
			var isNotDone = true;
			var player = new YT.Player(elId, {
				videoId: videoId,
				playerVars: { controls: 0, 'showinfo': 0, 'modestbranding': 1, 'rel': 0, 'allowfullscreen': true, 'iv_load_policy': 3, wmode: 'transparent' },
				events: {
					onReady: function(event){
						var resize = function(){
							var $iFrame = $(event.target.getIframe());
							var windowW = $(window).width();
							var windowH = $(window).height();
							var iFrameW = $iFrame.width();
							var iFrameH = $iFrame.height();
							var ifRatio = iFrameW/iFrameH;
							var wRatio = windowW/windowH;
							var vRatio = (function(){
								var r = $youtubeBg.data('ratio');
								return r === undefined ? ifRatio : eval(r);
							})(); 
							var setSize = function(vw, vh){
								var ifw, ifh;
								if(ifRatio > vRatio){
									ifh = Math.ceil(vh);
									ifw = Math.ceil(ifh * ifRatio);
								}else{
									ifw = Math.ceil(vw);
									ifh = Math.ceil(ifw / ifRatio);
								}
								$iFrame.css({
									width:  ifw+'px',
									height: ifh+'px',
									top: Math.round((windowH - ifh)/2)+'px',
									left: Math.round((windowW - ifw)/2)+'px',
								});
							}
							if(wRatio > vRatio){
								var vw = windowW;
								var vh = vw/vRatio;
								setSize(vw, vh);
							}else{
								var vh = windowH;
								var vw = vh * vRatio;
								setSize(vw, vh);
							}
						};
						$(window).resize(resize);
						resize();
						event.target.setPlaybackQuality('highres');
						if(vol !== undefined) event.target.setVolume(vol);
						if(mute === 'yes' || mute === undefined) event.target.mute();
						event.target.playVideo();
					},
					onStateChange: function(event){
						if(isNotDone && event.data === YT.PlayerState.PLAYING){
							isNotDone = false;
							(dones[elId])();
						}else if(event.data === YT.PlayerState.ENDED){
							event.target.playVideo();
						}
					}
				}
			});
		});	
	};
};