module.exports = new (function(){
	var me = this;
	var isOldWin =
			(navigator.appVersion.indexOf("Windows NT 6.1")!=-1) || //Win7
			(navigator.appVersion.indexOf("Windows NT 6.0")!=-1) || //Vista
			(navigator.appVersion.indexOf("Windows NT 5.1")!=-1) || //XP
			(navigator.appVersion.indexOf("Windows NT 5.0")!=-1);   //Win2000
	var isIE9 = $('html').hasClass('ie9');
	var isIE10 = $('html').hasClass('ie10');
	var isIE11 = $('html').hasClass('ie11');
	var isPoorBrowser = $('html').hasClass('poor-browser');
	var isMobile = $('html').hasClass('mobile');
	var factor = (function(){
		if(isIE9 || isIE10 || (isIE11 && isOldWin)){
			return 0;
		}else if(isIE11){
			return -0.15;
		}else if(isPoorBrowser){
			return 0;
		}else{
			return -0.25;
		}
	})();
	this.force3D = (isPoorBrowser || isMobile) ? "auto" : true;
	this.parallaxMargin = function(script, secInd, viewOffsetFromWindowTop){
		var viewOffsetFromNavPoint = (viewOffsetFromWindowTop - (secInd === 0 ? 0 : script.topNav.state2H));
		return Math.round(factor * viewOffsetFromNavPoint);
	};
})();