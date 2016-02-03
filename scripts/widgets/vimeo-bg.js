module.exports = function(){ "use strict";
	var $vimeoBgs = $(".vimeo-bg");
	if($('html').hasClass('mobile')){
		$vimeoBgs.each(function(){
			var $vimeoBg = $(this);
			var alt = $vimeoBg.data('alternative');
			if(alt){
				var $img = $('<img alt class="bg" src="'+alt+'"/>');
				$vimeoBg.after($img).remove();
			}
		});
		return;
	}
	var dones = [];
	$vimeoBgs.each(function(i){
		var $vimeoBg = $(this);
		var elId = $vimeoBg.attr('id');
		if(!elId) {
			elId = 'vimeo-bg-'+i;
			$vimeoBg.attr('id', elId);
		}
		$vimeoBg.data('loading', function(done){
			dones[elId] = done;
		});
	});
	$.getScript( "https://f.vimeocdn.com/js/froogaloop2.min.js" )
		.done(function( script, textStatus ) {
			$vimeoBgs.each(function(){
				var $vimeoBgDiv = $(this);
				var id = $vimeoBgDiv.attr('id');
				var volume = (function(){
					var r = $vimeoBgDiv.data('volume');
					return r === undefined ? 0 : r;
				})();
				var videoId = $vimeoBgDiv.data('video');
				var $vimeoBg = $('<iframe class="vimeo-bg" src="https://player.vimeo.com/video/'+videoId+'?api=1&badge=0&byline=0&portrait=0&title=0&autopause=0&player_id='+id+'&amp;loop=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
				$vimeoBgDiv.after($vimeoBg);
				$vimeoBgDiv.remove();
				$vimeoBg.attr('id', id);
				var player = $f($vimeoBg[0]);
				player.addEvent('ready', function() {
					var resize = function(vRatio){
						var windowW = $(window).width();
						var windowH = $(window).height();
						var iFrameW = $vimeoBg.width();
						var iFrameH = $vimeoBg.height();
						var ifRatio = iFrameW/iFrameH;
						var wRatio = windowW/windowH;
						//var vRatio = ratio === undefined ? ifRatio : eval(ratio);
						var setSize = function(vw, vh){
							var ifw, ifh;
							if(ifRatio > vRatio){
								ifh = Math.ceil(vh);
								ifw = Math.ceil(ifh * ifRatio);
							}else{
								ifw = Math.ceil(vw);
								ifh = Math.ceil(ifw / ifRatio);
							}
							$vimeoBg.css({
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
					player.addEvent('finish', function(){
						player.api('play');
					});
					var isNotDone = true;
					player.addEvent('play', function(){
						if(isNotDone){
							isNotDone = false;
							dones[id]();
						}
					});
					player.api('setVolume', volume);
					player.api('getVideoWidth', function (value, player_id) {
						var w = value
						player.api('getVideoHeight', function (value, player_id) {
							var h = value;
							var vRatio = w / h;
							$(window).resize(function(){resize(vRatio);});
							resize(vRatio);
							player.api('play');
						});
					});
				});
			});
		})
		.fail(function( jqxhr, settings, exception ) {
			console.log( 'Triggered ajaxError handler.' );
		});
};