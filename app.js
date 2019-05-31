/////////////////////////////Variables///////////////////////////
const MAX_WIDTH = 500;
const svgns = 'http://www.w3.org/2000/svg';
const fontData = [{ 'name': 'BlackOpsOne', 'value': 'BlackOpsOne' }, { 'name': 'charlotte', 'value': 'charlotte' }, { 'name': 'Great Times Font', 'value': 'Great Times Font' }, { 'name': 'StellaAlpina', 'value': 'StellaAlpina' }];
const font = [];
const FONT_SIZE = 90;
const inputTextArea = document.getElementById('inputArea');
let fontsLoaded = 0;
let totalFonts = 0;
let numoflines = 0;
let letterSpacing = 0;
let mergedd = '';
let textLineArray = [];
let inputTextAreaValue = '';


////////////////////////Public Functiones///////////////////////
const continueLoadingFonts = (fontsLoaded, totalFonts) => {
    loadFont('assets/' + fontData[fontsLoaded].value + '.otf');
}

const loadFont = (ttfpath) => {
    opentype.load(ttfpath, (err, _font) => {
        tempfont = _font;
        font.push(tempfont);
        fontsLoaded++;
        if (fontsLoaded < totalFonts) {
            continueLoadingFonts(fontsLoaded, totalFonts);
        } else {
            document.getElementById('controlPanel').style.cssText = 'display: block';
        }
    });
}

const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const getLineNumber = () => inputTextAreaValue.substr(0, inputTextArea.selectionStart).split('\n').length;

const addTexts = () => {
    //alert('I am here.');
    inputTextAreaValue = inputTextArea.value;
    if (inputTextAreaValue === '') inputTextAreaValue = ' ';
    numoflines = inputTextAreaValue.split('\n').length - 1;
    const lineNumber = getLineNumber();
    textLineArray = inputTextAreaValue.split('\n');
    const textFromLineArray = textLineArray[lineNumber - 1];
    const allBbox = [];
    tempBBox = measureText(inputTextAreaValue, FONT_SIZE, randomIntFromInterval(0, totalFonts - 1), lineNumber, textFromLineArray);
    allBbox.push(tempBBox);
    console.log(allBbox);

}


const measureText = (text, fontSize, fontPositionNumber, lineNumber, textFromLineArray) => {
    let tempselectedfont = font[fontPositionNumber];
    let textPaths = tempselectedfont.getPath(textFromLineArray, 0, fontSize * lineNumber, fontSize, { letterSpacing: letterSpacing });
    const group = document.getElementById('txtgrp');
    group.innerHTML = '';
    let pathString = '';
    let totalwidth = 0;
    let maxheight = 0;
    let starty = 1000;
    let maxLetters = 0;
    for (t = 0; t < textLineArray.length; t++) {
        maxLetters = Math.max(textLineArray[t].length, maxLetters);
    }
    //console.log(maxLetters);
    for (i = 0; i < textPaths.length; i++) {
        if (i <= maxLetters) {
            totalwidth += textPaths[i].width + letterSpacing;
        }

        maxheight = Math.max(maxheight, textPaths[i].height);
        if (textPaths[i].starty) {
            starty = Math.min(starty, textPaths[i].starty);
        }
    }
    const pathlen = textPaths.length / 2;
    mergedd = '';
    for (p = 0; p < textPaths.length; p++) {
        textPaths[p].fill = 'red';
        //if($scope.patternselected.indexOf('#') != -1)
        //textPaths[p].fill = 'url(#'+ $scope.patternselected +')';
        //else
        //textPaths[p].fill = $scope.patternselected;
        //textPaths[p].fill = 'url(#'+$scope.patternselected+')';
        //textPaths[p].fill = '#'+Math.floor(Math.random()*16777215).toString(16);
        if (p < pathlen)
            rgb = Math.min(100 + Math.ceil(p * 150 / pathlen), 255);
        else
            rgb = Math.min(100 + Math.ceil((2 * pathlen - p) * 150 / (pathlen)), 255);
        textPaths[p].totalwidth = totalwidth;
        textPaths[p].maxheight = maxheight;
        textPaths[p].starty = starty;
        //textPaths[p].arttype = $scope.artselected;
        //textPaths[p].shapeData = shapeData;
        pathString += textPaths[p].toSVGPath();
        mergedd += textPaths[p].toSVGPathd() + ' ';
    }

    //scalerect.setAttributeNS(svgns, 'width', maxheight);
    //scalerect.setAttributeNS(svgns, 'height', maxheight);
    //scalerect.setAttributeNS(svgns, 'y', starty);
    group.innerHTML += pathString.trim();
    const bbox = group.getBBox();
    return bbox;
    //generateShadow(0);
}

window.onload = () => {
    /* setTimeout(function() {
        var t = performance.timing;
        console.log(t.loadEventEnd - t.responseEnd);
    }, 0); */
    totalFonts = fontData.length;
    continueLoadingFonts(fontsLoaded, totalFonts);
}