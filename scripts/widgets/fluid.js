module.exports = new (function(){ "use strict";
	this.setup = function($context){
		$context.find('.fluid *').each(function() {
			var $el = $(this);
			var $wrap = $el.parent('.fluid');
			var newWidth = $wrap.width();
			var ar = $el.attr('data-aspect-ratio');
			if(!ar){
				ar = this.height / this.width;
				$el
					// jQuery .data does not work on object/embed elements
					.attr('data-aspect-ratio', ar)
					.removeAttr('height')
					.removeAttr('width');
			}
			var newHeight = Math.round(newWidth * ar);
			$el.width(Math.round(newWidth)).height(newHeight);
			$wrap.height(newHeight);
		});
		/*$context.find('.fluid-width').each(function() {
			// Fix for IE11. Micro margins in theme-angie/help-elements.html
			var $el = $(this);
			$el.css({height: ''});
			setTimeout(function(){
				$el.height(Math.round($el.height()));
			});
		});*/
		
	};
})();