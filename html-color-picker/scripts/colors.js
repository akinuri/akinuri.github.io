var RGB = {
	get : function () {
		var rgb = boxes.rgb.all.map(function() {
			return parseInt(this.value, 10);
		}).get();
		var alpha = Alpha.get();
		if (alpha < 1) {
			rgb.push(alpha);
		}
		return rgb;
	},
	set : function (colorArray) {
		sliders.rgb.r.value = colorArray[0];
		sliders.rgb.g.value = colorArray[1];
		sliders.rgb.b.value = colorArray[2];
		boxes.rgb.r.value	= colorArray[0];
		boxes.rgb.g.value	= colorArray[1];
		boxes.rgb.b.value	= colorArray[2];
		this.updateSliderBG(colorArray);
	},
	updateSliderBG : function (colorArray) {
		sliders.rgb.r.style.background = "linear-gradient(to right, " + cssRGB(0, colorArray[1], colorArray[2]) + " 0%, " + cssRGB(255, colorArray[1], colorArray[2]) + " 100%)";
		sliders.rgb.g.style.background = "linear-gradient(to right, " + cssRGB(colorArray[0], 0, colorArray[2]) + " 0%, " + cssRGB(colorArray[0], 255, colorArray[2]) + " 100%)";
		sliders.rgb.b.style.background = "linear-gradient(to right, " + cssRGB(colorArray[0], colorArray[1], 0) + " 0%, " + cssRGB(colorArray[0], colorArray[1], 255) + " 100%)";
	},
};

var HSL = {
	get : function () {
		var hsl = boxes.hsl.all.map(function() {
			return parseInt(this.value, 10);
		}).get();
		var alpha = Alpha.get();
		if (alpha < 1) {
			hsl.push(alpha);
		}
		return hsl;
	},
	set : function (colorArray) {
		sliders.hsl.h.value = colorArray[0];
		sliders.hsl.s.value = colorArray[1];
		sliders.hsl.l.value = colorArray[2];
		boxes.hsl.h.value	= colorArray[0];
		boxes.hsl.s.value	= colorArray[1];
		boxes.hsl.l.value	= colorArray[2];
		this.updateSliderBG(colorArray);
	},
	updateSliderBG : function (colorArray) {
		sliders.hsl.s.style.background = "linear-gradient(to right, " + cssHSL(colorArray[0], 0, colorArray[2]) + " 0%, " + cssHSL(colorArray[0], colorArray[1], colorArray[2]) + " 100%)";
		sliders.hsl.l.style.background = "linear-gradient(to right, " + cssHSL(colorArray[0], colorArray[1], colorArray[2]) + " 0%, " + cssHSL(colorArray[0], colorArray[1], 100) + " 100%)";
	},
};

var Alpha = {
	get : function () {
		return parseFloat(boxes.alpha.value, 10);
	},
	set : function (value) {
		sliders.alpha.value	= value;
		boxes.alpha.value	= value;
	},
	updateSliderBG : function (colorArray) {
		sliders.alpha.style.background = "linear-gradient(to right, rgba(0,0,0,0) 0%, " + cssRGB.apply(this, colorArray) + " 100%)";
	},
};