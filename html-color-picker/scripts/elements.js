var IO = {
	preview	: $(".layer:not(.blank)")[0],
	hex		: $("#cssHEX")[0],
	rgb		: $("#cssRGB")[0],
	hsl		: $("#cssHSL")[0],
};

var sliders = {
	rgb : {
		all	: $(".color-model.rgb input[type='range']"),
	},
	hsl : {
		all	: $(".color-model.hsl input[type='range']"),
	},
	alpha	: $(".color-model.alpha input[type='range']")[0],
};
sliders.rgb.r = sliders.rgb.all[0];
sliders.rgb.g = sliders.rgb.all[1];
sliders.rgb.b = sliders.rgb.all[2];
sliders.hsl.h = sliders.hsl.all[0];
sliders.hsl.s = sliders.hsl.all[1];
sliders.hsl.l = sliders.hsl.all[2];

var boxes = {
	rgb : {
		all	: $(".color-model.rgb input[type='number']"),
	},
	hsl : {
		all	: $(".color-model.hsl input[type='number']"),
	},
	alpha	: $(".color-model.alpha input[type='number']")[0],
};
boxes.rgb.r = boxes.rgb.all[0];
boxes.rgb.g = boxes.rgb.all[1];
boxes.rgb.b = boxes.rgb.all[2];
boxes.hsl.h = boxes.hsl.all[0];
boxes.hsl.s = boxes.hsl.all[1];
boxes.hsl.l = boxes.hsl.all[2];