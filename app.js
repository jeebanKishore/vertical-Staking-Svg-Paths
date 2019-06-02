/////////////////////////////Variables///////////////////////////
const MAX_WIDTH = 500;
const svgView = document.getElementById('svgView');
const SVGContainer = document.getElementById('svgContainer');
const imageViewContainer = document.getElementById('imageViewContainer');
const mainSVGElement = document.getElementById('mainSVG');
const primarySVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
primarySVG.setAttributeNS('http://www.w3.org/2000/svg', 'id', 'mainSVG');
primarySVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
primarySVG.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
primarySVG.setAttribute('height', '500');
primarySVG.setAttribute('width', '500');
primarySVG.setAttributeNS('http://www.w3.org/2000/svg', 'viewBox', '0 0 500 500');
const mainDef = document.createElementNS('http://www.w3.org/2000/svg', 'def');
mainDef.setAttributeNS('http://www.w3.org/2000/svg', 'id', 'mainDef');
const fontData = [{ 'name': 'BlackOpsOne', 'value': 'BlackOpsOne' }, { 'name': 'charlotte', 'value': 'charlotte' }, { 'name': 'Great Times Font', 'value': 'Great Times Font' }, { 'name': 'StellaAlpina', 'value': 'StellaAlpina' }];
const font = [];
const FONT_SIZE = 50;
const inputTextArea = document.getElementById('inputArea');
const defsContainer = document.getElementById('defsContainer');
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

const setImageToSVG = (img, svg) => {
    var xml = (new XMLSerializer).serializeToString(svg);
    img.src = "data:image/svg+xml;charset=utf-8," + xml;
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
    while (SVGContainer.firstChild) {
        SVGContainer.removeChild(SVGContainer.firstChild);
    }
    while (primarySVG.firstChild) {
        primarySVG.removeChild(primarySVG.firstChild);
    }
    primarySVG.appendChild(mainDef);
    tempBBox = constructPath(inputTextAreaValue, FONT_SIZE, randomIntFromInterval(0, totalFonts - 1), lineNumber, textFromLineArray);
    allBbox.push(tempBBox);
    console.log(allBbox, primarySVG);

}


const constructPath = (text, fontSize, fontPositionNumber, lineNumber, textFromLineArray) => {
    const tempselectedfont = font[fontPositionNumber];
    let textPaths = tempselectedfont.getPath(textFromLineArray, 0, fontSize * lineNumber, fontSize, { letterSpacing: letterSpacing });
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const groupID = 'txtgrp' + lineNumber;
    group.setAttributeNS('http://www.w3.org/2000/svg', 'id', groupID);
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
        if (p < pathlen)
            rgb = Math.min(100 + Math.ceil(p * 150 / pathlen), 255);
        else
            rgb = Math.min(100 + Math.ceil((2 * pathlen - p) * 150 / (pathlen)), 255);
        textPaths[p].totalwidth = totalwidth;
        textPaths[p].maxheight = maxheight;
        textPaths[p].starty = starty;
        pathString += textPaths[p].toSVGPath();
        mergedd += textPaths[p].toSVGPathd() + ' ';
    }
    const bbox = group.getBBox();
    group.innerHTML += pathString.trim();
    while (mainDef.firstChild) {
        mainDef.removeChild(mainDef.firstChild);
    }
    mainDef.appendChild(group);
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + groupID);
    use.setAttributeNS('http://www.w3.org/2000/svg', 'x', '100');
    use.setAttributeNS('http://www.w3.org/2000/svg', 'y', '100');
    primarySVG.appendChild(use);
    //setImageToSVG(mainImage,primarySVG);
    SVGContainer.appendChild(primarySVG);
    svg = SVGContainer.innerHTML;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const image = svgView;
    image.addEventListener('load', () => {URL.revokeObjectURL(url), { once: true };});
    image.src = url;
    return bbox;
}

window.onload = () => {
    totalFonts = fontData.length;
    continueLoadingFonts(fontsLoaded, totalFonts);
}