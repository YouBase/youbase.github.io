module.exports = function($context, isRemoved){ "use strict";
	if(isRemoved){
		$context.find(".carousel, .slider").each(function(){
			$(this).slick('unslick');
		});
		return;
	}
	var tools = require('../tools/tools.js');
	$context.find(".slider").each(function(){
		var $this = $(this)
		$this.slick({
			autoplay: true,
			dots: true
		});
	});
	$context.find(".carousel").each(function(){
		var $this = $(this)
		$this.slick({
			autoplay: false,
			dots: true,
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 3,
			responsive: [
				{
					breakpoint: 1000,
					settings: {
						dots: true,
						slidesToShow: 2,
						slidesToScroll: 2
					}
				},
				{
					breakpoint: 480,
					settings: {
						dots: true,
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});
	});
}