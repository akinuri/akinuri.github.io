function rgb2hsl(r, g, b) {
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
		switch (max) {
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
	hue = parseFloat((hue * 60).toFixed(1));
	sat = parseFloat((sat * 100).toFixed(1));
	lum = parseFloat((lum * 100).toFixed(1));
	return [hue, sat, lum];
}

function rgb2hsl_rounded(r, g, b) {
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
		switch (max) {
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
	return [hue, sat, lum];
}

function hsl2rgb(h, s, l) {
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
	return [r, g, b];
}