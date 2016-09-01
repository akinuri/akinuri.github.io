$('input[type="number"]').on("input", function() {
	validateInput(this);
	colorPicker(this);
});

$('input[type="number"]').on("keydown", function(e) {
	validateInput(this, e);
});

$('input[type="range"]').on("input", function() {
	colorPicker(this);
});

function validateInput(elm, e) {
	if (e) {
		if (!isFloat(elm.step)) {
			if (e.key == ".") {
				e.preventDefault();
			}
		}
	}
	else {
		while (elm.value.length > 1 && elm.value[0] === "0") {
			elm.value = elm.value.slice(1);
		}
		if (elm.validity.rangeUnderflow) {
			elm.value = elm.min;
		}
		else if (elm.validity.rangeOverflow) {
			elm.value = elm.max;
		}
	}
	if (elm.value == "") {
		elm.value = elm.min;
	}
}

$(window).on("wheel", function(e) {
	var focused = document.activeElement;
	if (focused.nodeName='input' && focused.type && focused.type.match(/number/)) {
		e.preventDefault();
		var value = parseFloat(focused.value, 10);
		var step  = parseFloat(focused.step);
		if (e.originalEvent.deltaY < 0) {
			value += step;
			if (value > focused.max) {
				value = focused.max;
			}
		} else {
			value -= step;
			if (value < focused.min) {
				value = focused.min;
			}
		}
		if (isFloat(value)) {
			value = parseFloat(value.toFixed(2));
		}
		focused.value = value;
		$(focused).trigger("input");
	}
});

function isFloat(f) {
	var f		 = parseFloat(f);
	var floor	 = Math.floor(f);
	var fraction = f - floor;
	if (fraction > 0) {
		return true;
	}
	return false;
}

function isInteger(x) {
	var integer = parseInt(x, 10);
	if (!isNaN(integer) && !isFloat(x)) {
		return true;
	}
	return false;
}