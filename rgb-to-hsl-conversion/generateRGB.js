function generateRGB(min, max) {
	min = min || 0;
	max = max || 255;
	var rgb = [];
	for (var i = 0; i < 3; i++) {
		rgb.push(random(min, max));
	}
	return rgb;
}

function random() {
	if (arguments.length > 2) {
		return 0;
	}
	switch (arguments.length) {
		case 0:
			return Math.random();
		case 1:
			return Math.round(Math.random() * arguments[0]);
		case 2:
			var min = arguments[0];
			var max = arguments[1];
			return Math.round(Math.random() * (max - min) + min);
	}
}