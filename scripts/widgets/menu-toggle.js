module.exports = function(){ "use strict";
	var $toggle = $('.menu-toggle');
	$toggle.click(function(e){
		e.preventDefault();
		var $tg = $(this);
		if($tg.hasClass('ext-nav-toggle')){
			var targetQ = $tg.data('target');
			var $extNav = $(targetQ);
			var $clickEls = $(targetQ+',#top-nav a:not(.menu-toggle),.page-border a');
			var clickHnd = function() {
				$extNav.removeClass('show');
				$tg.removeClass('show');
				$('body').removeClass('ext-nav-show');
				$('html, body').css({overflow: '', position: ''});
				$clickEls.unbind('click', clickHnd);
			}
			if($tg.hasClass('show')){
				$extNav.removeClass('show');
				$tg.removeClass('show');
				$('body').removeClass('ext-nav-show');
				$clickEls.unbind('click', clickHnd);
			}else{
				$extNav.addClass('show');
				$tg.addClass('show');
				$('body').addClass('ext-nav-show');
				$clickEls.bind('click', clickHnd);
			}
		}else{
			if($tg.hasClass('show')){
				$tg.removeClass('show');
			}else{
				$tg.addClass('show');
			}
		}
	});
};