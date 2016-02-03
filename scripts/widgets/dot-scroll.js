module.exports = new (function(){ "use strict";
	var isMobile = $('html').hasClass('mobile');
	var $sec = $('body>section[id]');
	var $lnks;
	if(!isMobile && $sec.length>1){
		var $ul = $('#dot-scroll');
		$sec.each(function(){
			$ul.append('<li><a href="#'+$(this).attr('id')+'"><span></span></a></li>');
		});
		$lnks = $ul.find('a');
	}else{
		$lnks = jQuery();
	}
	this.links = function(){
		return $lnks;
	}
})();