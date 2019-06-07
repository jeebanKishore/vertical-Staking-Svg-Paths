/////////////////////////////Variables///////////////////////////
const MAX_WIDTH = 500;
const svgns = 'http://www.w3.org/2000/svg';
const fontData = [{ 'name': 'BlackOpsOne', 'value': 'BlackOpsOne' }, { 'name': 'charlotte', 'value': 'charlotte' }, { 'name': 'Great Times Font', 'value': 'Great Times Font' }, { 'name': 'StellaAlpina', 'value': 'StellaAlpina' }];
const font = [];
const FONT_SIZE = 72;
const inputTextArea = document.getElementById('inputArea');
const mainSVG = document.getElementById('mainSVG');
const pt = mainSVG.createSVGPoint();
pt.x = 100;
pt.y = 200;
var mainSVGP = pt.matrixTransform(mainSVG.getScreenCTM().inverse());
const group = document.getElementById('txtgrp');
let fontsLoaded = 0;
let totalFonts = 0;
let numoflines = 0;
let letterSpacing = 0;
let mergedd = '';
let textLineArray = [];
let inputTextAreaValue = '';
let maxheight = 100;
let startHeight = 100;


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

const addTexts = () => {
    //alert('I am here.');
    inputTextAreaValue = inputTextArea.value;
    if (inputTextAreaValue === '') inputTextAreaValue = ' ';
    numoflines = inputTextAreaValue.split('\n').length - 1;
    textLineArray = inputTextAreaValue.split('\n');
    generateGroup(textLineArray.length, startHeight);
}

const generateGroup = (numoflines, nextheight) => {
    if (numoflines !== 0) {
        const textFromLineArray = textLineArray[(textLineArray.length - (numoflines - 1)) - 1];
        numoflines--;
        constructPath(FONT_SIZE, randomIntFromInterval(0, totalFonts - 1), textFromLineArray, numoflines, nextheight);
    }
}


const constructPath = (fontSize, fontPositionNumber, textFromLineArray, numoflines, nextheight) => {
    let tempselectedfont = font[fontPositionNumber];
    let textPaths = tempselectedfont.getPath(textFromLineArray, 0, fontSize, fontSize, { letterSpacing: letterSpacing });
    let pathString = '';
    let totalwidth = 0;
    let starty = 1000;
    let maxLetters = 0;
    let finalHeight = nextheight;
    for (t = 0; t < textLineArray.length; t++) {
        maxLetters = Math.max(textLineArray[t].length, maxLetters);
    }
    for (i = 0; i < textPaths.length; i++) {
        if (i <= maxLetters) {
            totalwidth += textPaths[i].width + letterSpacing;
        }

        maxheight = Math.min(maxheight, textPaths[i].height);
        if (textPaths[i].starty) {
            starty = Math.min(starty, textPaths[i].starty);
        }
    }
    mergedd = '';
    for (p = 0; p < textPaths.length; p++) {
        textPaths[p].fill = 'red';
        textPaths[p].totalwidth = totalwidth;
        textPaths[p].maxheight = maxheight;
        textPaths[p].starty = starty;
        pathString += textPaths[p].toSVGPath();
        mergedd += textPaths[p].toSVGPathd() + ' ';
    }
    var tempGroup = document.createElementNS(svgns, 'g');
    if (group.lastElementChild) {
        const lastBoundBoxgroup = group.lastElementChild.getBBox();
        finalHeight = Math.round(lastBoundBoxgroup.height + nextheight + 5);
    } else {
        finalHeight = nextheight;
    }
    console.log(finalHeight);
    //tempGroup.setAttributeNS('http://www.w3.org/2000/svg', 'style', 'transform: translate(10, ' + finalHeight + ');');

    group.innerHTML += '<g transform="translate(10,' + finalHeight + ')">' + pathString.trim() + '</g>';
    //tempGroup.setAttributeNS(svgns, 'transform', 'translate(10,' + finalHeight + ')');
    //group.appendChild(tempGroup);
    generateGroup(numoflines, finalHeight);
}

window.onload = () => {
    totalFonts = fontData.length;
    continueLoadingFonts(fontsLoaded, totalFonts);
}