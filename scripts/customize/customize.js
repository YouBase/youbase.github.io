module.exports = function(script){"use strict";
	var themes = require('../app/themes.js');
	var tools = require('../tools/tools.js');
	var loading = require('../widgets/loading.js');
	var appShare = require('../app/app-share.js');
	var colors = themes.colors;
	var me = this;
	var cPath = '';
	var customCss;
	var $window = $(window);
	var $panel;
	var $opt;
	var $toggle;
	var optW;
	var $customCss;
	var $themesSelect;
	var $colors;
	var isInitialized = false;
	
	this.lessVars = {};
	this.isShowPanel = (function(){
		var customizeP = tools.getUrlParameter('customize');
		if(customizeP === undefined){
			customizeP = $.cookie('customize');
		}else{
			$.cookie('customize', 'yes', {path: cPath});
		}
		return (customizeP && $('#top-nav').length > 0) ? true : false;
	})();
	this.show = function(){
		setTimeout(function(){
			if(!isInitialized){
				isInitialized = true;
				createCss(true);
				initLessVars();
				var $gate = $opt.find('.options-gate');
				$gate.css({opacity: 0});
				setTimeout(function(){
					$gate.css({visibility: 'hidden'});
				}, 1000);
			}
		}, 550);
		$panel.css({left: '0px'});
		$panel.addClass('on');
	};
	this.hide = function(){
		$panel.css({left: -1*optW+'px'});
		$panel.removeClass('on');
	};
	function resize(){
		$opt.css({
			height: ($window.height() - parseInt($panel.css('top').replace('px','')) - 30) + 'px'
		});
	}
	function themeSelectToCustom(){
		if($themesSelect.val() !== 'custom'){
			$('<option value="custom">Custom</option>').appendTo($themesSelect);
			$themesSelect.val('custom');
			$.cookie.json = false;
			$.cookie('themeSelect', 'custom', {path: cPath});
			$.cookie.json = true;
		}
	}
	function initLessVars(){
		for(var i=0; i<colors; i++){
			initGroup(String.fromCharCode(65+i).toLowerCase());
		}
		initLessVar('<span><span class="primary-color"></span></span>', '.primary-color', 'color', 'input.primary-bg', 'primary-bg', toHex);
		initLessVar('<span><span class="out-primary"></span></span>', '.out-primary', 'opacity', 'input.primary-out', 'primary-out', outTranslator, outSetTranslator);
		initLessVar('<span><span class="success-color"></span></span>', '.success-color', 'color', 'input.success-bg', 'success-bg', toHex);
		initLessVar('<span><span class="out-success"></span></span>', '.out-success', 'opacity', 'input.success-out', 'success-out', outTranslator, outSetTranslator);
		initLessVar('<span><span class="info-color"></span></span>', '.info-color', 'color', 'input.info-bg', 'info-bg', toHex);
		initLessVar('<span><span class="out-info"></span></span>', '.out-info', 'opacity', 'input.info-out', 'info-out', outTranslator, outSetTranslator);
		initLessVar('<span><span class="warning-color"></span></span>', '.warning-color', 'color', 'input.warning-bg', 'warning-bg', toHex);
		initLessVar('<span><span class="out-warning"></span></span>', '.out-warning', 'opacity', 'input.warning-out', 'warning-out', outTranslator, outSetTranslator);
		initLessVar('<span><span class="danger-color"></span></span>', '.danger-color', 'color', 'input.danger-bg', 'danger-bg', toHex);
		initLessVar('<span><span class="out-danger"></span></span>', '.out-danger', 'opacity', 'input.danger-out', 'danger-out', outTranslator, outSetTranslator);
	}
	function initGroup(grp){
		initLessVar('<span class="colors-'+grp+'"><span class="bg-color"></span></span>', '.bg-color', 'color', 'input.'+grp+'-bg', grp+'-bg', toHex);
		initLessVar('<span class="colors-'+grp+'"><span class="text"></span></span>', '.text', 'color', 'input.'+grp+'-text', grp+'-text', toHex);
		initLessVar('<span class="colors-'+grp+'"><span class="highlight"></span></span>', '.highlight', 'color', 'input.'+grp+'-highlight', grp+'-highlight', toHex);
		initLessVar('<span class="colors-'+grp+'"><span class="link"></span></span>', '.link', 'color', 'input.'+grp+'-link', grp+'-link', toHex);
		initLessVar('<span class="colors-'+grp+'"><span class="heading"></span></span>', '.heading', 'color', 'input.'+grp+'-heading', grp+'-heading', toHex);
		initLessVar('<span class="colors-'+grp+'"><span class="out"></span></span>', '.out', 'opacity', 'input.'+grp+'-out', grp+'-out', outTranslator, outSetTranslator);
	}
	function outTranslator(v){return Math.round((1-v)*100);}
	function outSetTranslator(v){return Math.round(v);}
	function initLessVar(getterHtml, getterQ, cssProperty, inputQ, lessVar, translator, setTranslator){
		//var changeDelay = 300;
		var $g = $('<span class="getter"></span>').appendTo('body');
		$(getterHtml).appendTo($g);
		var getted = $g.find(getterQ).css(cssProperty);
		$g.remove();
		if(getted){
			if(translator) getted = translator(getted);
		}
		me.lessVars[lessVar] = getted;
		var $inp = $opt.find(inputQ);
		$inp.val(getted);
		if(cssProperty === 'color'){
			$inp.minicolors({
				control: $(this).attr('data-control') || 'hue',
				defaultValue: $(this).attr('data-defaultValue') || '',
				inline: $(this).attr('data-inline') === 'true',
				letterCase: $(this).attr('data-letterCase') || 'lowercase',
				opacity: false,
				position: $(this).attr('data-position') || 'top left',
				//changeDelay: changeDelay,
				change: function(hex, opacity) {
					themeSelectToCustom();
					me.lessVars[lessVar] = hex;
					createCss();
				},
				show: function(){
					var $mc = $inp.parent();
					var $mcPanel = $mc.children('.minicolors-panel');
					var mcPanelH = $mcPanel.outerHeight(true);
					var mcPanelW = $mcPanel.outerWidth(true);
					var $window = $(window);
					var wW = $window.width();
					var wH = $window.height();
					var offset = $mcPanel.offset();
					var left = offset.left - $(document).scrollLeft();
					var top = offset.top - $(document).scrollTop();
					if( (left+mcPanelW) > wW ){
						left = wW - mcPanelW - 5;
					}
					if( (top+mcPanelH) > wH ){
						top = wH - mcPanelH - 2;
					}
					if( top < 0 ){
						top = 2;
					}
					$mcPanel.css({
						position: 'fixed',
						left: left+'px',
						top: top+'px'
					});
				},
				hide: function(){
					$inp.parent().children('.minicolors-panel').css({
						position: '',
						left: '',
						top: ''
					});
				},
				theme: 'bootstrap'
			});
		}else{
			var timer;
			$inp.change(function(){
				var $el = $(this);
				var val = $el.val();
				if (timer){
					clearTimeout(timer);
				}
				//timer = setTimeout(function(){
					themeSelectToCustom();
					me.lessVars[lessVar] = val;
					createCss();
				//}, changeDelay);
			});
		}
		function colorFormat(val){
			if(!val.match(/^#[0-9a-fA-f][0-9a-fA-f][0-9a-fA-f][0-9a-fA-f][0-9a-fA-f][0-9a-fA-f]$/i)){
				if(val.match(/^#[0-9a-fA-f][0-9a-fA-f][0-9a-fA-f]$/i)){
					return "#"+val.charAt(1)+val.charAt(1)+val.charAt(2)+val.charAt(2)+val.charAt(3)+val.charAt(3);
				}else{
					return null;
				}
			}else{
				return val;
			}
		}
	}
	function buildPanel(){
		if(!me.isShowPanel){
			$panel.hide();
			return;
		}else{
			if(Object.keys(themes.names).length>0){
				for (var k in themes.names){
					$('<option value="'+k+'">'+themes.names[k]+'</option>').appendTo($themesSelect);
				}
			}else{
				$themesSelect.remove();
				$('<a class="btn" href="#">Reset</a>').appendTo($opt.find('.themes')).click(function(e){
					e.preventDefault();
					$.cookie.json = false;
					$.cookie('themeSelect', "", {path: cPath});
					$.cookie.json = true;
					me.hide();
					loading.gate(function(){
						location.reload();
					});
				});
			}
			$.cookie.json = false;
			var themeSelectC = $.cookie('themeSelect');
			$.cookie.json = true;
			if(themeSelectC === 'custom'){
				themeSelectToCustom();
			}else if(themeSelectC){
				$themesSelect.val(themeSelectC);
			}else{
				var $factory = $('#factory-theme');
				if($factory.length > 0 && $factory.css('visibility') === 'hidden'){
					var ts = themes.options[$factory.html()].style;
					$themesSelect.val(ts);
					$.cookie.json = false;
					$.cookie('themeSelect', ts, {path: cPath});
					$.cookie.json = true;
				}
			}
			$themesSelect.change(function(){
				$('.options .themes select option[value=custom]').remove();
				var href = $(this).val();
				$.cookie.json = false;
				$.cookie('themeSelect', href, {path: cPath});
				$.cookie.json = true;
				me.hide();
				loading.gate(function(){
					location.reload();
				});
			});
			$panel.css({left: -1*optW+'px'});
			$toggle.click(function(e){
				e.preventDefault();
				if($panel.hasClass('on')){
					me.hide();
				}else{
					me.show();
				}
			});
			$opt.find('.save-custom-css').click(function(e){
				e.preventDefault();
				var $content = $customCss.find('.content');
				if($.cookie('saveAsLess')){
					var lessStr='@import "theme.less";\r\n\r\n';
					for(var key in me.lessVars){
						lessStr = lessStr+'@'+key+': '+me.lessVars[key]+';\r\n';
						$content.text(lessStr);
					}
				}else{
					if(!customCss) createCss();
					$content.text(
						customCss.replace(/(\r\n|\r|\n)/g,'\r\n')
					);
				}
				TweenLite.fromTo($customCss, 0.5, {fautoAlpha: 0, x:-450, y: 0}, {force3D: appShare.force3D, autoAlpha: 1, x: 0, y: 0, ease:Power2.easeOut});
			});
			$customCss.find('.close-panel').click(function(e){
				e.preventDefault();
				TweenLite.to($customCss, 0.5, {force3D: appShare.force3D, autoAlpha: 0, x:-450, ease:Power1.easeIn});
			});
			tools.selectTextarea($customCss.find("textarea"));
			var colorsBg = $colors.css('background-image');
			if(!colorsBg || colorsBg == 'none'){
				var $bgIm = $('img.bg');
				if($bgIm.length>0){
					$colors.css({
						'background-image': "url('"+$bgIm.get(0).src+"')",
						'background-position': 'center center',
						'background-size': 'cover'
					});
				}
			}
		}
	}
	function createCss(isInitOnly){
		var custom = atob(customLess);
		$.cookie('lessVars', me.lessVars, {path: cPath});
		doLess(custom, function(css){
			if(!isInitOnly){
				var ems = 'edit-mode-styles';
				customCss = css;
				var $cur = $('#'+ems);
				if($cur.length<1){
					$('<style type="text/css" id="'+ems+'">\n'+css+'</style>').appendTo('head');
					$('#custom-css').remove();
				}else{
					if($cur[0].innerHTML){
						$cur[0].innerHTML = customCss;
					}else{
						$cur[0].styleSheet.cssText = customCss;
					}
				}
			}
		});
	}
	function doLess(data, callback){
		less.render(
			data,
			{	currentDirectory: "styles/themes/",
				filename: "styles/themes/theme-default.less",
				entryPath: "styles/themes/",
				rootpath: "styles/themes/styles/themes/",
				rootFilename: "styles/themes/theme-default.less",
				relativeUrls: false,
				useFileCache: me.lessVars || less.globalVars,
				compress: false,
				modifyVars: me.lessVars,
				globalVars: less.globalVars
			},
			function(e, output) {
				callback(output.css);
			}
		);
	}
	function toHex(rgb){
		if(rgb.indexOf('rgb') === -1){
			return rgb;
		}else{
			var triplet = rgb.match(/[^0-9]*([0-9]*)[^0-9]*([0-9]*)[^0-9]*([0-9]*)[^0-9]*/i);
			return "#"+digitToHex(triplet[1])+digitToHex(triplet[2])+digitToHex(triplet[3]);
		}
		function digitToHex(dig){
			if(isNaN(dig)){
				return "00";
			}else{
				var hx = parseInt(dig).toString(16);
				return hx.length == 1 ? "0"+hx : hx;
			}
		}
	}
	
	if(me.isShowPanel){
		$('<div id="customize-panel"></div>').appendTo('body').load('customize/customize.html #customize-panel>*', function(xhr, statusText, request){
			if(statusText !== "success" && statusText !== "notmodified"){
				$('#customize-panel').remove();
				script.afterConfigure();
			}else{
				$.getScript( "customize/custom-less.js", function( data, lessStatusText, jqxhr ) {
					if(lessStatusText !== "success" && lessStatusText !== "notmodified"){
						$('#customize-panel').remove();
						script.afterConfigure();
					}else{
						$panel = $('#customize-panel');
						$opt = $panel.find('.options');
						$toggle = $panel.find('.toggle-button');
						optW = $opt.width();
						$customCss = $panel.find('.custom-css');
						$themesSelect = $opt.find('.themes select');
						$colors = $opt.find('.colors');
						$.cookie.json = true;
						buildPanel();
						if(tools.getUrlParameter('save-as-less')){
							$.cookie('saveAsLess', 'yes', {path: cPath});
						}
						$.cookie.json = false;
						var tsc = $.cookie('themeSelect');
						$.cookie.json = true;
						if( tsc === 'custom' ){
							isInitialized = true;
							me.lessVars = $.cookie('lessVars');
							createCss();
							initLessVars();
							$opt.find('.options-gate').css({visibility: 'hidden'});
						}
						$window.resize(resize);
						resize();
						script.afterConfigure();
					}
				});
			}
		});
	}else{
		script.afterConfigure();
	}
};