let defaultFontFamily = "Arial";
let charWidthRatiosDict = {};

let localFontSelect = document.querySelector("#local-fonts");

let uppercaseLettersBox = document.querySelector("#uppercase-letters");
let lowercaseLettersBox = document.querySelector("#lowercase-letters");
let digitsBox           = document.querySelector("#digits");
let otherCharsBox       = document.querySelector("#other-chars");

let uppercaseContainer  = document.querySelector("#uppercase-container");
let lowercaseContainer  = document.querySelector("#lowercase-container");
let digitsContainer     = document.querySelector("#digits-container");
let otherContainer      = document.querySelector("#other-container");

let output = {
    htmlWidth   : document.querySelector("#html-width"),
    htmlHeight  : document.querySelector("#html-height"),
    htmlLines   : document.querySelector("#html-lines"),
    calcWidth   : document.querySelector("#calc-width"),
    calcHeight  : document.querySelector("#calc-height"),
    calcLines   : document.querySelector("#calc-lines"),
    matchWidth  : document.querySelector("#match-width"),
    matchHeight : document.querySelector("#match-height"),
    matchLines  : document.querySelector("#match-lines"),
};

localFontSelect.addEventListener("input", changeFontFamily);

uppercaseLettersBox.addEventListener("input", printUppercaseLetters);
lowercaseLettersBox.addEventListener("input", printLowercaseLetters);
digitsBox.addEventListener("input", printDigits);
otherCharsBox.addEventListener("input", printOtherCharacters);
[
    uppercaseLettersBox,
    lowercaseLettersBox,
    digitsBox,
    otherCharsBox,
].forEach(el => el.dispatchEvent(new Event("input")));