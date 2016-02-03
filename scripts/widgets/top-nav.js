module.exports = function(){ "use strict";
	var tools = require('../tools/tools.js');
	var $topNav =  $('#top-nav');
	var isOneState = (!$topNav.data('state1-colors')) || (!$topNav.data('state2-colors'));
	var $body = $('body');
	var isTopNav = $topNav.length > 0;
	var $topMenuNav =  $topNav.find('.navbar-collapse');
	var upperH = 20;
	var bigTopNav = isTopNav ? 100 : 0;
	var smallTopNav = isTopNav ? 70 : 0;
	var themes = require('../app/themes.js');
	var topNavState1Top = (function(){
		if(isTopNav){
			return upperH;
		}else{
			return 0;
		}
	})();
	var isTopNavState1 = false;
	var isTopNavState2 = false;
	var me = this;
	var state1Colors = $topNav.data('state1-colors');
	var state2Colors = $topNav.data('state2-colors');
	this.state1H = bigTopNav;
	this.state2H = smallTopNav;
	this.state1Top = function(){ return topNavState1Top; };
	this.state1 = function(){
		if(isOneState){
			this.state2();
		}else if(isTopNav && !isTopNavState1){
			$body.removeClass('state2').addClass('state1');
			$topNav.removeClass(state2Colors).addClass(state1Colors);
			isTopNavState1 = true;
			isTopNavState2 = false;
			tools.androidStylesFix($topNav);
		}
	};
	this.state2 = function(){
		if(isTopNav && !isTopNavState2){
			$body.removeClass('state1').addClass('state2');
			if(!isOneState){
				$topNav.removeClass(state1Colors);
			}
			$topNav.addClass(state2Colors);
			isTopNavState1 = false;
			isTopNavState2 = true;
			tools.androidStylesFix($topNav);
		}
	};
	this.$menu = function(){
		return $topMenuNav;
	};
	if(isTopNav){
		me.state1();
		$topMenuNav.find('a:not(.dropdown-toggle)').click(function(){
			$topNav.find('.navbar-collapse.in').collapse('hide');
			$topNav.find('.menu-toggle.navbar-toggle').removeClass('show');
		});
		$(window).resize(function(){
			$topNav.find('.navbar-collapse.in').collapse('hide');
			$topNav.find('.menu-toggle.navbar-toggle').removeClass('show');
		});
	}
};