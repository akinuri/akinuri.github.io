function colorPicker(activeElem) {
	if (activeElem) {
		switch (activeElem.type) {
			case "number":
				$(activeElem).closest("td").prev().find("input").val(activeElem.value);
				break;
			case "range":
				$(activeElem).closest("td").next().find("input").val(activeElem.value);
				break;
		}
		var activeModel = $(activeElem).closest(".color-model")[0].classList[1];
		updateColorValues(activeModel);
	}
	var color = RGB.get();
	updatePreview(color);
	updateIO(color);
}

function updateColorValues(activeColorModel) {
	switch (activeColorModel) {
		case "rgb":
			var rgb = RGB.get();
			RGB.updateSliderBG(rgb);
			HSL.set(rgb2hsl.apply(this, rgb));
			Alpha.updateSliderBG(rgb);
			break;
		case "hsl":
			var hsl = HSL.get();
			var rgb = hsl2rgb.apply(this, hsl);
			HSL.updateSliderBG(hsl);
			RGB.set(rgb);
			Alpha.updateSliderBG(rgb);
			break;
	}
}

function updatePreview(colorArray) {
	IO.preview.style.backgroundColor = cssRGB.apply(this, colorArray);
}

function updateIO(colorArray) {
	IO.rgb.value = cssRGB.apply(this, colorArray);
	IO.hex.value = rgb2hex(colorArray);
	IO.hsl.value = cssHSL.apply(this, rgb2hsl.apply(this, colorArray));
}