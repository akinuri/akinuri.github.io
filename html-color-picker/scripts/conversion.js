function rgb2hsl(r, g, b, a) {
	// see http://stackoverflow.com/a/39147465/2202732
	var hsl = [];
	r /= 255,
	g /= 255,
	b /= 255;
	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);
	var lum = (max + min) / 2;
	var c	= max - min;
	var hue;
	var sat;
	if (c == 0) {
		hue = sat = 0;
	} else {
		sat = c / (1 - Math.abs(2 * lum - 1));
		switch(max) {
			case r:
				var segment = (g - b) / c;
				var shift   = 0 / 60;
				if (segment < 0) {
					shift = 360 / 60;
				}
				hue = segment + shift;
				break;
			case g:
				var segment = (b - r) / c;
				var shift   = 120 / 60;
				hue = segment + shift;
				break;
			case b:
				var segment = (r - g) / c;
				var shift   = 240 / 60;
				hue = segment + shift;
				break;
		}
	}
	hue = Math.round(hue * 60);
	sat = Math.round(sat * 100);
	lum = Math.round(lum * 100);
	hsl.push(hue, sat, lum);
	if (arguments.length == 4) {
		hsl.push(a);
	}
	return hsl;
}

function hsl2rgb(h, s, l, a) {
	var rgb = [];
	h /= 360;
	s /= 100;
	l /= 100;
	var r, g, b;
	if (s == 0) {
		r = g = b = l;
	} else {
		var hue2rgb = function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1/6) return p + (q - p) * 6 * t;
			if (t < 1/2) return q;
			if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}
		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}
	r = Math.round(r * 255);
	g = Math.round(g * 255);
	b = Math.round(b * 255);
	rgb.push(r, g, b);
	if (arguments.length == 4) {
		rgb.push(a);
	}
	return rgb;
}

function cssRGB(r, g, b, a) {
	var rgb = [];
	rgb.push(r, g, b);
	if (arguments.length == 4) {
		rgb.push(a);
		return "rgba(" + rgb.join() +")";
	}
	return "rgb(" + rgb.join() +")";
}

function cssHSL(h, s, l, a) {
	var hsl = [];
	hsl.push(h, s + "%", l + "%");
	if (arguments.length == 4) {
		hsl.push(a);
		return "hsla(" + hsl.join() +")";
	}
	return "hsl(" + hsl.join() +")";
}

function rgb2hex(colorArray) {
	return "#" + int2hex(colorArray[0]) + int2hex(colorArray[1]) + int2hex(colorArray[2]);
}

function int2hex(n) {
	var hex = n.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}