/////////////////////////////Variables///////////////////////////
const textArea = document.getElementById('inputArea');
const MAX_WIDTH = 500;
const svgns = 'http://www.w3.org/2000/svg';
const canvas = document.getElementById('cnv');
const ctx = canvas.getContext('2d');
const fontData = [{ "name": "Amatic-Bold", "value": "Amatic-Bold" }, { "name": "belligerent", "value": "belligerent" }, { "name": "Blokletters-Viltstift", "value": "Blokletters-Viltstift" }, { "name": "desyrel", "value": "desyrel" }, { "name": "justanotherhand-regular", "value": "justanotherhand-regular" }];
const font = [];
let fontsLoaded = 0;
let totalFonts = 0;

const continueLoadingFonts = (fontsLoaded, totalFonts) => {
    loadFont('assets/' + fontData[fontsLoaded].value + '.ttf');
}

const loadFont = (ttfpath) => {
    opentype.load(ttfpath, function(err, _font) {
        tempfont = _font;
        font.push(tempfont);
        fontsLoaded++;
        if (fontsLoaded < totalFonts) {
            continueLoadingFonts(fontsLoaded, totalFonts);
        } else {
            //txtarea = document.getElementById('text_input');
            //textgrp = document.getElementById('txtgrp');
            //$scope.onTextChange();
        }

    });
}

window.onload = () => {
    /* setTimeout(function() {
        var t = performance.timing;
        console.log(t.loadEventEnd - t.responseEnd);
    }, 0); */
    //loadFont('fonts/' + $scope.selectedfont + '.ttf');
    totalFonts = fontData.length;
    continueLoadingFonts(fontsLoaded, totalFonts);
}