module.exports = function($context){ 'use strict';
	var tools = require('../tools/tools.js');
	var OverlayWindow = require('./overlay-window.js');
	if(typeof(google) == "undefined") return;
	$context.find('.map-open').each(function(){
		var $mapOpen = $(this);
		var $overlay = $($mapOpen.data('map-overlay'));
		var $mapCanvas = $overlay.find('.map-canvas');
		var mapOptions = {
			center: new google.maps.LatLng($mapCanvas.data('latitude'), $mapCanvas.data('longitude')),
			zoom: $mapCanvas.data('zoom'),
			mapTypeId: google.maps.MapTypeId.ROADMAP/*,
			scrollwheel: false,
			styles : [{featureType:'all',stylers:[{saturation:-100},{gamma:0.0}]}]*/
		}
		var markers = [];
		$mapCanvas.find('.map-marker').each(function(){
			var $marker = $(this);
			markers.push({
				latitude: $marker.data('latitude'),
				longitude: $marker.data('longitude'),
				text: $marker.data('text')
			});
		});
		$mapCanvas.addClass('close-map').wrap('<div class="map-view"></div>');
		var $mapView = $mapCanvas.parent();
		var overlayWindow = new OverlayWindow($overlay, false, false, function(){
			var tl = new TimelineLite();
			tl.to($mapView, 0.5, {autoAlpha: 0});
		});
		var isInited = false;
		$mapOpen.click(function(event) {
			event.preventDefault();
			overlayWindow.show(false, function() {
				if (!isInited) {
					isInited = true;
					var map = new google.maps.Map($mapCanvas[0], mapOptions);
					var addListener = function(marker, text) {
						var infowindow = new google.maps.InfoWindow({
							content: text
						});
						google.maps.event.addListener(marker, "click", function() {
							infowindow.open(map, marker);
						});
					}
					for (var i = 0; i < markers.length; i++) {
						var marker = new google.maps.Marker({
							map: map,
							position: new google.maps.LatLng(markers[i].latitude, markers[i].longitude)
						});
						var text = markers[i].text;
						if (text) {
							addListener(marker, text);
						}
					}
				}
				var $oc = $overlay.find('.overlay-control');
				$mapView.css({height: ($(window).height() - $oc.height()) + 'px'});
				var tl = new TimelineLite();
				tl.fromTo($mapView, 0.5, {autoAlpha: 0}, {autoAlpha: 1});
			});
		});
	});
}