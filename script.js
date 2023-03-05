//Dev tools
function FUNC_LIST() {
	let list = `
	Onloads - line 92
	translateNotes() - line 105
	convertTiming(timing, position) - line 148
	convertNote(note, position) - line 290
	errorStyle() - line 325
	copyCode() - line 341
	transposeNotes() - line 349
	showScale() - line 389
	changeScale(transposedLines) - line 407
	fetchDatabase() - line 425 *async
	searchDatabase() - line 447
	copyDatabase() - line 478
	updateShawzinPic() - line 496
	updateNoteSheet(noteLength) - line 501
	updateNoteCell(event) - line 537
	setupTrack(event) - line 555
	CustomError(message) - line 565
	`;
	console.log(list);
}
window.FUNC_LIST = FUNC_LIST; //Makes it accessible through console.

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
const shawzinPic = document.getElementById('shawzin-pic');
const shawzinPicModal = document.getElementById('shawzin-pic-modal');
const shawzinPicModalImg =  document.getElementById('shawzin-pic-modal-image');
const shawzinPicModalCaption = document.getElementById('shawzin-pic-caption');
const progressResetBtn = document.getElementById('reset-progress');
const progressResetModal = document.getElementById('reset-modal');
const resetPrompt = document.getElementById('reset-prompt');
const volumeSlider = document.getElementById('volume');
const volumeOutput = document.getElementById('volume-value');
const SAVES = document.querySelectorAll('.saveable');
const findTimingRegex = /[0-9]+/;
const findNoteRegex = /\D+/i;
const findDoubleNoteRegex = /[a-z]+[+]+[a-z]+/i;
const findTripleNoteRegex = /[a-z]+[+]+[a-z]+[+]+[a-z]+/i;
const missingSeparatorRegex = /[0-9]+[a-z]+[0-9]+[a-z]+/i;
let finalCode = [];
let noteSheetArr = []; //2d array representation of the note sheet table
let audioContext = '';
let audioSamples = [];
let showScaleClicks = 0;
let WrongNote = false;
let WasSetup = false;
let WasSampled = false;

// I cal this stuff 'rules', it translates input notes to shawzin code according to key - value pairs
const timingConvertRules = 
[
	'A','B','C','D','E','F','G','H','I','J','K','L','M',
	'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
	'a','b','c','d','e','f','g','h','i','j','k','l','m',
	'n','o','p','q','r','s','t','u','v','w','x','y','z',
	'0','1','2','3','4','5','6','7','8','9','+','/'
];
Object.freeze(timingConvertRules);
const noteConvertRules = 
{
	a:'B', b:'C', c:'E', d:'J', e:'K', f:'M',
	g:'R', h:'S', i:'U', j:'h', k:'i', l:'k'
}
Object.freeze(noteConvertRules);
const multiNoteConvertRules = 
{ 
	defghijkl: "/", deghjk: "7", efhikl: "+", dfgijl: "9", dgj: "5", ehk: "6", fil: "8", 
	ghijkl: "3", hikl: "2", ghjk: "z", gijl: "1", il: "0", hk: "y", gj: "x", defjkl: "v", 
	dejk: "r", dfjl: "t", efkl: "u", dj: "p", ek: "q", fl: "s", defghi: "f", efhi: "e", 
	dfgi: "d", degh: "b", dg: "Z", eh: "a", fi: "c", jkl: "n", jk: "j", kl: "m", jl: "l", ghi: "X", 
	hi: "W", gh: "T", gi: "V", def: "P", ef: "O", de: "L", df: "N", abc: "H", ab: "D", bc: "G", ac: "F"
};
Object.freeze(multiNoteConvertRules);
const notesAudioNames = 
[
	'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'
];
Object.freeze(notesAudioNames);
const linesForTransposition = 
[
	'-1#', '=#', '1#', '=#', '2🎼', '=#', '3#', '=#', '4#', '=#', '5#', '=#'
];
Object.freeze(linesForTransposition); 
const audioSamplePaths = 
[
	'A.ogg','B.ogg','C.ogg','D.ogg','E.ogg','F.ogg','G.ogg','H.ogg','I.ogg','J.ogg','K.ogg','L.ogg'
];
Object.freeze(audioSamplePaths);

//Event listeners
translateBtn.addEventListener('click', translateNotes);
translateBtn.addEventListener('click', errorStyle);
copyBtn.addEventListener('click', copyCode);
showScaleBtn.addEventListener('click', showScale);
databaseCopyBtn.addEventListener('click', copyDatabase);
transpositionIndex.addEventListener('click', transposeNotes);
databaseSearchBar.addEventListener('click', searchDatabase);
databaseSearchBar.addEventListener('keyup', searchDatabase);
playerPlayBtn.addEventListener('click', setupTrack);
scaleSelector.addEventListener('click', () => { WasSampled = false });
shawzinsSelect.addEventListener('click', updateShawzinPic);
shawzinsSelect.addEventListener('click', () => { WasSampled = false });
shawzinPic.addEventListener('click', toggleShawzinModal);
shawzinPicModal.addEventListener('click', toggleShawzinModal);
progressResetBtn.addEventListener('click', progressClear);
progressResetModal.addEventListener('click', progressClear);
resetPrompt.addEventListener('click', progressClear);
resetPrompt.addEventListener('keyup', progressClear);
volumeSlider.addEventListener('input', () => { volumeOutput.value = `${volumeSlider.value}%` });

// Onloads
window.onload = () => {
	copyBtn.style.disabled = true; 
	if (copyBtn.style.disabled === true) {
	copyBtn.style.border = "3px dotted black";
	copyBtn.style.background = "grey";
	}
	progressLoad();
	for (let i=0; i<SAVES.length; i++) {
		SAVES[i].addEventListener('keydown', progressSave);
		SAVES[i].addEventListener('keyup', progressSave);
		SAVES[i].addEventListener('click', progressSave);
	}
	volumeOutput.value = `${volumeSlider.value}%`;
	transposeNotes();
	updateNoteSheet(100);
	updateShawzinPic();
	console.log();
};

// Loads progress from local storage
function progressLoad() {
	for (let i=0; i<SAVES.length; i++) {
		let load = localStorage.getItem(SAVES[i].id);
		if (load != null) {
			SAVES[i].value = load;
		} else {
			localStorage.setItem(SAVES[i].id, SAVES[i].value);
		}
	}
}
// Saves progress to local storage
function progressSave() {
	localStorage.setItem(this.id, this.value);
}
// Clears progress from local storage
function progressClear(event) {
	if (this.id === 'reset-progress') {
		progressResetModal.style.display = "block";
		resetPrompt.focus();
	} 
	if (event.key === 'Escape') {
		progressResetModal.style.display = "none";
		resetPrompt.value = '';
	}
	if (this.value) {
		if (this.value.toLowerCase() === 'override') {
			localStorage.clear();
			alert(`All saved progress was deleted.`);
			progressResetModal.style.display = "none";
			resetPrompt.value = '';
		}
	}
}

// Translates notes and timings from the main input field
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
			errorStyle;
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
				errorStyle;
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
		let matchedNoteKey = false;
		let sortedNote = note.split('+').sort((a, b) => { return a===b ? 0:a>b ? 1:-1 }).join('');
		for (let y=0; y<Object.entries(multiNoteConvertRules).length; y++) {
			//Letters have alphabetic "weight"
			let sortedKey = Object.entries(multiNoteConvertRules)[y][0].slice().split('').sort((a, b) => { return a===b ? 0:a>b ? 1:-1 }).join('');
			if (sortedNote === sortedKey) {
				finalCode.push(Object.entries(multiNoteConvertRules)[y][1]);
				WrongNote = false;
				errorStyle;
				matchedNoteKey = true;
				break;
			}
    	}
    	if (matchedNoteKey === false) {
			WrongNote = true;
			errorStyle;
			alert(`Error: Notes #${position} can't be played together.`);
    	}
	} else {
		let result = noteConvertRules[note];
		if (result != null) {
			finalCode.push(result);
			WrongNote = false;
			errorStyle;
		} else {
			WrongNote = true;
			errorStyle;
			alert(`Note #${position} doesn't exist on this scale.`);
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
	let transposedLines = linesForTransposition.slice();
	if (transpositionIndex.value == 0) {
		changeScale(linesForTransposition);
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
	changeScale(transposedLines);
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
function changeScale(transposedLines) {
	scaleNotes.innerText = 
	`${transposedLines[11]}-----------------------------------------------(L)---												
	${transposedLines[10]}-------------------------------------------(K)---------
	${transposedLines[9]}---------------------------------------(J)-------------							
	${transposedLines[8]}-----------------------------------(I)------------------
	${transposedLines[7]}-------------------------------(H)----------------------
	${transposedLines[6]}---------------------------(G)-------------------------
	${transposedLines[5]}-----------------------(F)------------------------------										
	${transposedLines[4]}-------------------(E)---------------------------------
	${transposedLines[3]}---------------(D)--------------------------------------		
	${transposedLines[2]}-----------(C)------------------------------------------		
	${transposedLines[1]}-------(B)---------------------------------------------
	${transposedLines[0]}---(A)--------------------------------------------------`;
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

// Updates shawzin picture near shawzin selector
function updateShawzinPic() {
	shawzinPic.src = `images/${shawzinsSelect.value}.png`;
	shawzinPic.alt = `${shawzinsSelect.value}`;
}

// Toggles shawzin modal
function toggleShawzinModal() {
	if (this.id === 'shawzin-pic') {
		shawzinPicModal.style.display = "block";
		shawzinPicModalImg.src = shawzinPic.src;
		shawzinPicModalCaption.innerText = shawzinPic.alt;
	} else {
		shawzinPicModal.style.display = "none";
	}
}


// Generates interactable note sheet
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
				newTD.innerText = `${12-y}`;
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
}

// Updates note sheet cells
function updateNoteCell(event) {
	let cell = event.target;
	let cellY = cell.id.match(/(?<=tr-)\d+/i)[0];
	let cellX = cell.id.match(/(?<=td-)\d+/i)[0]-1; 
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

// Sets up the note sheets
async function setupTrack(event) {
	if (event.target.src.includes(`images/player-buttons-play.png`)) {
		event.target.src = `images/player-buttons-pause.png`;
		if (!WasSetup) {
			try {
				audioContext = new AudioContext();
				console.log('Audio Context was set up.');
				WasSetup = true;
			} catch(err) {
				console.log(`Something went wrong: ${err}`);
			}
		}
		if (!WasSampled) {
			try {
				audioSamples = await setupAudioSamples(audioSamplePaths);
				console.log(`Audio samples were loaded.`)
				WasSampled = true;
			} catch(err) {
				console.log(`Something went wrong: ${err}`);
			}
		}
		for (let x=0; x<noteSheetArr[0].length; x++) { //loop for columns to be played
			let activeNotes = []; 
			for (let y=0; y<noteSheetArr.length; y++) {
				if (noteSheetArr[y][x] === 1) {
					activeNotes.push(audioSamples[y]);
				}
			}
			playTrack(activeNotes);
			await Delay(62.5); //16 notes(columns) per second max
		}
	} else {
		event.target.src = `images/player-buttons-play.png`;
	}
}

// Load audio file
async function getAudio(filePath) { 
	const response = await fetch(filePath);
	const arrayBuffer = await response.arrayBuffer();
	const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
	return audioBuffer;
}

// Handle audio files
async function setupAudioSamples(paths) {
	let audioBuffers = [];
	let selectedScale = scaleSelector.options[scaleSelector.selectedIndex].text;
	for (let i=0; i<12; i++) {
		let sample = await getAudio(`audio/${shawzinsSelect.value}/${selectedScale}/${selectedScale}${paths[i]}`);
		audioBuffers.push(sample);
	}
	return audioBuffers;
}

// Play columns of notes
async function playTrack(audioBufferArr, time = 0) {
	if (audioBufferArr == null || audioBufferArr.length<=0) {
		return;
	}
	let samplesArr = []; //arr to collect all samples before playing them
	for (let i=0; i<audioBufferArr.length; i++) { //sample settings
		let volumeControl = audioContext.createGain();
		volumeControl.gain.value = volumeSlider.value / 400;
		volumeControl.connect(audioContext.destination);
		let sampleSource = audioContext.createBufferSource();
		sampleSource.buffer = audioBufferArr[i];
		sampleSource.connect(volumeControl);
		samplesArr.push(sampleSource);
	}
	for (let i=0; i<samplesArr.length; i++) { //samples being played
		samplesArr[i].start(time);
	}
}

// Custom delay
function Delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	})
}

// Custom errors
function CustomError(message) {
	const error = new Error(message);
	return error;
}
CustomError.prototype = Object.create(Error.prototype);
