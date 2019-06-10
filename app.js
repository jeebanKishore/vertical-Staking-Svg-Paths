/////////////////////////////Variables///////////////////////////
var maxWidth = 500;
var centerPoint = maxWidth / 2;
var svgns = 'http://www.w3.org/2000/svg';
var fontData = ['Amadeus.ttf', 'Amatic-Bold.ttf', 'AmaticSC-Regular.ttf', 'AppertoAlternateGoth3D.ttf', 'BOYCOTT_.ttf', 'Capture_it.ttf', 'Carrington.ttf', 'Courgette-Regular.ttf', 'DISTGRG_.ttf', 'DJB Letter Game Tiles 3.ttf', 'FancyPants.ttf', 'Flavors-Regular.ttf', 'GREALN__.ttf', 'Gondola_SD-Swash.ttf', 'Gondola_SD.ttf', 'HVD_Bodedo.ttf', 'HVD_Poster.ttf', 'Homestead-Display.ttf', 'Impact_Label.ttf', 'KOMIKAX_.ttf', 'Komika_Hand_Italic.ttf', 'Kristi.ttf', 'Matiz.ttf', 'Milkshake.ttf', 'Monthoers.ttf', 'Ostrich Rounded.ttf', 'PermanentMarker.ttf', 'PlayfairDisplaySC-Regular.ttf', 'SF_Toontime_Bold.ttf', 'Starstrp.ttf', 'TheanoDidot-Regular.ttf', 'TrashHand.ttf', 'TungusFont_Tinet.ttf', 'UnitedStates.ttf', 'Windsong.ttf', 'againts.ttf', 'amita-bold.ttf', 'berkshireswash-regular.ttf', 'edo.ttf', 'england.ttf', 'gagalin.ttf', 'garto16.ttf', 'porter-sans-inline-block-webfont.ttf', 'sedgwick_co.ttf'];
var font = [];
var FONT_SIZE = 52;
var inputTextArea = document.getElementById('inputArea');
inputTextArea.value = "Apple\nGoogle\nMicrosoft\nDELL\nIBM\nHP\nLENOVO\nASUS\nGIGABYTE"
var mainSVG = document.getElementById('mainSVG');
var group = document.getElementById('txtgrp');
var testgrp = document.getElementById('testgrp');
var fontsLoaded = 0;
var totalFonts = 0;
var numoflines = 0;
var letterSpacing = 0;
var textLineArray = [];
var inputTextAreaValue = '';
var maxheight = 50;
var startHeight = 10;
var templateLineOffset = 5;
var allignMent = 'center';
var leftOffset = 5;
var rightOffset = 5;
////////////////////////Public Functiones///////////////////////

var continueLoadingFonts = function continueLoadingFonts(fontsLoaded, totalFonts) {
    loadFont('assets/' + fontData[fontsLoaded]);
};

var loadFont = function loadFont(ttfpath) {
    opentype.load(ttfpath, function(err, _font) {
        tempfont = _font;
        font.push(tempfont);
        fontsLoaded++;

        if (fontsLoaded < totalFonts) {
            continueLoadingFonts(fontsLoaded, totalFonts);
        } else {
            document.getElementById('controlPanel').style.cssText = 'display: block';
        }
    });
};

var getRandomColor = function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};

var randomIntFromInterval = function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

var addTexts = function addTexts() {
    inputTextAreaValue = inputTextArea.value;
    if (inputTextAreaValue === '')
        inputTextAreaValue = ' ';
    numoflines = inputTextAreaValue.split('\n').length - 1;
    textLineArray = inputTextAreaValue.split('\n');
    group.innerHTML = '';
    generateGroup(textLineArray.length, startHeight);
};

var leftAllign = function leftAllign() {
    allignMent = 'left';
    addTexts();
};

var centerAllign = function centerAllign() {
    allignMent = 'center';
    addTexts();
};

var rightAllign = function rightAllign() {
    allignMent = 'right';
    addTexts();
};

var generateGroup = function generateGroup(numoflines, nextheight) {
    if (numoflines !== 0) {
        var textFromLineArray = textLineArray[textLineArray.length - (numoflines - 1) - 1];
        numoflines--;
        constructPath(FONT_SIZE, randomIntFromInterval(0, totalFonts - 1), textFromLineArray, numoflines, nextheight);
    }
};

var constructPath = function constructPath(fontSize, fontPositionNumber, textFromLineArray, numoflines, nextheight) {
    var tempselectedfont = font[fontPositionNumber];
    var textPaths = tempselectedfont.getPath(textFromLineArray, 0, fontSize, fontSize, {
        letterSpacing: letterSpacing
    });
    var pathString = '';
    var totalwidth = 0;
    var starty = 1000;
    var maxLetters = 0;
    var finalHeight = nextheight;
    var finalHorizontalposition = centerPoint;
    var fillColour = getRandomColor();

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

    testgrp.innerHTML = pathString.trim();
    var textpathbbox = testgrp.getBBox();

    switch (allignMent) {
        case 'left':
            finalHorizontalposition = leftOffset;
            break;

        case 'right':
            finalHorizontalposition = maxWidth - (totalwidth + rightOffset);
            break;

        case 'center':
            finalHorizontalposition = Math.round(centerPoint - totalwidth / 2);
            break;

        default:
            finalHorizontalposition = Math.round(centerPoint - totalwidth / 2);
    }

    if (group.lastElementChild) {
        var lastBoundBoxgroup = group.lastElementChild.getBBox();
        finalHeight = Math.round(lastBoundBoxgroup.height + nextheight + templateLineOffset);
    } else {
        finalHeight = nextheight;
    }

    group.innerHTML += '<g transform="translate(' + finalHorizontalposition + ',' + (finalHeight - textpathbbox.y) + ')">' + pathString.trim() + '</g>';

    generateGroup(numoflines, finalHeight);
};

window.onload = function() {
    totalFonts = fontData.length;
    continueLoadingFonts(fontsLoaded, totalFonts);
};