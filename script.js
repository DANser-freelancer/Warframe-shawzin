console.log
//Global variables
const translateBtn = document.getElementById('translate');
const notesInput = document.getElementById('notes-input');
const copyBtn = document.getElementById('copy-code');
const scaleSelector = document.getElementById('scale-selector');
const showScaleBtn = document.getElementById('show-scale');
const scaleDisplay = document.getElementById('scale-display');
const scaleNotes = document.getElementById('scale-notes');
const databaseSelector = document.getElementById('database-selector');
const databaseCopyBtn = document.getElementById('copy-database');
const transpositionIndex = document.getElementById('transposition-index');
const noteLengths = document.getElementById('note-lengths');
const noteLengthSelector = document.getElementById('note-length-selector');
const databaseSearchBar = document.getElementById('database-search-bar');
const noteSheet = document.getElementById('note-sheet');
const noteSheetHeader = document.getElementById('sheet-header-table');
const playerPlayBtn = document.getElementById('player-Play-button');
const shawzinsSelect = document.getElementById('shawzins-select');
const findTimingRegex = /[0-9]+/;
const findNoteRegex = /\D+/i;
const findDoubleNoteRegex = /[a-z]+[+]+[a-z]+/i;
const findTripleNoteRegex = /[a-z]+[+]+[a-z]+[+]+[a-z]+/i;
const missingSeparatorRegex = /[0-9]+[a-z]+[0-9]+[a-z]+/i;
let finalCode = [];
let noteSheetArr = [];
let showScaleClicks = 0;
let WrongNote = false;

//I cal this stuff 'rules', it translates input notes into shawzin code according to key - value pairs
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
las:'R', mc:'S', mcs:'U', me:'h', mf:'i', mg:'k'},
{lcs:'B', lds:'C', lfs:'E', lgs:'J', las:'K', mcs:'M', 
mds:'R', mfs:'S', mgs:'U', mas:'h', hcs:'i', hds:'k'}
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
{lgsmds:'Z', mdsmas:'x', lgsmas:'p', lgsmdsmas:'5', lasmfs:'a', mfshcs:'y',
lashcs:'q', lasmfshcs:'6', mcsmgs:'c', mgshds:'0', mcshds:'s', mcsmgshds:'8'}
]
Object.freeze(multiNoteConvertRules);
const linesForTransposition = [-1, '=', 1, '=', 2, '=', 3, '=', 4, '=', 5, '='];
Object.freeze(linesForTransposition); 
let transposedLines = [-1, '=', 1, '=', 2, '=', 3, '=', 4, '=', 5, '='];

//Event listeners
translateBtn.addEventListener('click', translateNotes);
translateBtn.addEventListener('click', errorStyle);
copyBtn.addEventListener('click', copyCode);
showScaleBtn.addEventListener('click', showScale);
scaleSelector.addEventListener('click', changeScale);
databaseCopyBtn.addEventListener('click', copyDatabase);
transpositionIndex.addEventListener('click', transposeNotes);
databaseSearchBar.addEventListener('click', searchDatabase);
playerPlayBtn.addEventListener('click', playTrack);

//Onloads
copyBtn.style.disabled = true;
window.onload = () => { 
	if (copyBtn.style.disabled === true) {
	copyBtn.style.border = "3px dotted black";
	copyBtn.style.background = "grey";
	}
	changeScale();
	updateNoteSheet(100);
};

//Translates notes and timings from the main input field
function translateNotes() {
	finalCode.splice(0, 999999);
	let notes = notesInput.value.split(',');
	for (let i=0; i<notes.length; i++) {
		notes[i] = notes[i].replace(/\s+/gi, '');
		notes[i] = notes[i].replace(/\n+/gi, '');
		if (notes[i].match(missingSeparatorRegex) != null) {
			WrongNote = true;
			errorStyle;
			alert(`Error: Missing separator for note №${i+1}.`);
			return;
		} else {
			WrongNote = false;
		}
	}
	for (let i=0; i<notes.length; i++) {
		let timing = false; 
		let note = false; 
		try {
			timing = Number(notes[i].match(findTimingRegex)[0]) - 1;
			note = notes[i].toLowerCase().match(findNoteRegex)[0];
		} finally {
			if (timing !== false && note !== false) {
				WrongNote = false;
			} else {
				WrongNote = true;
				errorStyle;
				alert(`Error: Timing or note №${i+1} is incorrect/missing.`);
			}
		}
		convertNote(note, timing+1);
		convertTiming(timing*noteLengthSelector.value, timing+1);
		if (WrongNote === true) {
			return;
		}
	}
	finalCode.unshift(Number(scaleSelector.value) + 1);
	console.log(finalCode);
}

//Converts timing into shawzin code: ranges from [AA-AZ, Aa-Az, A0-A9, A+, A/] to [/A-/Z, /a-/z, /0-/9, /+, //]
function convertTiming(timing, position) {
	let range = timingConvertRules[Math.floor(timing/64)];
	if (timing === -1) {
		WrongNote = true;
		errorStyle;
		alert(`Error: start first note position from 1+.`);
	} else if (timing < 64 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing]);
	} else if (timing < 64*2 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64]);
	} else if (timing < 64*3 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*2]);
	} else if (timing < 64*4 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*3]);
	} else if (timing < 64*5 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*4]);
	} else if (timing < 64*6 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*5]);
	} else if (timing < 64*7 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*6]);
	} else if (timing < 64*8 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*7]);
	} else if (timing < 64*9 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*8]);
	} else if (timing < 64*10 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*9]);
	} else if (timing < 64*11 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*10]);
	} else if (timing < 64*12 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*11]);
	} else if (timing < 64*13 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*12]);
	} else if (timing < 64*14 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*13]);
	} else if (timing < 64*15 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*14]);
	} else if (timing < 64*16 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*15]);
	} else if (timing < 64*17 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*16]);
	} else if (timing < 64*18 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*17]);
	} else if (timing < 64*19 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*18]);
	} else if (timing < 64*20 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*19]);
	} else if (timing < 64*21 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*20]);
	} else if (timing < 64*22 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*21]);
	} else if (timing < 64*23 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*22]);
	} else if (timing < 64*24 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*23]);
	} else if (timing < 64*25 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*24]);
	} else if (timing < 64*26 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*25]);
	} else if (timing < 64*27 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*26]);
	} else if (timing < 64*28 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*27]);
	} else if (timing < 64*29 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*28]);
	} else if (timing < 64*30 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*29]);
	} else if (timing < 64*31 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*30]);
	} else if (timing < 64*32 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*31]);
	} else if (timing < 64*33 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*32]);
	} else if (timing < 64*34 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*33]);
	} else if (timing < 64*35 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*34]);
	} else if (timing < 64*36 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*35]);
	} else if (timing < 64*37 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*36]);
	} else if (timing < 64*38 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*37]);
	} else if (timing < 64*39 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*38]);
	} else if (timing < 64*40 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*39]);
	} else if (timing < 64*41 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*40]);
	} else if (timing < 64*42 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*41]);
	} else if (timing < 64*43 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*42]);
	} else if (timing < 64*44 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*43]);
	} else if (timing < 64*45 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*44]);
	} else if (timing < 64*46 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*45]);
	} else if (timing < 64*47 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*46]);
	} else if (timing < 64*48 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*47]);
	} else if (timing < 64*49 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*48]);
	} else if (timing < 64*50 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*49]);
	} else if (timing < 64*51 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*50]);
	} else if (timing < 64*52 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*51]);
	} else if (timing < 64*53 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*52]);
	} else if (timing < 64*54 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*53]);
	} else if (timing < 64*55 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*54]);
	} else if (timing < 64*56 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*55]);
	} else if (timing < 64*57 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*56]);
	} else if (timing < 64*58 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*57]);
	} else if (timing < 64*59 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*58]);
	} else if (timing < 64*60 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*59]);
	} else if (timing < 64*61 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*60]);
	} else if (timing < 64*62 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*61]);
	} else if (timing < 64*63 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*62]);
	} else if (timing < 64*64 && timing > -1) {
		finalCode.push(range+timingConvertRules[timing-64*63]);
	} else { 
		WrongNote = true;
		errorStyle;
		alert(`Error: Wrong timeline position, note #${position} range must be 1-4096.`) 
	}
}

//Checks and converts note
function convertNote(note, position) {
	if (note.includes('+')) {
		try {
			let multiNote = note.split('+').join('');
			let multiResult = multiNoteConvertRules[scaleSelector.value][multiNote];
			if (multiResult != undefined) {
				finalCode.push(multiResult);
				WrongNote = false;
			} else {
				throw new CustomError(`Error: Notes #${position} can't be played together.`);
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
				throw new CustomError(`Note #${position} doesn't exist on this scale.`);
			}
		} catch (error) {
			WrongNote = true;
			errorStyle;
			alert(error);
		}
	}
}

//Style changes if translation error occurs
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

//Copies final code to clipboard
function copyCode() {
	let result = finalCode.join('');
	if (copyBtn.style.disabled === false) {
		navigator.clipboard.writeText(result);
	} 
}

//Transposes notes by moving the lines number and updates the scale display
function transposeNotes() {
	//Input checks
	transposedLines = linesForTransposition.slice();
	if (transpositionIndex.value == 0) {
		return;
	}
	if (transpositionIndex.value > 12) {
		transpositionIndex.value = 12;
	}
	if (transpositionIndex.value < -12) {
		transpositionIndex.value = -12;
	}

	for (let i=0; i<Math.abs(transpositionIndex.value); i++) {
		if (transpositionIndex.value<=-1) {
			let last = transposedLines.pop();
			if (typeof last === 'number' && last === 5) {
				transposedLines.unshift(last-7);
			} else if (typeof last === 'number' && last === -1) {
				transposedLines.unshift(last-6);
			} else if (typeof last === 'number') {
				transposedLines.unshift(last-7);
			} else {
				transposedLines.unshift(last);
			}
		} else if (transpositionIndex.value>0) {
			let first = transposedLines.shift();
			if (typeof first === 'number' && first === -1) {
				transposedLines.push(first+7);
			} else if (typeof first === 'number') {
				transposedLines.push(first+6);
			} else {
				transposedLines.push(first);
			}
		} else { return; }
	}
	changeScale();
}

//Shows\hides scale
function showScale() {
	showScaleClicks+=1;
	if (showScaleClicks % 2 === 0) {
		showScaleBtn.value = 'Hide scale';
		setTimeout(() => {
			scaleDisplay.style.animation = 'fade-in 1000ms forwards';
			noteLengths.style.animation = 'fade-in 1000ms forwards';
		}, 100);
	} else {
		showScaleBtn.value = 'Show scale';
		setTimeout(() => {
			scaleDisplay.style.animation = 'fade-out 1000ms forwards';
			noteLengths.style.animation = 'fade-out 1000ms forwards';
		}, 100);
	}	
} 

//Changes scale display
function changeScale() {
	if (scaleSelector.value === '0') {
		scaleNotes.innerText = 
		`${transposedLines[11]}#-----------------------------------------------(HDS)---												
		${transposedLines[10]}#-------------------------------------------(HC)---------
		${transposedLines[9]}#---------------------------------------(MAS)-------------							
		${transposedLines[8]}#-----------------------------------(MG)------------------
		${transposedLines[7]}#-------------------------------(MF)----------------------
		${transposedLines[6]}#---------------------------(MDS)-------------------------
		${transposedLines[5]}#-----------------------(MC)------------------------------										
		${transposedLines[4]}#-------------------(LAS)---------------------------------
		${transposedLines[3]}#---------------(LG)--------------------------------------		
		${transposedLines[2]}#-----------(LF)------------------------------------------		
		${transposedLines[1]}#-------(LDS)---------------------------------------------
		${transposedLines[0]}#---(LC)--------------------------------------------------
		`;
	} else if (scaleSelector.value === '1') {
		scaleNotes.innerText = 
		`${transposedLines[11]}#-----------------------------------------------(HD)---												
		${transposedLines[10]}#-------------------------------------------(HC)--------
		${transposedLines[9]}#---------------------------------------(MA)-------------								
		${transposedLines[8]}#-----------------------------------(MG)-----------------
		${transposedLines[7]}#-------------------------------(ME)---------------------
		${transposedLines[6]}#---------------------------(MD)-------------------------
		${transposedLines[5]}#-----------------------(MC)-----------------------------			
		${transposedLines[4]}#-------------------(LA)---------------------------------
		${transposedLines[3]}#---------------(LG)-------------------------------------		
		${transposedLines[2]}#-----------(LE)-----------------------------------------		
		${transposedLines[1]}#-------(LD)---------------------------------------------
		${transposedLines[0]}#---(LC)-------------------------------------------------
		`;
	} else if (scaleSelector.value === '2') {
		scaleNotes.innerText = 
		`${transposedLines[11]}#-----------------------------------------------(LB)---												
		${transposedLines[10]}#-------------------------------------------(LAS)-------
		${transposedLines[9]}#---------------------------------------(LA)-------------							
		${transposedLines[8]}#-----------------------------------(LGS)----------------
		${transposedLines[7]}#-------------------------------(LG)---------------------
		${transposedLines[6]}#---------------------------(LFS)------------------------
		${transposedLines[5]}#-----------------------(LF)-----------------------------										
		${transposedLines[4]}#-------------------(LE)---------------------------------
		${transposedLines[3]}#---------------(LDS)------------------------------------		
		${transposedLines[2]}#-----------(LD)-----------------------------------------	
		${transposedLines[1]}#-------(LCS)--------------------------------------------
		${transposedLines[0]}#---(LC)-------------------------------------------------
		`;
	} else if (scaleSelector.value === '3') {
		scaleNotes.innerText = 
		`${transposedLines[11]}#-----------------------------------------------(MAS)---												
		${transposedLines[10]}#-------------------------------------------(MG)---------
		${transposedLines[9]}#---------------------------------------(MFS)-------------							
		${transposedLines[8]}#-----------------------------------(MF)------------------
		${transposedLines[7]}#-------------------------------(MDS)---------------------
		${transposedLines[6]}#---------------------------(MC)--------------------------
		${transposedLines[5]}#-----------------------(LAS)-----------------------------
		${transposedLines[4]}#-------------------(LG)----------------------------------
		${transposedLines[3]}#---------------(LFS)-------------------------------------
		${transposedLines[2]}#-----------(LF)------------------------------------------	
		${transposedLines[1]}#-------(LDS)---------------------------------------------
		${transposedLines[0]}#---(LC)--------------------------------------------------
		`;
	} else if (scaleSelector.value === '4') {
		scaleNotes.innerText = 
		`${transposedLines[11]}#-----------------------------------------------(MG)---											
		${transposedLines[10]}#-------------------------------------------(MF)--------
		${transposedLines[9]}#---------------------------------------(ME)-------------								
		${transposedLines[8]}#-----------------------------------(MD)-----------------
		${transposedLines[7]}#-------------------------------(MC)---------------------
		${transposedLines[6]}#---------------------------(LB)-------------------------
		${transposedLines[5]}#-----------------------(LA)-----------------------------								
		${transposedLines[4]}#-------------------(LG)---------------------------------
		${transposedLines[3]}#---------------(LF)-------------------------------------		
		${transposedLines[2]}#-----------(LE)-----------------------------------------		
		${transposedLines[1]}#-------(LD)---------------------------------------------
		${transposedLines[0]}#---(LC)-------------------------------------------------
		`;
	} else if (scaleSelector.value === '5') {
		scaleNotes.innerText = 
		`${transposedLines[11]}#-----------------------------------------------(MG)---												
		${transposedLines[10]}#-------------------------------------------(MF)--------
		${transposedLines[9]}#---------------------------------------(MDS)------------								
		${transposedLines[8]}#-----------------------------------(MD)-----------------
		${transposedLines[7]}#-------------------------------(MC)---------------------
		${transposedLines[6]}#---------------------------(LAS)------------------------
		${transposedLines[5]}#-----------------------(LGS)----------------------------										
		${transposedLines[4]}#-------------------(LG)---------------------------------
		${transposedLines[3]}#---------------(LF)-------------------------------------		
		${transposedLines[2]}#-----------(LDS)----------------------------------------		
		${transposedLines[1]}#-------(LD)---------------------------------------------
		${transposedLines[0]}#---(LC)-------------------------------------------------
		`;
	} else if (scaleSelector.value === '6') {
		scaleNotes.innerText = 
		`${transposedLines[11]}#-----------------------------------------------(MCS)---												
		${transposedLines[10]}#-------------------------------------------(HC)---------
		${transposedLines[9]}#---------------------------------------(MA)--------------			
		${transposedLines[8]}#-----------------------------------(MFS)-----------------
		${transposedLines[7]}#-------------------------------(MF)----------------------
		${transposedLines[6]}#---------------------------(MCS)-------------------------
		${transposedLines[5]}#-----------------------(MC)------------------------------										
		${transposedLines[4]}#-------------------(LAS)---------------------------------
		${transposedLines[3]}#---------------(LFS)-------------------------------------
		${transposedLines[2]}#-----------(LF)------------------------------------------		
		${transposedLines[1]}#-------(LCS)---------------------------------------------
		${transposedLines[0]}#---(LC)--------------------------------------------------
		`;
	} else if (scaleSelector.value === '7') {
		scaleNotes.innerText = 
		`${transposedLines[11]}#-----------------------------------------------(MG)---												
		${transposedLines[10]}#-------------------------------------------(MF)--------
		${transposedLines[9]}#---------------------------------------(ME)-------------							
		${transposedLines[8]}#-----------------------------------(MCS)----------------
		${transposedLines[7]}#-------------------------------(MC)---------------------
		${transposedLines[6]}#---------------------------(LAS)------------------------
		${transposedLines[5]}#-----------------------(LGS)----------------------------							
		${transposedLines[4]}#-------------------(LG)---------------------------------
		${transposedLines[3]}#---------------(LF)-------------------------------------		
		${transposedLines[2]}#-----------(LE)-----------------------------------------		
		${transposedLines[1]}#-------(LCS)--------------------------------------------
		${transposedLines[0]}#---(LC)-------------------------------------------------
		`;
	} else if (scaleSelector.value === '8') {
		scaleNotes.innerText =
		`${transposedLines[11]}#-----------------------------------------------(HDS)---												
		${transposedLines[10]}#-------------------------------------------(HCS)--------
		${transposedLines[9]}#---------------------------------------(MAS)-------------								
		${transposedLines[8]}#-----------------------------------(MGS)-----------------
		${transposedLines[7]}#-------------------------------(MFS)---------------------
		${transposedLines[6]}#---------------------------(MDS)-------------------------
		${transposedLines[5]}#-----------------------(MCS)-----------------------------										
		${transposedLines[4]}#-------------------(LAS)---------------------------------
		${transposedLines[3]}#---------------(LGS)-------------------------------------		
		${transposedLines[2]}#-----------(LFS)-----------------------------------------		
		${transposedLines[1]}#-------(LDS)---------------------------------------------
		${transposedLines[0]}#---(LCS)-------------------------------------------------
		`;
	}
}

//Fetch database
let database;
async function fetchDatabase() {
	const response = await fetch('database.json');
	database = await response.json(); 
	for (let i=0; i<database.length; i++) {
		//Calculates length of the song
		let lastTimingLetters = database[i].code.slice(-2).split('');
		let beats = timingConvertRules.indexOf(lastTimingLetters[0])*64 + timingConvertRules.indexOf(lastTimingLetters[1]);
		let seconds = Math.floor(beats/16);
		let minutes = Math.floor(seconds/60);
		let extraSeconds = seconds % 60;
		extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;
 		let runtime = `${minutes}:${extraSeconds}`;
 		//For each song creates an option element and appends it to the database selector
		let opt = document.createElement('option');
		opt.value = i;
		opt.innerText = `${database[i].name} - ${database[i].band} - ~${runtime}`;
		databaseSelector.appendChild(opt);
	}
}
fetchDatabase();

//Searches for a name/band of the songs in the database
function searchDatabase() {
	if (databaseSearchBar.value.match(/\S/ig) == null || databaseSearchBar.value == null) {
		return;
	}
	let matches = 0;
	databaseSelector.innerHTML = `<option></option>`;
	databaseSelector.remove(0);
	for (let i=0; i<database.length; i++) {
		if (database[i].name.toLowerCase().includes(databaseSearchBar.value.toLowerCase()) || database[i].band.toLowerCase().includes(databaseSearchBar.value.toLowerCase())) {
			matches++;
			//Calculates length of the song
			let lastTimingLetters = database[i].code.slice(-2).split('');
			let beats = timingConvertRules.indexOf(lastTimingLetters[0])*64 + timingConvertRules.indexOf(lastTimingLetters[1]);
			let seconds = Math.floor(beats/16);
			let minutes = Math.floor(seconds/60);
			let extraSeconds = seconds % 60;
			extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;
 			let runtime = `${minutes}:${extraSeconds}`;
 			//For each song creates an option element and appends it to the database selector
			let opt = document.createElement('option');
			opt.value = i;
			opt.innerText = `${database[i].name} - ${database[i].band} - ~${runtime}`;
			databaseSelector.appendChild(opt);
		}
	}
	if (matches<=0) {
		databaseSelector.innerHTML = `<option>No results</option>`;
	} 
}

//Copies song code from database
function copyDatabase() {
	let databaseCode;
	try {
		databaseCode = database[databaseSelector.value].code;
	} finally {
		if (databaseCode != undefined) {
			navigator.clipboard.writeText(databaseCode);
			databaseCopyBtn.style.border = "revert-layer";
			databaseCopyBtn.style.background = "revert-layer";
			databaseCopyBtn.style.border = "3px solid green";
		} else {
			databaseCopyBtn.style.border = "3px dotted black";
			databaseCopyBtn.style.background = "grey";
		}
	}
}

//Generates interactable note sheet
function updateNoteSheet(noteLength) {
	noteSheetArr = [];
	for (let y=0; y < 12; y++) {
		let newTR = document.createElement('tr');
		newTR.id = `tr-${y}`;
		newTR.className = `sheet-table-rows`;
		noteSheet.appendChild(newTR);
		noteSheetArr.push([]);	
		for (let x=0; x<noteLength; x++) {
			let newTD = document.createElement('td');
			newTD.id = `td-${x}-tr-${y}`;
			newTD.className = `sheet-table-cells`;
			if (x === 0) {
				newTD.innerText = `${y+1}`;
				newTD.style.padding = "5px";
				newTD.style.color = "red";
				newTD.style.fontSize = "25px";
				newTD.style.fontFamily = "Arial";
				newTD.style.textAlign = "center";
				newTD.style.fontWeight = "bold";
			}
			if (x !== 0) {
				newTD.addEventListener('click', updateNoteCell);
				noteSheetArr[y].push(0);
			}
			if (x%8 === 0) {
				newTD.style.borderRight = "3px solid rgb(57, 0, 233)";
			} else if (x%4 === 0) {
				newTD.style.borderRight = "1px solid rgb(25, 0, 103)"
			}
			newTR.appendChild(newTD);
		}
	}
	//console.log(noteSheetArr);
}

//Updates note sheet cells
function updateNoteCell(event) {
	let cell = event.target;
	let cellY = cell.id.match(/(?<=tr-)\d+/i)[0];
	let cellX = cell.id.match(/(?<=td-)\d+/i)[0]-1;
	//console.log(cellY);
	//console.log(cellX); 
	if (cell.style.background != "rgb(10, 10, 10)") {
		//Note ON
		cell.style.background = "rgb(10, 10, 10)";
		noteSheetArr[cellY][cellX] = 1;
	} else {
		//Note OFF
		cell.style.background = "revert-layer";
		noteSheetArr[cellY][cellX] = 0;
	}
}

//Starts playing interactable note sheet
function playTrack(event) {
	//console.log(noteSheetArr);
	if (event.target.src.includes(`images/player-buttons-play.png`)) {
		event.target.src = `images/player-buttons-pause.png`;
	} else {
		event.target.src = `images/player-buttons-play.png`;
	}
	//LOOPS WITH PROMISES AND PROMISE.ALL
}

//Custom errors
function CustomError(message) {
	const error = new Error(message);
	return error;
}
CustomError.prototype = Object.create(Error.prototype);
