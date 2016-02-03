module.exports = function(){ 'use strict';
	var tools = require('./tools.js');
	var rithm = parseInt(tools.getUrlParameter('show-section-rithm'));
	if(rithm > 0){
		var resize = function(){
			var $sections = $('section');
			var $areas = $sections.length > 0 ? $sections : $('body');
			$areas.each(function(){
				var $area = $(this);
				var sH = $area.height();
				var count = Math.ceil(sH/rithm);
				var $overlay = $('<div></div>').css({
					width: '100%',
					height: '100%',
					'background-color': 'rgba(0,0,0,.2)',
					position: 'absolute',
					top: '0',
					bottom: '0',
					'z-index': 1000,
					overflow: 'hidden',
					'pointer-events': 'none'
				});
				for(var i=0; i<count; i++){
					$('<div></div>').css({
						width: '100%',
						height: rithm+'px',
						'border-bottom': '1px solid rgba(255,255,255,.5)'
					}).appendTo($overlay);
				}
				$overlay.appendTo($area);
			});
		};
		$(window).resize(resize);
		resize();
	}
};