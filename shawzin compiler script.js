const translateBtn = document.getElementById('translate');
const notesInput = document.getElementById('notes-input');
const copyBtn = document.getElementById('copy-code');
const scaleSelector = document.getElementById('scale-selector');
const showScaleBtn = document.getElementById('show-scale');
const scaleDisplay = document.getElementById('scale-display');
const scaleNotes = document.getElementById('scale-notes');
copyBtn.style.disabled = true;
const findTimingRegex = /[0-9]+/;
const findNoteRegex = /\D+/i;
const findDoubleNoteRegex = /[a-z]+[+]+[a-z]+/i;
const findTripleNoteRegex = /[a-z]+[+]+[a-z]+[+]+[a-z]+/i;
const timingConvertRules = 
['A','B','C','D','E','F','G','H','I','J','K','L','M',
'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
'a','b','c','d','e','f','g','h','i','j','k','l','m',
'n','o','p','q','r','s','t','u','v','w','x','y','z',
'0','1','2','3','4','5','6','7','8','9','+','/'];
Object.freeze(timingConvertRules);
const noteConvertRules = [
{lc:'B', lds:'C', lf:'E', lg:'J', las:'K', mc:'M',
mds:'R', mf:'S', mg:'U', mas:'h', hc:'i', hds:'k'},
{lc:'B', ld:'C', le:'E', lg:'J', la:'K', mc:'M', 
md:'R', me:'S', mg:'U', ma:'h', hc:'i', hd:'k'},
{lc:'B', lcs:'C', ld:'E', lds:'J', le:'K', lf:'M', 
lfs:'R', lg:'S', lgs:'U', la:'h', las:'i', lb:'k'},
{lc:'B', lds:'C', lf:'E', lfs:'J', lg:'K', las:'M', 
mc:'R', mds:'S', mf:'U', mfs:'h', mg:'i', mas:'k'},
{lc:'B', ld:'C', le:'E', lf:'J', lg:'K', la:'M', 
lb:'R', mc:'S', md:'U', me:'h', mf:'i', mg:'k'},
{lc:'B', ld:'C', lds:'E', lf:'J', lg:'K', lgs:'M', 
las:'R', mc:'S', md:'U', mds:'h', mf:'i', mg:'k'},
{lc:'B', lcs:'C', lf:'E', lfs:'J', las:'K', mc:'M', 
mcs:'R', mf:'S', mfs:'U', ma:'h', hc:'i', hcs:'k'},
{lc:'B', lcs:'C', le:'E', lf:'J', lg:'K', lgs:'M', 
las:'R', mc:'S', mcs:'U', me:'h', mf:'i', mg:'k'}
]
Object.freeze(noteConvertRules);
const multiNoteConvertRules = [
{lgmds:'Z', mdsmas:'x', lgmas:'p', lgmdsmas:'5', lasmf:'a', mfhc:'y', 
lashc:'q', lasmfhc:'6', mcmg:'c', mghds:'0', mchds:'s', mcmghds:'8'},
{lgmd:'Z', mdma:'x', lgma:'p', lgmdma:'5', lame:'a', mehc:'y',
lahc:'q', lamehc:'6', mcmg:'c', mghd:'0', mchd:'s', mcmghd:'8'},
{ldslfs:'Z', lfsla:'x', ldsla:'p', ldslfsla:'5', lelg:'a', lglas:'y', 
lelas:'q', lelglas:'6', lflgs:'c', lgslb:'0', lflb:'s', lflgslb:'8'},
{lfsmc:'Z', mcmfs:'x', lfsmfs:'p', lfsmcmfs:'5', lgmds:'a', mdsmg:'y',
lgmg:'q', lgmdsmg:'6', lasmf:'c', mfmas:'0', lasmas:'s', lasmfmas:'8'},
{lflb:'Z', lbme:'x', lfme:'p', lflbme:'5', lgmc:'a', mcmf:'y',
lgmf:'q', lgmcmf:'6', lamd:'c', mdmg:'0', lamg:'s', lamdmg:'8'},
{lflas:'Z', lasmds:'x', lfmds:'p', lflasmds:'5', lgmc:'a', mcmf:'y',
lgmf:'q', lgmcmf:'6', lgsmd:'c', mdmg:'0', lgsmg:'s', lgsmdmg:'8'},
{lfsmcs:'Z', mcsma:'x', lfsma:'p', lfsmcsma:'5', lasmf:'a', mfhc:'y',
lashc:'q', lasmfhc:'6', mcmfs:'c', mfshcs:'0', mchcs:'s', mcmfshcs:'8'},
{lflas:'Z', lasme:'x', lfme:'p', lflasme:'5', lgmc:'a', mcmf:'y',
lgmf:'q', lgmcmf:'6', lgsmcs:'c', mcsmg:'0', lgsmg:'s', lgsmcsmg:'8'},
]
Object.freeze(multiNoteConvertRules);
let finalCode = [];
let showScaleClicks = 0;
let WrongNote = false;

translateBtn.addEventListener('click', translateNotes);
translateBtn.addEventListener('click', errorStyle);
copyBtn.addEventListener('click', copyCode);
showScaleBtn.addEventListener('click', showScale);
scaleSelector.addEventListener('click', changeScale);

if (copyBtn.style.disabled === true) {
	copyBtn.style.border = "3px dotted black";
	copyBtn.style.background = "grey";
}

//Translates each note after a comma.
function translateNotes() {
	finalCode.splice(0, 999999);
	let notes = notesInput.value.split(',');
	for (let i=0; i<notes.length; i++) {
		let timing = false; 
		let note = false; 
		try {
			timing = Number(notes[i].match(findTimingRegex)[0]) - 1;
			note = notes[i].toLowerCase().match(findNoteRegex)[0];
		} finally {
			if (timing != false && note != false) {
				WrongNote = false;
			} else {
				WrongNote = true;
				errorStyle;
				alert("Error: Timing or note #"+(i+1)+" is incorrect/missing.");
			}
		}
		if (WrongNote === true) {
			break;
		}
		convertNote(note, i+1);
		convertTiming(timing, i+1);
	}
	finalCode.unshift(Number(scaleSelector.value) + 1);
	console.log(finalCode);
}

//Converts timing into shawzin code: ranges from [AA-AZ, Aa-Az, A0-A9, A+, A/] to [/A-/Z, /a-/z, /0-/9, /+, //]
function convertTiming(timing, position) {
	if (timing === -1) {
		WrongNote = true;
		errorStyle;
		alert('Error: start first note position from 1.');
	} else if (timing < 64 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing]);
	} else if (timing < 64*2 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64]);
	} else if (timing < 64*3 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*2]);
	} else if (timing < 64*4 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*3]);
	} else if (timing < 64*5 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*4]);
	} else if (timing < 64*6 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*5]);
	} else if (timing < 64*7 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*6]);
	} else if (timing < 64*8 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*7]);
	} else if (timing < 64*9 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*8]);
	} else if (timing < 64*10 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*9]);
	} else if (timing < 64*11 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*10]);
	} else if (timing < 64*12 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*11]);
	} else if (timing < 64*13 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*12]);
	} else if (timing < 64*14 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*13]);
	} else if (timing < 64*15 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*14]);
	} else if (timing < 64*16 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*15]);
	} else if (timing < 64*17 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*16]);
	} else if (timing < 64*18 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*17]);
	} else if (timing < 64*19 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*18]);
	} else if (timing < 64*20 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*19]);
	} else if (timing < 64*21 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*20]);
	} else if (timing < 64*22 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*21]);
	} else if (timing < 64*23 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*22]);
	} else if (timing < 64*24 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*23]);
	} else if (timing < 64*25 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*24]);
	} else if (timing < 64*26 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*25]);
	} else if (timing < 64*27 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*26]);
	} else if (timing < 64*28 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*27]);
	} else if (timing < 64*29 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*28]);
	} else if (timing < 64*30 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*29]);
	} else if (timing < 64*31 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*30]);
	} else if (timing < 64*32 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*31]);
	} else if (timing < 64*33 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*32]);
	} else if (timing < 64*34 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*33]);
	} else if (timing < 64*35 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*34]);
	} else if (timing < 64*36 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*35]);
	} else if (timing < 64*37 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*36]);
	} else if (timing < 64*38 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*37]);
	} else if (timing < 64*39 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*38]);
	} else if (timing < 64*40 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*39]);
	} else if (timing < 64*41 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*40]);
	} else if (timing < 64*42 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*41]);
	} else if (timing < 64*43 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*42]);
	} else if (timing < 64*44 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*43]);
	} else if (timing < 64*45 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*44]);
	} else if (timing < 64*46 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*45]);
	} else if (timing < 64*47 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*46]);
	} else if (timing < 64*48 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*47]);
	} else if (timing < 64*49 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*48]);
	} else if (timing < 64*50 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*49]);
	} else if (timing < 64*51 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*50]);
	} else if (timing < 64*52 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*51]);
	} else if (timing < 64*53 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*52]);
	} else if (timing < 64*54 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*53]);
	} else if (timing < 64*55 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*54]);
	} else if (timing < 64*56 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*55]);
	} else if (timing < 64*57 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*56]);
	} else if (timing < 64*58 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*57]);
	} else if (timing < 64*59 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*58]);
	} else if (timing < 64*60 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*59]);
	} else if (timing < 64*61 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*60]);
	} else if (timing < 64*62 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*61]);
	} else if (timing < 64*63 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*62]);
	} else if (timing < 64*64 && timing > -1) {
		finalCode.push(timingConvertRules[Math.floor(timing/64)]+timingConvertRules[timing-64*63]);
	} else { 
		WrongNote = true;
		errorStyle;
		alert("Error: Wrong timeline position, note #"+position+" range must be 1-4096.") 
	}
}

//Checks and converts note, if impossible throws error
function convertNote(note, position) {
	if (note.includes('+')) {
		console.log('includes plus');
		try {
			let multiNote = note.split('+').join('');
			let multiResult = multiNoteConvertRules[scaleSelector.value][multiNote];
			if (multiResult != undefined) {
				finalCode.push(multiResult);
				WrongNote = false;
			} else {
				throw new NoteDoesntExist("Error: Notes #" + position + " can't be played together.");
			}
		} catch (error) {
			WrongNote = true;
			errorStyle;
			alert(error);
		}
	} else {
		let result = noteConvertRules[scaleSelector.value][note];
		try {
			if (result != undefined) {
				finalCode.push(result);
				WrongNote = false;
			} else {
				throw new NoteDoesntExist("Note #" + position + " doesn't exist on this scale.");
			}
		} catch (error) {
			WrongNote = true;
			errorStyle;
			alert(error);
		}
	}
}

//Shows\hides scale
function showScale() {
	showScaleClicks+=1;
	if (showScaleClicks % 2 === 0) {
		showScaleBtn.value = 'Hide scale';
		scaleDisplay.style.opacity = '100';
	} else {
		showScaleBtn.value = 'Show scale';
		scaleDisplay.style.opacity = '0';
	}	
} 

//Changes scale key-value pairs
function changeScale() {
	if (scaleSelector.value === '0') {
		scaleNotes.innerText = 'HDS | HC | MAS | MG | MF | MDS | MC | LAS | LG | LF | LDS | LC';
	} else if (scaleSelector.value === '1') {
		scaleNotes.innerText = 'HD | HC | MA | MG | ME | MD | MC | LA | LG | LE | LD | LC';
	} else if (scaleSelector.value === '2') {
		scaleNotes.innerText = 'LB | LAS | LA | LGS | LG | LFS | LF | LE | LDS | LD | LCS | LC';
	} else if (scaleSelector.value === '3') {
		scaleNotes.innerText = 'MAS | MG | MFS | MF | MDS | MC | LAS | LG | LFS | LF | LDS | LC';
	} else if (scaleSelector.value === '4') {
		scaleNotes.innerText = 'MG | MF | ME | MD | MC | LB | LA | LG | LF | LE | LD | LC';
	} else if (scaleSelector.value === '5') {
		scaleNotes.innerText = 'MG | MF | MDS | MD | MC | LAS | LGS | LG | LF | LDS | LD | LC';
	} else if (scaleSelector.value === '6') {
		scaleNotes.innerText = 'HCS | HC | MA | MFS | MF | MCS | MC | LAS | LFS | LF | LCS | LC';
	} else if (scaleSelector.value === '6') {
		scaleNotes.innerText = 'MG | MF | ME | MCS | MC | LAS | LGS | LG | LF | LE | LCS | LC';
	}
}

//Copies final code to clipboard
function copyCode() {
	result = finalCode.join('');
	if (copyBtn.style.disabled === false) {
		navigator.clipboard.writeText(result);
	} 
}

//Style changes if error occurs.
function errorStyle() {
	if (WrongNote === false) {
		translateBtn.style.border = "revert-layer";
		copyBtn.style.disabled = false;
		copyBtn.style.border = "revert-layer";
		copyBtn.style.background = "revert-layer";
		copyBtn.style.border = "3px solid green";
	} else if (copyBtn.style.disabled === true || WrongNote === true) {
		copyBtn.style.border = "3px dotted black";
		copyBtn.style.background = "grey";
		translateBtn.style.border = "3px dashed red";
		copyBtn.style.disabled = true;
	}
}

//Custom errors
function NoteDoesntExist(message) {
	const error = new Error(message);
	return error;
}
NoteDoesntExist.prototype = Object.create(Error.prototype);
