// See:
//		http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
//		https://github.com/kig/canvasfilters
//		http://www.quasimondo.com/BoxBlurForCanvas/FastBlur2Demo.html
module.exports = new (function(){ "use strict";
	var isPoorBrowser = $('html').hasClass('poor-browser');
	if(isPoorBrowser) return;
	var tmpCanvas = document.createElement('canvas');
    var tmpCtx = tmpCanvas.getContext('2d');
	var createImageData = function(w,h) {
		return tmpCtx.createImageData(w,h);
	};
	var getFloat32Array, getUint8Array;
	if (typeof Float32Array == 'undefined') {
		getFloat32Array =
		getUint8Array = function(len) {
			if (len.length) {
				return len.slice(0);
			}
			return new Array(len);
		};
	} else {
		getFloat32Array = function(len) {
			return new Float32Array(len);
		};
		getUint8Array = function(len) {
			return new Uint8Array(len);
		};
	}
	var createImageDataFloat32 = function(w, h) {
		return {width: w, height: h, data: getFloat32Array(w*h*4)};
	};
	var applyLUT = function(pixels, lut) {
		var output = createImageData(pixels.width, pixels.height);
		var d = pixels.data;
		var dst = output.data;
		var r = lut.r;
		var g = lut.g;
		var b = lut.b;
		var a = lut.a;
		for (var i=0; i<d.length; i+=4) {
			dst[i] = r[d[i]];
			dst[i+1] = g[d[i+1]];
			dst[i+2] = b[d[i+2]];
			dst[i+3] = a[d[i+3]];
		}
		return output;
	};
	var createLUTFromCurve = function(points) {
		var lut = getUint8Array(256);
		var p = [0, 0];
		for (var i=0,j=0; i<lut.length; i++) {
			while (j < points.length && points[j][0] < i) {
			p = points[j];
			j++;
			}
			lut[i] = p[1];
		}
		return lut;
	};
	var identityLUT = function() {
		var lut = getUint8Array(256);
		for (var i=0; i<lut.length; i++) {
			lut[i] = i;
		}
		return lut;
	};
	var invertLUT = function() {
		var lut = this.getUint8Array(256);
		for (var i=0; i<lut.length; i++) {
			lut[i] = 255-i;
		}
		return lut;
	};
	var brightnessContrastLUT = function(brightness, contrast) {
		var lut = getUint8Array(256);
		var contrastAdjust = -128*contrast + 128;
		var brightnessAdjust = 255 * brightness;
		var adjust = contrastAdjust + brightnessAdjust;
		for (var i=0; i<lut.length; i++) {
			var c = i*contrast + adjust;
			lut[i] = c < 0 ? 0 : (c > 255 ? 255 : c);
		}
		return lut;
	};
	this.convolveVHF = function(pixels, weights, opaque, isVertical, isHorizontal, isFloat32) {
		var side = (isVertical && isHorizontal) ? Math.round(Math.sqrt(weights.length)) : weights.length;
		var halfSide = Math.floor(side/2);
		var src = pixels.data;
		var sw = pixels.width;
		var sh = pixels.height;
		var w = sw;
		var h = sh;
		var output = isFloat32 ? createImageDataFloat32(w, h) : createImageData(w, h);
		var dst = output.data;
		var alphaFac = opaque ? 1 : 0;
		for (var y=0; y<h; y++) {
			for (var x=0; x<w; x++) {
			var sy = y;
			var sx = x;
			var dstOff = (y*w+x)*4;
			var r=0, g=0, b=0, a=0;
			if((isVertical && isHorizontal)){
				for (var cy=0; cy<side; cy++) {
					for (var cx=0; cx<side; cx++) {
						var scy = isVertical ? Math.min(sh-1, Math.max(0, sy + cy - halfSide)) : sy;
						var scx = isHorizontal ? Math.min(sw-1, Math.max(0, sx + cx - halfSide)) : sx;
						var srcOff = (scy*sw+scx)*4;
						var wt = weights[cy*side+cx];
						r += src[srcOff] * wt;
						g += src[srcOff+1] * wt;
						b += src[srcOff+2] * wt;
						a += src[srcOff+3] * wt;
					}
				}
			}else if(isVertical){
				for (var cy=0; cy<side; cy++) {
					var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
					var scx = sx;
					var srcOff = (scy*sw+scx)*4;
					var wt = weights[cy];
					r += src[srcOff] * wt;
					g += src[srcOff+1] * wt;
					b += src[srcOff+2] * wt;
					a += src[srcOff+3] * wt;
				}
			}else if(isHorizontal){
				for (var cx=0; cx<side; cx++) {
					var scy = sy;
					var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
					var srcOff = (scy*sw+scx)*4;
					var wt = weights[cx];
					r += src[srcOff] * wt;
					g += src[srcOff+1] * wt;
					b += src[srcOff+2] * wt;
					a += src[srcOff+3] * wt;
				}
			}
			dst[dstOff] = r;
			dst[dstOff+1] = g;
			dst[dstOff+2] = b;
			dst[dstOff+3] = a + alphaFac*(255-a);
			}
		}
		return output;
	};
	this.identity = function(pixels) {
		var output = createImageData(pixels.width, pixels.height);
		var dst = output.data;
		var d = pixels.data;
		for (var i=0; i<d.length; i++) {
			dst[i] = d[i];
		}
		return output;
	};
	this.convolve = function(pixels, weights, opaque) {
		return this.convolveVHF(pixels, weights, opaque, true, true);
	};
	this.verticalConvolve = function(pixels, weights, opaque) {
		return this.convolveVHF(pixels, weights, opaque, true, false);
	};
	this.horizontalConvolve = function(pixels, weights, opaque) {
		return this.convolveVHF(pixels, weights, opaque, false, true);
	};
	this.convolveFloat32 = function(pixels, weights, opaque) {
		return this.convolveVHF(pixels, weights, opaque, true, true, true);
	};
	this.verticalConvolveFloat32 = function(pixels, weights, opaque) {
		return this.convolveVHF(pixels, weights, opaque, true, false, true);
	};
	this.horizontalConvolveFloat32 = function(pixels, weights, opaque) {
		return this.convolveVHF(pixels, weights, opaque, false, true, true);
	};
	this.separableConvolve = function(pixels, horizWeights, vertWeights, opaque) {
		return this.horizontalConvolve(
			this.verticalConvolveFloat32(pixels, vertWeights, opaque),
			horizWeights, opaque
		);
	};
	this.separableConvolveFloat32 = function(pixels, horizWeights, vertWeights, opaque) {
		return this.horizontalConvolveFloat32(
			this.verticalConvolveFloat32(pixels, vertWeights, opaque),
			horizWeights, opaque
		);
	};
	this.getPixels = function(canvas){
		var ctx = canvas.getContext('2d');
		return ctx.getImageData(0,0,canvas.width,canvas.height);
	}
	this.putPixels = function(canvas, pixels){
		var ctx = canvas.getContext('2d');
		ctx.putImageData(pixels, 0, 0);
	}
	this.putImage = function(canvas, src){
		//src - canvas or img
		canvas.width = src.naturalWidth ? src.naturalWidth : src.width;
		canvas.height = src.naturalHeight ? src.naturalHeight : src.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(src, 0, 0);
	}
	this.getImagePixels = function(img){
		var canvas = document.createElement('canvas');
		this.putImage(canvas, img)
		return this.getPixels(canvas)
	}
	this.grayscaleLum = function(opt){
		var pixels = opt.pixels;
		var rLum = opt.rLum;
		var gLum = opt.gLum;
		var bLum = opt.bLum;
		var output = createImageData(pixels.width, pixels.height);
		var dst = output.data;
		var d = pixels.data;
		for (var i=0; i<d.length; i+=4) {
			var v = rLum * d[i] + gLum * d[i+1] + bLum * d[i+2];
			dst[i] = dst[i+1] = dst[i+2] = v;
			dst[i+3] = d[i+3];
		}
		return output;
	}
	this.grayscale = function(pixels){
		return this.grayscaleLum({
			pixels: pixels,
			rLum: 0.3,
			gLum: 0.59,
			bLum:  0.11
			
		});
	}
	this.grayscaleCie = function(pixels){
		return this.grayscaleLum({
			pixels: pixels,
			rLum: 0.2126,
			gLum: 0.7152,
			bLum:  0.0722
			
		});
	}
	this.grayscaleAvg = function(pixels){
		var lum = 1/3;
		return this.grayscaleLum({
			pixels: pixels,
			rLum: lum,
			gLum: lum,
			bLum:  lum
			
		});
	}
	this.horizontalFlip = function(pixels) {
		var output = createImageData(pixels.width, pixels.height);
		var w = pixels.width;
		var h = pixels.height;
		var dst = output.data;
		var d = pixels.data;
		for (var y=0; y<h; y++) {
			for (var x=0; x<w; x++) {
				var off = (y*w+x)*4;
				var dstOff = (y*w+(w-x-1))*4;
				dst[dstOff] = d[off];
				dst[dstOff+1] = d[off+1];
				dst[dstOff+2] = d[off+2];
				dst[dstOff+3] = d[off+3];
			}
		}
		return output;
	};
	this.verticalFlip = function(pixels) {
		var output = createImageData(pixels.width, pixels.height);
		var w = pixels.width;
		var h = pixels.height;
		var dst = output.data;
		var d = pixels.data;
		for (var y=0; y<h; y++) {
			for (var x=0; x<w; x++) {
				var off = (y*w+x)*4;
				var dstOff = ((h-y-1)*w+x)*4;
				dst[dstOff] = d[off];
				dst[dstOff+1] = d[off+1];
				dst[dstOff+2] = d[off+2];
				dst[dstOff+3] = d[off+3];
			}
		}
		return output;
	};
	this.brightness = function(pixels, adjustment) {
		var output = createImageData(pixels.width, pixels.height);
		var dst = output.data;
		var d = pixels.data;
		for (var i=0; i<d.length; i+=4) {
			dst[i] = d[i] + adjustment;
			dst[i+2] = d[i+1] + adjustment;
			dst[i+3] = d[i+2] + adjustment;
		}
		return output;
	};
	this.threshold = function(pixels, threshold) {
		var output = createImageData(pixels.width, pixels.height);
		var dst = output.data;
		var d = pixels.data;
		for (var i=0; i<d.length; i+=4) {
			var r = d[i];
			var g = d[i+1];
			var b = d[i+2];
			var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
			dst[i] = dst[i+1] = dst[i+2] = v
		}
		return output;
	};
	this.sharpen = function(pixels){
		return this.convolve(pixels,
			[	0, -1,  0,
				-1,  5, -1,
				0, -1,  0
			]
		);
	}
	this.sobel = function(pixels){
		var px = this.grayscale(pixels);
		var vertical = this.convolveFloat32(px,
			[-1,-2,-1,
			0, 0, 0,
			1, 2, 1]);
		var horizontal = this.convolveFloat32(px,
			[-1,0,1,
			-2,0,2,
			-1,0,1]);
		var id = createImageData(vertical.width, vertical.height);
		for (var i=0; i<id.data.length; i+=4) {
			var v = Math.abs(vertical.data[i]);
			id.data[i] = v;
			var h = Math.abs(horizontal.data[i]);
			id.data[i+1] = h
			id.data[i+2] = (v+h)/4;
			id.data[i+3] = 255;
		}
		return id;
	}
	this.blurC = function(pixels, fact){
		var w = 1/9;
		return this.convolve(pixels,
			[	w, w, w,
				w, w, w,
				w, w, w
			]
		);
	}
	this.gaussianBlur = function(pixels, diameter) {
		diameter = Math.abs(diameter);
		if (diameter <= 1) return this.identity(pixels);
		var radius = diameter / 2;
		var len = Math.ceil(diameter) + (1 - (Math.ceil(diameter) % 2))
		var weights = getFloat32Array(len);
		var rho = (radius+0.5) / 3;
		var rhoSq = rho*rho;
		var gaussianFactor = 1 / Math.sqrt(2*Math.PI*rhoSq);
		var rhoFactor = -1 / (2*rho*rho)
		var wsum = 0;
		var middle = Math.floor(len/2);
		for (var i=0; i<len; i++) {
			var x = i-middle;
			var gx = gaussianFactor * Math.exp(x*x*rhoFactor);
			weights[i] = gx;
			wsum += gx;
		}
		for (var i=0; i<weights.length; i++) {
			weights[i] /= wsum;
		}
		return this.separableConvolve(pixels, weights, weights, false);
	};
	this.brightnessContrast = function(pixels, brightness, contrast) {
		var lut = brightnessContrastLUT(brightness, contrast);
		return applyLUT(pixels, {r:lut, g:lut, b:lut, a:identityLUT()});
	};
	this.stackBoxBlur = function(opt){
		var pixels = opt.pixels;
		var radius = opt.radius;
		var iterations = opt.iterations;
		var isNonHorisontal = opt.isNonHorisontal;
		var isNonVertical = opt.isNonVertical;
		var resumeRequest = opt.resumeRequest;
		var breakTime = opt.breakTime;
		var endCallback = opt.endCallback;
		
		var output = this.identity(pixels);
		if(radius<=0 || (isNonHorisontal && isNonVertical)) {
			if(endCallback) endCallback(output);
			if(!breakTime) return output;
		}
		var dst = output.data;
		var BlurStack = function (){
			this.r = 0;
			this.g = 0;
			this.b = 0;
			this.a = 0;
			this.next = null;
		}
		var mul_table = [1,171,205,293,57,373,79,137,241,27,391,357,41,19,283,265,497,469,443,421,25,191,365,349,335,161,155,149,9,278,269,261,505,245,475,231,449,437,213,415,405,395,193,377,369,361,353,345,169,331,325,319,313,307,301,37,145,285,281,69,271,267,263,259,509,501,493,243,479,118,465,459,113,446,55,435,429,423,209,413,51,403,199,393,97,3,379,375,371,367,363,359,355,351,347,43,85,337,333,165,327,323,5,317,157,311,77,305,303,75,297,294,73,289,287,71,141,279,277,275,68,135,67,133,33,262,260,129,511,507,503,499,495,491,61,121,481,477,237,235,467,232,115,457,227,451,7,445,221,439,218,433,215,427,425,211,419,417,207,411,409,203,202,401,399,396,197,49,389,387,385,383,95,189,47,187,93,185,23,183,91,181,45,179,89,177,11,175,87,173,345,343,341,339,337,21,167,83,331,329,327,163,81,323,321,319,159,79,315,313,39,155,309,307,153,305,303,151,75,299,149,37,295,147,73,291,145,289,287,143,285,71,141,281,35,279,139,69,275,137,273,17,271,135,269,267,133,265,33,263,131,261,130,259,129,257,1];
		var shg_table = [0,9,10,11,9,12,10,11,12,9,13,13,10,9,13,13,14,14,14,14,10,13,14,14,14,13,13,13,9,14,14,14,15,14,15,14,15,15,14,15,15,15,14,15,15,15,15,15,14,15,15,15,15,15,15,12,14,15,15,13,15,15,15,15,16,16,16,15,16,14,16,16,14,16,13,16,16,16,15,16,13,16,15,16,14,9,16,16,16,16,16,16,16,16,16,13,14,16,16,15,16,16,10,16,15,16,14,16,16,14,16,16,14,16,16,14,15,16,16,16,14,15,14,15,13,16,16,15,17,17,17,17,17,17,14,15,17,17,16,16,17,16,15,17,16,17,11,17,16,17,16,17,16,17,17,16,17,17,16,17,17,16,16,17,17,17,16,14,17,17,17,17,15,16,14,16,15,16,13,16,15,16,14,16,15,16,12,16,15,16,17,17,17,17,17,13,16,15,17,17,17,16,15,17,17,17,16,15,17,17,14,16,17,17,16,17,17,16,15,17,16,14,17,16,15,17,16,17,17,16,17,15,16,17,14,17,16,15,17,16,17,13,17,16,17,17,16,17,14,17,16,17,16,17,16,17,9];
		var width = pixels.width;
		var height = pixels.height;
		var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
		r_out_sum, g_out_sum, b_out_sum,
		r_in_sum, g_in_sum, b_in_sum,
		pr, pg, pb, rbs;
		var div = radius + radius + 1;
		var w4 = width << 2;
		var widthMinus1  = width - 1;
		var heightMinus1 = height - 1;
		var radiusPlus1  = radius + 1;
		var stackStart = new BlurStack();
		var stack = stackStart;
		for ( i = 1; i < div; i++ )
		{
			stack = stack.next = new BlurStack();
			if ( i == radiusPlus1 ) var stackEnd = stack;
		}
		stack.next = stackStart;
		var stackIn = null;
		var mul_sum = mul_table[radius];
		var shg_sum = shg_table[radius];
		var resume = {
			startY: height,
			startX: 0
		}
		yw = yi = 0;
		var rend = function(){
			var timeStamp1 = breakTime ? Date.now() : null;
			while ( iterations > 0 ) {
				if(!isNonHorisontal){
					for ( y = resume.startY; --y >-1; ){
						r_sum = radiusPlus1 * ( pr = dst[yi] );
						g_sum = radiusPlus1 * ( pg = dst[yi+1] );
						b_sum = radiusPlus1 * ( pb = dst[yi+2] );
						stack = stackStart;
						for( i = radiusPlus1; --i > -1; ){
							stack.r = pr;
							stack.g = pg;
							stack.b = pb;
							stack = stack.next;
						}
						for( i = 1; i < radiusPlus1; i++ ){
							p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
							r_sum += ( stack.r = dst[p++]);
							g_sum += ( stack.g = dst[p++]);
							b_sum += ( stack.b = dst[p]);
							stack = stack.next;
						}
						stackIn = stackStart;
						for ( x = 0; x < width; x++ ){
							dst[yi++] = (r_sum * mul_sum) >>> shg_sum;
							dst[yi++] = (g_sum * mul_sum) >>> shg_sum;
							dst[yi++] = (b_sum * mul_sum) >>> shg_sum;
							yi++;
							p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
							r_sum -= stackIn.r - ( stackIn.r = dst[p++]);
							g_sum -= stackIn.g - ( stackIn.g = dst[p++]);
							b_sum -= stackIn.b - ( stackIn.b = dst[p]);
							stackIn = stackIn.next;
						}
						yw += width;
						if(breakTime){
							var timeStamp2 = Date.now();
							if(timeStamp2 - timeStamp1 > breakTime){
								resume.startY = y;
								resumeRequest(rend);
								return;
							}
						}
					}
				}
				if(!isNonVertical){
					for ( x = resume.startX; x < width; x++ ){
						yi = x << 2;
						r_sum = radiusPlus1 * ( pr = dst[yi++]);
						g_sum = radiusPlus1 * ( pg = dst[yi++]);
						b_sum = radiusPlus1 * ( pb = dst[yi]);
						stack = stackStart;
						for( i = 0; i < radiusPlus1; i++ ){
							stack.r = pr;
							stack.g = pg;
							stack.b = pb;
							stack = stack.next;
						}
						yp = width;
						for( i = 1; i <= radius; i++ ){
							yi = ( yp + x ) << 2;
							r_sum += ( stack.r = dst[yi++]);
							g_sum += ( stack.g = dst[yi++]);
							b_sum += ( stack.b = dst[yi]);
							stack = stack.next;
							if ( i < heightMinus1 ) yp += width;
						}
						yi = x;
						stackIn = stackStart;
						for ( y = 0; y < height; y++ ){
							p = yi << 2;
							dst[p]   = (r_sum * mul_sum) >>> shg_sum;
							dst[p+1] = (g_sum * mul_sum) >>> shg_sum;
							dst[p+2] = (b_sum * mul_sum) >>> shg_sum;
							p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
							r_sum -= stackIn.r - ( stackIn.r = dst[p]);
							g_sum -= stackIn.g - ( stackIn.g = dst[p+1]);
							b_sum -= stackIn.b - ( stackIn.b = dst[p+2]);
							stackIn = stackIn.next;
							yi += width;
						}
						if(breakTime){
							var timeStamp2 = Date.now();
							if(timeStamp2 - timeStamp1 > breakTime){
								resume.startX = x+1;
								resume.startY = -1;
								resumeRequest(rend);
								return;
							}
						}
					}
				}
				iterations--;
				yw = yi = 0;
			}
			if(endCallback) endCallback(output);
		}
		rend();
		if(!breakTime) return output;
	}
	this.distortSine = function(pixels, amount, yamount) {
		// The distort amounts should be between -0.5 and 0.5.
		if (amount == null) amount = 0.5;
		if (yamount == null) yamount = amount;
		var output = createImageData(pixels.width, pixels.height);
		var dst = output.data;
		var d = pixels.data;
		var px = createImageData(1,1).data;
		for (var y=0; y<output.height; y++) {
			var sy = -Math.sin(y/(output.height-1) * Math.PI*2);
			var srcY = y + sy * yamount * output.height/4;
			srcY = Math.max(Math.min(srcY, output.height-1), 0);
			for (var x=0; x<output.width; x++) {
				var sx = -Math.sin(x/(output.width-1) * Math.PI*2);
				var srcX = x + sx * amount * output.width/4;
				srcX = Math.max(Math.min(srcX, output.width-1), 0);
				var rgba = bilinearSample(pixels, srcX, srcY, px);
				var off = (y*output.width+x)*4;
				dst[off] = rgba[0];
				dst[off+1] = rgba[1];
				dst[off+2] = rgba[2];
				dst[off+3] = rgba[3];
			}
		}
		return output;
		function bilinearSample (pixels, x, y, rgba) {
			// bilinearSample bilinearly samples the image at the given coordinates.
			// The result is computed by linear blending of the four pixels around x,y.
			var x1 = Math.floor(x);
			var x2 = Math.ceil(x);
			var y1 = Math.floor(y);
			var y2 = Math.ceil(y);
			var a = (x1+pixels.width*y1)*4;
			var b = (x2+pixels.width*y1)*4;
			var c = (x1+pixels.width*y2)*4;
			var d = (x2+pixels.width*y2)*4;
			var df = ((x-x1) + (y-y1));
			var cf = ((x2-x) + (y-y1));
			var bf = ((x-x1) + (y2-y));
			var af = ((x2-x) + (y2-y));
			var rsum = 1/(af+bf+cf+df);
			af *= rsum;
			bf *= rsum;
			cf *= rsum;
			df *= rsum;
			var data = pixels.data;
			rgba[0] = data[a]*af + data[b]*bf + data[c]*cf + data[d]*df;
			rgba[1] = data[a+1]*af + data[b+1]*bf + data[c+1]*cf + data[d+1]*df;
			rgba[2] = data[a+2]*af + data[b+2]*bf + data[c+2]*cf + data[d+2]*df;
			rgba[3] = data[a+3]*af + data[b+3]*bf + data[c+3]*cf + data[d+3]*df;
			return rgba;
		};
	};
	this.erode = function(pixels) {
		var src = pixels.data;
		var sw = pixels.width;
		var sh = pixels.height;
		var w = sw;
		var h = sh;
		var output = createImageData(w, h);
		var dst = output.data;
		for (var y=0; y<h; y++) {
			for (var x=0; x<w; x++) {
			var sy = y;
			var sx = x;
			var dstOff = (y*w+x)*4;
			var srcOff = (sy*sw+sx)*4;
			var v = 0;
			if (src[srcOff] == 0) {
				if (src[(sy*sw+Math.max(0,sx-1))*4] == 0 && 
					src[(Math.max(0,sy-1)*sw+sx)*4] == 0) {
					v = 255;
				}
			} else {
				v = 255;
			}
			dst[dstOff] = v;
			dst[dstOff+1] = v;
			dst[dstOff+2] = v;
			dst[dstOff+3] = 255;
			}
		}
		return output;
	};
})();