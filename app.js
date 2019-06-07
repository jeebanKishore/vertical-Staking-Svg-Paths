/////////////////////////////Variables///////////////////////////
const maxWidth = 500;
const centerPoint = maxWidth / 2;
const svgns = 'http://www.w3.org/2000/svg';
const fontData = ['amita-bold', 'berkshireswash-regular', 'Carrington', 'Courgette-Regular', 'england', 'Milkshake'];
const font = [];
const FONT_SIZE = 52;
const inputTextArea = document.getElementById('inputArea');
const mainSVG = document.getElementById('mainSVG');
const group = document.getElementById('txtgrp');
let fontsLoaded = 0;
let totalFonts = 0;
let numoflines = 0;
let letterSpacing = 0;
let textLineArray = [];
let inputTextAreaValue = '';
let maxheight = 50;
let startHeight = 50;
let templateLineOffset = 5;
let allignMent = 'center';
let leftOffset = 5;
let rightOffset = 5;


////////////////////////Public Functiones///////////////////////
const continueLoadingFonts = (fontsLoaded, totalFonts) => {
    loadFont('assets/' + fontData[fontsLoaded] + '.ttf');
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

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const addTexts = () => {
    //alert('I am here.');
    inputTextAreaValue = inputTextArea.value;
    if (inputTextAreaValue === '') inputTextAreaValue = ' ';
    numoflines = inputTextAreaValue.split('\n').length - 1;
    textLineArray = inputTextAreaValue.split('\n');
    group.innerHTML = '';
    generateGroup(textLineArray.length, startHeight);
}

const leftAllign = () => {
    allignMent = 'left';
    addTexts();
}
const centerAllign = () => {
    allignMent = 'center';
    addTexts();
}
const rightAllign = () => {
    allignMent = 'right';
    addTexts();
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
    let finalHorizontalposition = centerPoint;
    let fillColour = getRandomColor();
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

    for (p = 0; p < textPaths.length; p++) {
        textPaths[p].fill = fillColour;
        textPaths[p].totalwidth = totalwidth;
        textPaths[p].maxheight = maxheight;
        textPaths[p].starty = starty;
        pathString += textPaths[p].toSVGPath();
    }

    switch (allignMent) {
        case 'left':
            finalHorizontalposition = leftOffset;
            if (group.lastElementChild) {
                const lastBoundBoxgroup = group.lastElementChild.getBBox();
                finalHeight = Math.round(lastBoundBoxgroup.height + nextheight + templateLineOffset);
            } else {
                finalHeight = nextheight;
            }
            group.innerHTML += '<g transform="translate(' + finalHorizontalposition + ',' + finalHeight + ')">' + pathString.trim() + '</g>';
            break;
        case 'right':
            finalHorizontalposition = maxWidth - (totalwidth + rightOffset);
            if (group.lastElementChild) {
                const lastBoundBoxgroup = group.lastElementChild.getBBox();
                finalHeight = Math.round(lastBoundBoxgroup.height + nextheight + templateLineOffset);
            } else {
                finalHeight = nextheight;
            }
            group.innerHTML += '<g transform="translate(' + finalHorizontalposition + ',' + finalHeight + ')">' + pathString.trim() + '</g>';
            break;
        case 'center':
            finalHorizontalposition = Math.round(centerPoint - (totalwidth / 2));
            if (group.lastElementChild) {
                const lastBoundBoxgroup = group.lastElementChild.getBBox();
                finalHeight = Math.round(lastBoundBoxgroup.height + nextheight + templateLineOffset);
            } else {
                finalHeight = nextheight;
            }
            group.innerHTML += '<g transform="translate(' + finalHorizontalposition + ',' + finalHeight + ')">' + pathString.trim() + '</g>';
            break;
        default:
            finalHorizontalposition = Math.round(centerPoint - (totalwidth / 2));
            if (group.lastElementChild) {
                const lastBoundBoxgroup = group.lastElementChild.getBBox();
                finalHeight = Math.round(lastBoundBoxgroup.height + nextheight + templateLineOffset);
            } else {
                finalHeight = nextheight;
            }
            group.innerHTML += '<g transform="translate(' + finalHorizontalposition + ',' + finalHeight + ')">' + pathString.trim() + '</g>';
    }
    generateGroup(numoflines, finalHeight);
}

window.onload = () => {
    totalFonts = fontData.length;
    continueLoadingFonts(fontsLoaded, totalFonts);
}