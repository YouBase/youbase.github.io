module.exports = function($context){ "use strict";
	var themes = require('../app/themes.js');
	$context.find('.change-colors').each(function(){
		var $group = $(this);
		var $target = $($group.data('target'));
		var $links = $group.find('a');
		var currentColors;
		for(var i=0; i<themes.colors; i++){
			var colors = 'colors-'+String.fromCharCode(65+i).toLowerCase();
			if($target.hasClass(colors)){
				currentColors = colors;
				$links.each(function(){
					var $el = $(this);
					if($el.data('colors') === currentColors){
						$el.addClass('active');
					}
				})
			}
		}
		$links.click(function(e){
			e.preventDefault();
			var $link = $(this);
			$target.removeClass(currentColors);
			currentColors = $link.data('colors');
			$target.addClass(currentColors);
			$links.removeClass('active');
			$link.addClass('active');
		});
	});
};