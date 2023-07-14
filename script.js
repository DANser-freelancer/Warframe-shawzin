// Dev tools

window.CHECKBOX_CONTROL = () => {
	console.log(`${localStorage.getItem(slowModeToggle.id)} and ${slowModeToggle.checked}`);
	slowModeToggle.click();
};

// Global variables
const translateBtn = document.getElementById('translate');
const translateSheetBtn = document.getElementById('translate-sheet');
const notesInput = document.getElementById('notes-input');
const copyBtn = document.getElementById('copy-code');
const copyBtnDouble = document.querySelectorAll('.copy-code-double');
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
const playerLeftBtn = document.getElementById('player-Left-button');
const playerRightBtn = document.getElementById('player-Right-button');
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
const slowModeToggle = document.getElementById('slow-mode');
const SAVES = document.querySelectorAll('.saveable');
const findTimingRegex = /[0-9]+/;
const findNoteRegex = /\D+/i;
const findDoubleNoteRegex = /[a-z]+[+]+[a-z]+/i;
const findTripleNoteRegex = /[a-z]+[+]+[a-z]+[+]+[a-z]+/i;
const missingSeparatorRegex = /[0-9]+[a-z]+[0-9]+[a-z]+/i;
let finalCode = [];
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
const octaveNotes = 
[
	['ThreeDSharp','ThreeC','TwoASharp','TwoG','TwoF','TwoDSharp','TwoC','OneASharp','OneG','OneF','OneDSharp','OneC'],
	['ThreeD','ThreeC','TwoA','TwoG','TwoE','TwoD','TwoC','OneA','OneG','OneE','OneD','OneC'],
	['OneB','OneASharp','OneA','OneGSharp','OneG','OneFSharp','OneF','OneE','OneDSharp','OneD','OneCSharp','OneC'],
	['TwoASharp','TwoG','TwoFSharp','TwoF','TwoDSharp','TwoC','OneASharp','OneG','OneFSharp','OneF','OneDSharp','OneC'],
	['TwoG','TwoF','TwoE','TwoD','TwoC','OneB','OneA','OneG','OneF','OneE','OneD','OneC'],
	['TwoG','TwoF','TwoDSharp','TwoD','TwoC','OneASharp','OneGSharp','OneG','OneF','OneDSharp','OneD','OneC'],
	['ThreeCSharp','ThreeC','TwoA','TwoFSharp','TwoF','TwoCSharp','TwoC','OneASharp','OneFSharp','OneF','OneCSharp','OneC'],
	['TwoG','TwoF','TwoE','TwoCSharp','TwoC','OneASharp','OneGSharp','OneG','OneF','OneE','OneCSharp','OneC'],
	['ThreeDSharp','ThreeCSharp','TwoASharp','TwoGSharp','TwoFSharp','TwoDSharp','TwoCSharp','OneASharp','OneGSharp','OneFSharp','OneDSharp','OneCSharp']
];
Object.freeze(octaveNotes);
const octavesShawzin = [// leave empty string for vanila shawzin, it doesn't have a name
	'Zariman','Grineer','Narmer','Lotus','Sentient','ZarimanVoid','Prime',''
];
Object.freeze(octavesShawzin);

// Event listeners
translateBtn.addEventListener('click', translateNotes);
translateBtn.addEventListener('click', errorStyle);
translateSheetBtn.addEventListener('click', translateNotes);
translateSheetBtn.addEventListener('click', errorStyle);
copyBtn.addEventListener('click', copyCode);
showScaleBtn.addEventListener('click', showScale);
databaseCopyBtn.addEventListener('click', copyDatabase);
transpositionIndex.addEventListener('click', transposeNotes);
databaseSearchBar.addEventListener('click', searchDatabase);
databaseSearchBar.addEventListener('keyup', searchDatabase);
playerPlayBtn.addEventListener('click', setupTrack);
playerRightBtn.addEventListener('click', () => { stateOfPlay.startingTime<=4091 ? stateOfPlay.startingTime+=5 : stateOfPlay.startingTime+=stateOfPlay.startingTime });
playerLeftBtn.addEventListener('click', () => { stateOfPlay.startingTime>=5 ? stateOfPlay.startingTime-=5 : stateOfPlay.startingTime-=stateOfPlay.startingTime });
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
	copyBtn.style.border = "3px dotted black";
	copyBtn.style.background = "grey";
	progressLoad();
	for (let i=0; i<SAVES.length; i++) {
		SAVES[i].addEventListener('keydown', progressSave);
		SAVES[i].addEventListener('keyup', progressSave);
		SAVES[i].addEventListener('click', progressSave);
		SAVES[i].addEventListener('input', progressSave);
		SAVES[i].addEventListener('change', progressSave);
	}
	for (let i=0; i<copyBtnDouble.length; i++){//doubles for one actual copy code button, probably should rework into a css class...
		copyBtnDouble[i].addEventListener('click', ()=>{copyBtn.focus({focusVisible: true})});
		copyBtnDouble[i].addEventListener('click', ()=>{copyBtn.click()});
	}
	volumeOutput.value = `${volumeSlider.value}%`;
	transposeNotes();
	sheetBinding.generateNoteSheet(4097); //+1 for the note lables
	updateShawzinPic();
	(() => { //display last update date in local date format
		const updateDisplay = document.getElementById('last-update');
		let lastUpdateDate = new Date(Date.UTC(2023, 6, 11)); //y-m-d, months are 0 indexed
		let displayedDate = lastUpdateDate.toLocaleString(undefined, {timezone: 'UTC'});
		updateDisplay.innerText = displayedDate.slice(0,10);
	});
};

// Loads progress from local storage (if empty - save progress)
function progressLoad() {
	for (let i=0; i<SAVES.length; i++) {
		let load = JSON.parse(localStorage.getItem(SAVES[i].id));
		if (load != null) {
			if (SAVES[i].type === 'checkbox') {
				SAVES[i].checked = load;
			} else {
				SAVES[i].value = load;
			}
		} else {
			progressSave.call(SAVES[i]);
		}
	}
}
// Saves progress to local storage
function progressSave() {
	if (this.type === 'checkbox') {
		localStorage.setItem(this.id, JSON.stringify(this.checked));
	} else {
		localStorage.setItem(this.id, JSON.stringify(this.value));
	}
}
// Clears progress from local storage
function progressClear(event) {
	if (this.id === 'reset-progress') {
		progressResetModal.style.display = "block";
		resetPrompt.focus();
	} 
	if (event.key === 'Escape' || event.target.id === 'reset-modal') {
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
function translateNotes(event) {
	finalCode.splice(0, 999999);
	let notes;
	if (event?.target?.id === translateBtn.id) {
		notes = notesInput.value.split(',');
	} else if (event?.target?.id === translateSheetBtn.id) {
		notes = sheetBinding.noteSheetCollector();
	} else if (event?.id === 'sheetBinding') {
		notes = sheetBinding.noteSheetCollector();
	}
	if (notes == null) {
		WrongNote = true;
		errorStyle;
		alert(`Error: The field is empty.`);
		return;
	}
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
			timing = Number(notes[i].match(findTimingRegex)[0])-1;
			note = notes[i].toLowerCase().match(findNoteRegex)[0];
			console.log(`%cNote conversion check, timing: ${timing} notes: ${note}`, 'color:gold');
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
	for (let i=2; i<=64; i++) {
		if (timing <= -1) {
			WrongNote = true;
			errorStyle;
			alert(`Error: start first note position from 1+.`);
			break;
		} else if (timing < 64) {
			finalCode.push(range+timingConvertRules[timing]);
			break;
		} else if (timing < (64*i)) {
			finalCode.push(range+timingConvertRules[timing-(64*(i-1))]);
			break;
		} else if (i>=64) { 
			WrongNote = true;
			errorStyle;
			alert(`Error: Wrong timeline position, note #${position} range must be 1-4096.`)
			break; 
		}
	}
	
	//	reference 09.04.2023
	/* 
	} else if (timing < 64*63) {
		finalCode.push(range+timingConvertRules[timing-64*62]);
	} else if (timing < 64*64) {
		finalCode.push(range+timingConvertRules[timing-64*63]);
	} 
	*/
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

let database;//has to be global because it's spread between 3 functions
//Fetch database
async function fetchDatabase() {
	const response = await fetch('database.json');
	database = await response.json();
	database.sort((a,b) => { //strings can be compared for alphabetical order in js and will give a boolean, hwat?????
		if (a.name.toLowerCase() < b.name.toLowerCase()) {
			return -1;
		}
		if (a.name.toLowerCase() < b.name.toLowerCase()) {
			return 1;
		}
		return 0;
	});
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
		if (databaseCode != null) {
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

// Creates js-html binding
class NoteTableBinding {
	constructor(element) {
		this.tableElement = element;
		this.noteSheetArr = []; //2d array representation of the note sheet table
		this.id = 'sheetBinding';
	}

	// Generates interactable note sheet
	generateNoteSheet(noteLength) {
		this.noteSheetArr.length = 0; // clear array
		for (let y=0; y < 12; y++) {
			let newTR = document.createElement('tr');
			newTR.id = `tr-${y}`;
			newTR.className = `sheet-table-rows`;
			this.tableElement.appendChild(newTR);
			this.noteSheetArr.push([]);	
			for (let x=0; x<noteLength; x++) {
				let newTD = document.createElement('td');
				newTD.id = `td-${x}-tr-${y}`;
				newTD.className = `sheet-table-cells`;
				let div = document.createElement('div'); //insert into cells for better control over size and content
				/*div.style.width = "30px";
				div.style.height = "35px";
				div.style.color = "#CB23DE";
				div.style.overflow = "visible";
				div.style.whiteSpace = "nowrap";
				div.style.display = "flex";
				div.style.flexDirection = "row-reverse";
				div.style.alignItems = "flex-end";
				div.style.padding = "0 2px 4px 2px";*/
				div.classList.add('cell-divs-basic');
				if (x !== 0) {
					newTD.addEventListener('click', this.updateNoteCell.bind(this));// overwrite 'this' to be the class and not the source of the event.
					this.noteSheetArr[y].push(0);
					div.style.fontSize = "22px";
					div.style.fontWeight = "bold";
				}
				if (x%16 === 0) {
					newTD.style.borderRight = "3px solid rgb(178, 51, 3)";
					if (y === 11) {
						div.innerText = `${x}`;
					}
				} else if (x%8 === 0) {
					newTD.style.borderRight = "2px solid rgb(255, 95, 35)";
					if (y === 11) {
						div.innerText = `${x}`;
					}
				} else if (x%4 === 0) {
					newTD.style.borderRight = "1px solid rgb(25, 0, 103)"
					if (y === 11) {
						div.innerText = `${x}`;
					}
				}
				if (x === 0) {
					div.innerText = `${notesAudioNames[y]}`;
					div.style.flexDirection = "row";
					div.style.alignItems = "center";
					div.style.justifyContent = "center";
					div.style.color = "red";
					div.style.fontSize = "25px";
					div.style.fontFamily = "Arial";
					div.style.textAlign = "center";
					div.style.fontWeight = "bold";
				}
				newTD.appendChild(div);
				newTR.appendChild(newTD);
			}
		}
	}

	// Collects notes from note sheet
	noteSheetCollector() {
		let returnedNotes = [];
		for (let x=0; x<this.noteSheetArr[0].length; x++) { //loop for columns to be played
			let activeNotes = []; 
			for (let y=0; y<this.noteSheetArr.length; y++) { //loop for rows to be played
				if (this.noteSheetArr[y][x] === 1) {
					activeNotes.push(`${notesAudioNames[y]}`);
				}
			}
			if (activeNotes.length>=1) { //connect notes by "+" if we have more than one 
				let finalNotes = `${x+1}${activeNotes.join('+')}`; //add correct timing number
				returnedNotes.push(finalNotes); //{timing}{note/s and +},{timing}{note/s and +}......
			}	
		}
		return returnedNotes;
	}

	// Updates note sheet cells
	updateNoteCell(event) { 
		let cell = event.currentTarget;
		let div = cell.children[0];
		let cellY = cell.id.match(/(?<=tr-)\d+/i)[0];
		let cellX = cell.id.match(/(?<=td-)\d+/i)[0]-1;
		if (this.noteSheetArr[cellY][cellX] !== 1) {
			//Note ON
			div.classList.remove(...['cell-on-err', 'cell-off-err']);
			div.classList.add('cell-on');
			this.noteSheetArr[cellY][cellX] = 1;
			div.innerText = div.innerText.replace('⚠️', '');
		} else {
			//Note OFF
			div.classList.remove(...['cell-on', 'cell-on-err', 'cell-off-err']);
			this.noteSheetArr[cellY][cellX] = 0;
			div.innerText = div.innerText.replace('⚠️', '');
		}
		translateNotes(this);
		this.errorCell(div, {y: cellY, x: cellX});
	}

	// Make cell display an error 
	errorCell(div, coords) {
		if (WrongNote) {
			if (this.noteSheetArr[coords.y][coords.x] === 0) {
				//Note OFF err
				div.classList.remove(...['cell-on-err', 'cell-on']);
				div.classList.add('cell-off-err');
			} else {
				//Note ON err
				div.classList.remove(...['cell-off-err', 'cell-on']);
				div.classList.add('cell-on-err');
			}
			if (!div.innerText.includes('⚠️')) {
				div.innerText = `${div.innerText}⚠️`;
			}
		}
	}
}
const sheetBinding = new NoteTableBinding(noteSheet);

// Sets up the track
const stateOfPlay = {
	continuePlaying: true,
	startingTime: 0
}  
async function setupTrack(event, speed = 62.5, time = stateOfPlay.startingTime) {
	if (slowModeToggle.checked) {
		speed = 125;
	}
	if (event.target.src.includes(`images/player-buttons-play.png`)) {
		event.target.src = `images/player-buttons-pause.png`;
		stateOfPlay.continuePlaying = true;
		if (!WasSetup) {
			try {
				audioContext = new AudioContext();
				console.log(`%cAudio Context was set up.`, 'color:gold');
				WasSetup = true;
			} catch(err) {
				console.log(`Something went wrong: ${err}`);
			}
		}
		if (!WasSampled) {
			try {
				audioSamples = await setupAudioSamples(octaveNotes);
				console.log(`%cAudio samples were loaded.`, 'color:gold')
				WasSampled = true;
			} catch(err) {
				console.log(`Something went wrong: ${err}`);
			}
		}
		for (let x=0||time; x<sheetBinding.noteSheetArr[0].length; x++) { //loop for columns to be played
			let activeNotes = []; 
			for (let y=0; y<sheetBinding.noteSheetArr.length; y++) { //loop for rows to be played
				if (sheetBinding.noteSheetArr[y][x] === 1) {
					//console.log(audioSamples[y]);
					activeNotes.push(audioSamples[y]);
				}
				let currentCell = document.getElementById(`td-${x}-tr-${y}`);
				currentCell.classList.add('cell-playing');
				if (x>0) {
					let previousCell = document.getElementById(`td-${x-1}-tr-${y}`);
					previousCell.classList.remove('cell-playing');
				}
			}
			await Delay(speed); //16 notes(columns) per second max
			playTrack(activeNotes);
			if (stateOfPlay.continuePlaying == false) {
				stateOfPlay.startingTime = x;
				return
			}
		}
	} else {
		event.target.src = `images/player-buttons-play.png`;
		stateOfPlay.continuePlaying = false;
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
async function setupAudioSamples(notes) {
	let audioBuffers = [];
	let selectedScale = scaleSelector.options[scaleSelector.selectedIndex].text.split(' ');
	for (let i=0; i<notes[0].length; i++) {			//what shawzin 												//what note (octave)
		let sample = await getAudio(`audio/Octaves/${octavesShawzin[shawzinsSelect.selectedIndex]}ShawzinOct${notes[scaleSelector.selectedIndex][i]}.ogg`);
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

// Custom error
function CustomError(message) {
	const error = new Error(message);
	return error;
}
CustomError.prototype = Object.create(Error.prototype);
