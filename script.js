// Dev tools
window.CHECKBOX_CONTROL = () => {
	console.log(`${localStorage.getItem(slowModeToggle.id)} and ${slowModeToggle.checked}`);
	slowModeToggle.click();
};

window.SHEET_ARR = () => {
	console.log(sheetBinding.noteSheetArr);
	console.log(JSON.parse(localStorage.getItem(noteSheet.id)));
};

window.START_TIME = () => {
	console.log(sheetBinding.startingTime);
	console.log(JSON.parse(localStorage.getItem('starting_time')));
};

window.FULL_SHEET = () => {
	for (let i=0; i<sheetBinding.noteSheetArr.length; i++) {
		for (let x=0; x<sheetBinding.noteSheetArr[0].length; x++) {
			sheetBinding.noteSheetArr[i][x] = 1;
		};
	};
	console.log(sheetBinding.noteSheetArr);
};

// Global variables
const translateBtn = document.getElementById('translate');
const translateBtns = document.querySelectorAll('.translate-btns');
const translateSheetBtn = document.getElementById('translate-sheet');
const notesInput = document.getElementById('notes-input');
const copyBtns = document.querySelectorAll('.copy-code');
const scaleSelector = document.getElementById('scale-selector');
const showScaleBtn = document.getElementById('show-scale');
const scaleDisplay = document.getElementById('scale-display');
const scaleNotes = document.getElementById('scale-notes');
const databaseSelector = document.getElementById('database-selector');
const databaseCopyBtn = document.getElementById('copy-database');
const transpositionIndex = document.getElementById('transposition-index');
const noteLengths = document.getElementById('note-lengths');
const databaseSearchBar = document.getElementById('database-search-bar');
const noteSheet = document.getElementById('note-sheet');
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
const playheadSkipRange = document.getElementById('column-skip-amount');
const progressExportBtn = document.getElementById('export-progress');
const importPrompt = document.getElementById('import-prompt');
const progressImportBtn = document.getElementById('import-label');
const progressImportModal = document.getElementById('import-modal');
const progressImportInput = document.getElementById('import-progress');
const versionCompatibilityToggle = document.getElementById('import-compatibility');
const tooltipContainer = document.getElementById('tooltip-container');
const scaleNotesTooltip = document.getElementById('scale-tooltip-container');
const copyMoveBtn = document.getElementById('copy-move-button');
const copyMoveChunk = document.getElementById('copy-move-chunk');
const copyMovePosition = document.getElementById('copy-move-position');
const codeImportBtn = document.getElementById('import-code'); 
const findTimingRegex = /[0-9]+/;
const findNoteRegex = /\D+/i;
const findDoubleNoteRegex = /[a-z]+[+]+[a-z]+/i;
const findTripleNoteRegex = /[a-z]+[+]+[a-z]+[+]+[a-z]+/i;
const missingSeparatorRegex = /[0-9]+[a-z]+[0-9]+[a-z]+/i;
const MusicManager = {
	audioContext: '',
	audioBuffers: [],
	isSetup: false,
	isSampled: false,
	samplesArr: [],
	volumeControl: ''
};
const ImportManager = {
	initiator: ''
};
const DatabaseManager = {
	database: ''
};
const finalCode = [];
let showScaleClicks = 0;
let WrongNote = false;

// I cal this stuff 'rules', it translates input notes to shawzin code according to key - value pairs
const linesForTransposition = 
[
	0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6 //🎼
];
Object.freeze(linesForTransposition); 
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
	a:'B',b:'C',c:'E',d:'J',e:'K',f:'M',
	g:'R',h:'S',i:'U',j:'h',k:'i',l:'k'
};
Object.freeze(noteConvertRules);
const multiNoteConvertRules = 
{ 
	defghijkl:'/',deghjk:'7',efhikl:'+',dfgijl:'9',dgj:'5',ehk:'6',fil:'8',
	ghijkl:'3',hikl:'2',ghjk:'z',gijl:'1',il:'0',hk:'y',gj:'x',defjkl:'v',
	dejk:'r',dfjl:'t',efkl:'u',dj:'p',ek:'q',fl:'s',defghi:'f',efhi:'e',
	dfgi:'d',degh:'b',dg:'Z',eh:'a',fi:'c',jkl:'n',jk:'j',kl:'m',jl:'l',ghi:'X',
	hi:'W',gh:'T',gi:'V',def:'P',ef:'O',de:'L',df:'N',abc:'H',ab:'D',bc:'G',ac:'F'
};
Object.freeze(multiNoteConvertRules);
const notesAudioNames = 
[
	'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'
];
Object.freeze(notesAudioNames);
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
const octavesShawzin = [ //leave empty string for vanila shawzin, it doesn't have a name
	'Zariman','Grineer','Narmer','Lotus','Sentient','ZarimanVoid','DuviriErsatz','Duviri','Prime',''
];
Object.freeze(octavesShawzin);
const noteRelations = [
	['C4','D#4','F4','G4','A#4','C5','D#5','F5','G5','A#5','C6','D#6'],
	['C4','D4','E4','G4','A4','C5','D5','E5','G5','A5','C6','D6'],
	['C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4'],
	['C4','D#4','F4','F#4','G4','A#4','C5','D#5','F5','F#5','G5','A#5'],
	['C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5'],
	['C4','D4','D#4','F4','G4','G#4','A#4','C5','D5','D#5','F5','G5'],
	['C4','C#4','F4','F#4','A#4','C5','C#5','F5','F#5','A5','C6','C#6'],
	['C4','C#4','E4','F4','G4','G#4','A#4','C5','C#5','E5','F5','G5'],
	['C#4','D#4','F#4','G#4','A#4','C#5','D#5','F#5','G#5','A#5','C#6','D#6']
];
Object.freeze(noteRelations);

// Event listeners
scaleNotes.addEventListener('mouseenter', handleTooltip);
scaleNotes.addEventListener('mouseleave', handleTooltip);
translateBtn.addEventListener('click', translateNotes);
translateSheetBtn.addEventListener('click', translateNotes);
showScaleBtn.addEventListener('click', showScale);
databaseCopyBtn.addEventListener('click', copyDatabase);
transpositionIndex.addEventListener('click', () => { changeScale(); sheetBinding.transpose_lines(); });
transpositionIndex.addEventListener('input', () => { changeScale(); sheetBinding.transpose_lines(); });
databaseSearchBar.addEventListener('keyup', searchDatabase);
databaseSelector.addEventListener('click', databaseComment);
playerPlayBtn.addEventListener('click', setupTrack);
playerRightBtn.addEventListener('click', skipNotes);
playerLeftBtn.addEventListener('click', skipNotes);
scaleSelector.addEventListener('click', () => { MusicManager.isSampled = false; changeScale(); sheetBinding.transpose_lines(); });
shawzinsSelect.addEventListener('click', updateShawzinPic);
shawzinsSelect.addEventListener('click', () => { MusicManager.isSampled = false; });
shawzinPic.addEventListener('click', toggleShawzinModal);
shawzinPicModal.addEventListener('click', toggleShawzinModal);
progressResetBtn.addEventListener('click', progressClear);
progressResetModal.addEventListener('click', progressClear);
resetPrompt.addEventListener('click', progressClear);
resetPrompt.addEventListener('keyup', progressClear);
volumeSlider.addEventListener('input', () => { volumeOutput.value = `${volumeSlider.value}%` });
playheadSkipRange.addEventListener('click', setSkipAmount);
playheadSkipRange.addEventListener('input', setSkipAmount);
progressExportBtn.addEventListener('click', () => { exportProgress('ShawzinMC', JSON.parse(JSON.stringify(localStorage))); });
importPrompt.addEventListener('click', importProgressWarn);
importPrompt.addEventListener('keyup', importProgressWarn);
progressImportBtn.addEventListener('click', importProgressWarn);
progressImportModal.addEventListener('click', importProgressWarn);
progressImportInput.addEventListener('input', function() { importProgress(Array.from(this.files)); });
copyMoveBtn.addEventListener('click', function() { sheetBinding.copyPasteNotes(copyMoveChunk.value,copyMovePosition.value); });
codeImportBtn.addEventListener('click', importProgressWarn);

// Window/Document
window.onload = () => {
	progressLoad();
	sheetBinding.progress_load();
	for (let i=0; i<SAVES.length; i++) {
		SAVES[i].addEventListener('keydown', progressSave);
		SAVES[i].addEventListener('keyup', progressSave);
		SAVES[i].addEventListener('click', progressSave);
		SAVES[i].addEventListener('input', progressSave);
		SAVES[i].addEventListener('change', progressSave);
	}
	for (const button of copyBtns) { //multiple copy buttons for the same code
		button.addEventListener('click', copyCode);
		button.classList.add('translation-block');
	}
	for (const button of translateBtns) { //multiple copy buttons for the same code
		button.addEventListener('click', errorStyle);
	}
	volumeOutput.value = `${volumeSlider.value}%`;
	changeScale();
	//sheetBinding.generateNoteSheet(4097); //+1 for the note labels
	updateShawzinPic();
	versionControl();
	setSkipAmount();
	document.addEventListener('keyup', handleKeyboard);
	document.addEventListener('keydown', handleKeyboard);
};

// Loads progress from local storage (if empty -> save progress)
function progressLoad() {
	for (let i=0; i<SAVES.length; i++) {
		if (SAVES[i].id === noteSheet.id || SAVES[i].classList.contains('player-buttons')) { 
			continue; 
		};
		let load = JSON.parse(localStorage.getItem(SAVES[i].id));
		if (load != null) {
			if (SAVES[i].type === 'checkbox') {
				SAVES[i].checked = load;
			} else {
				SAVES[i].value = load;
			}
		} else {
			progressSave.call(SAVES[i]);
		};
	};
};

// Saves progress to local storage
function progressSave() {
	if (this.id === noteSheet.id) {
		localStorage.setItem(this.id, JSON.stringify(sheetBinding.noteSheetArr));
	} else if (this.classList.contains('player-buttons')) {
		localStorage.setItem('starting_time', JSON.stringify(sheetBinding.startingTime));
	} else if (this.type === 'checkbox') {
		localStorage.setItem(this.id, JSON.stringify(this.checked));
	} else {
		localStorage.setItem(this.id, JSON.stringify(this.value));
	};
};

// Clears progress from local storage
function progressClear(event) {
	if (this.id === progressResetBtn.id) {
		progressResetModal.style.display = "block";
		resetPrompt.focus();
	};

	if (event.key === 'Escape' || event.target.id === progressResetModal.id) {
		progressResetModal.style.display = "none";
		resetPrompt.value = '';
	};

	if (this.value) {
		if (this.value.toLowerCase() === 'confirm') {
			alert(`All saved progress will be deleted.`);
			localStorage.clear();
			progressResetModal.style.display = "none";
			resetPrompt.value = '';
		};
	};
};

// Exports progress.json file
function exportProgress(fileName, file) {
	fileName = `${fileName}_${new Date().toLocaleString().split(', ')[0]}`;
	const fileBlob = new Blob([JSON.stringify(file, undefined, 2)], {
    	type: 'application/json'
	});

	if (window.navigator.msSaveOrOpenBlob) {
    	window.navigator.msSaveBlob(fileBlob, `${fileName}.json`);
    	return;
  	};
  	//fallback 🡓
 	const elem = window.document.createElement('a');
 	const url = window.URL.createObjectURL(fileBlob)
  	elem.href = url;
  	elem.download = `${fileName}.json`;
  	elem.style = 'display: none';        
  	document.body.appendChild(elem);
  	elem.dispatchEvent(new MouseEvent('click'));     
  	document.body.removeChild(elem);
  	URL.revokeObjectURL(url);
};

// Imports progress.json file
function importProgress(filesArr) {
	if (filesArr.length < 1) {
		alert(`Error: 0 files selected.`);
		return;
	};

	const fileFilter = [];
	for (const file of filesArr) {
		if (file.type !== 'application/json') {
			alert(`Error: only '.json' files are accepted.`);
			return;
		}
		fileFilter.push(file);
	};

	let previous = 0;
	let newestFile = null; 
	for (const file of fileFilter) { //fish out the fresh file 
		if (file.lastModified > previous) {
			newestFile = file;
			previous = file.lastModified;
		};
	};
	const fReader = new FileReader();
	fReader.addEventListener('load', () => { load_progress(fReader.result); });
	if (newestFile) {
		fReader.readAsText(newestFile);
	};

	function load_progress(file) {
		try {
			const importStorage = JSON.parse(file);
			const versionWindow = document.getElementById('last-update');
			const currentMatch = versionWindow.textContent.match(/\d+/g);
			let importMatch;
			try {
				importMatch = importStorage.version.match(/\d+/g);
			} catch (err) {
				alert(`Import Error: import file doesn't contain app version.`);
				return;
			};
			const currentVersion = (Number(currentMatch[0])*100) + (Number(currentMatch[1])*10) + (Number(currentMatch[2])*1);
			const importVersion = (Number(importMatch[0])*100) + (Number(importMatch[1])*10) + (Number(importMatch[2])*1);	
			if (versionCompatibilityToggle.checked && currentVersion>importVersion) {
				alert(`Import Error: import version is older than app version.`);
				return;
			};
			localStorage.clear();
			for (const [key, value] of Object.entries(importStorage)) {
				localStorage.setItem(key, value);
			};
			location.reload();
		} catch (err) {
			alert(`Unexpected Error: ${err}`);
		};
	};
};

// Interprets shawzin code as notes and overwrites the app
function importShawzinCode(input = notesInput.value) {
	if (input == null) {
		alert(`Code Import Error: empty input.`);
		return;
	};
	if (input.includes(',') || input.includes(' ') || input.includes('\n')) {
		alert(`Code Import Error: not a valid shawzin code structure.`);
		return;
	};
	const finalArr = [];
	const codeArr = input.split('');
	const scaleNum = codeArr.shift();
	if (isNaN(scaleNum) || scaleNum<1 || scaleNum>9) {
		alert(`Code Import Error: first character must be a scale number 1-9.`);
		return;
	};
	if (codeArr.length%3 !== 0 || codeArr.length > 12288 || codeArr.length < 3) {
		alert(`Code Import Error: invalid shawzin code length.`);
		return;
	};
	const notesArr = [];
	while (codeArr.length) { //split code into bits of [note+timing, note+timing...]
		notesArr.push(codeArr.splice(0,3).join(''));
	};
	//flip the rules backwards to now convert code into notes
	const ruleObj = {};
	for (const [key, value] of Object.entries(noteConvertRules)) {
		ruleObj[value] = key;
	};
	for (const [key, value] of Object.entries(multiNoteConvertRules)) {
		ruleObj[value] = key; 
	};
	const noteRules = {
		'11':'a','10':'b','9':'c','8':'d','7':'e','6':'f','5':'g','4':'h','3':'i','2':'j','1':'k','0':'l'
	};
	
	//overwrite the note sheet aray with 0s\\
	for (let y=0; y<12; y++) {
		for (let x=0; x<sheetBinding.noteSheetArr[0].length; x++) {
			sheetBinding.noteSheetArr[y][x] = 0;
		};
	};
	//interpret code as notes\\
	for (let x=0; x<notesArr.length; x++) { 
		let note = ruleObj[notesArr[x][0]];
		let timing = (timingConvertRules.indexOf(notesArr[x][1])*64)+(timingConvertRules.indexOf(notesArr[x][2]))+1;
		if (note == null || timing == null) {
			alert(`Code Import Error: invalid shawzin code, note/timing is incorrect/missing.`);
			return;
		};
		//imprint the active notes onto the note sheet\\
		for (let y=0; y<12; y++) {
			if (note.includes(noteRules[y])) {
				sheetBinding.noteSheetArr[y][timing-1] = 1;
			};
		};

		if (note.length>1) {
			note = note.split('').join('+');
		};
		finalArr.push(`${timing}${note}`);
	};
	
	notesInput.value = finalArr.join(',');
	scaleSelector.value = scaleNum-1;
	sheetBinding.refreshSheet();
	//save progress
	progressSave.call(sheetBinding.tableElement);
	scaleSelector.click();
	notesInput.click();
	codeImportBtn.classList.add('translation-success');
	clearEfects(codeImportBtn, 'translation-success', 2000);
};

// Asks for confirmation before importing progress
function importProgressWarn(event) {
	if (this.id === progressImportBtn.id || this.id === codeImportBtn.id) { //reusing the same modal for different functions
		progressImportModal.style.display = "block";
		importPrompt.focus();
		ImportManager.initiator = this;
	};

	if (event.key === 'Escape' || event.target.id === progressImportModal.id) {
		progressImportModal.style.display = "none";
		importPrompt.value = '';
	};

	if (this.value) {
		if (this.value.toLowerCase() === 'override') {
			alert(`All saved progress will be rewritten.`);
			if (ImportManager.initiator.id === progressImportBtn.id) {
				progressImportInput.click();
			} else if (ImportManager.initiator.id === codeImportBtn.id) {
				importShawzinCode();
			};
			progressImportModal.style.display = "none";
			importPrompt.value = '';
		};
	};
};

// Translates notes and timings from the main input field
function translateNotes(event) {
	finalCode.length = 0;
	let notes;
	if (event?.target?.id === translateBtn.id) {
		notes = notesInput.value.split(',');
	} else if (event?.target?.id === translateSheetBtn.id) {
		notes = sheetBinding.noteSheetCollector();
	} else if (event?.id === 'sheetBinding') {
		notes = sheetBinding.noteSheetCollector();
	};

	if (!notes.length || !notes[0]) { 
		WrongNote = true;
		errorStyle;
		alert(`Note Error: The field/sheet is empty.`);
		return;
	};

	for (let i=0; i<notes.length; i++) {
		notes[i] = notes[i].replace(/\s+/gi, '');
		notes[i] = notes[i].replace(/\n+/gi, '');
		if (notes[i].match(missingSeparatorRegex) != null) {
			WrongNote = true;
			errorStyle;
			alert(`Note Error: Missing separator for note №${i+1}.`);
			return;
		} else {
			WrongNote = false;
			errorStyle;
		};
	};

	for (let i=0; i<notes.length; i++) {
		let timing = false; 
		let note = false; 
		try {
			timing = Number(notes[i].match(findTimingRegex)[0])-1;
			note = notes[i].toLowerCase().match(findNoteRegex)[0];
			//console.log(`%cNote conversion check, timing: ${timing} notes: ${note}`, 'color:gold');
		} finally {
			if (timing !== false && note !== false) {
				WrongNote = false;
				errorStyle;
			} else {
				WrongNote = true;
				errorStyle;
				alert(`Note Error: Timing or note №${i+1} is incorrect/missing.`);
				return;
			};
		};
		convertNote(note, timing+1);
		convertTiming(timing);
		if (WrongNote === true) {
			return;
		};
	};
	finalCode.unshift(Number(scaleSelector.value) + 1);
	console.log(finalCode);
}

//Converts timing into shawzin code: ranges from [AA-AZ, Aa-Az, A0-A9, A+, A/] to [/A-/Z, /a-/z, /0-/9, /+, //]
function convertTiming(position) {
	let range = timingConvertRules[Math.floor(position/64)];
	for (let i=2; i<=64; i++) {
		if (position <= -1) {
			WrongNote = true;
			errorStyle;
			alert(`Timing Error: start first note position from 1+.`);
			return;
		} else if (position < 64) {
			finalCode.push(range+timingConvertRules[position]);
			return;
		} else if (position < (64*i)) {
			finalCode.push(range+timingConvertRules[position-(64*(i-1))]);
			return;
		} else if (i>=64) { 
			WrongNote = true;
			errorStyle;
			alert(`Timing Error: Wrong timeline position, note #${position} range must be 1-4096.`)
			return; 
		};
	};
};

// Checks and converts note
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
			};
    	};
    	if (matchedNoteKey === false) {
			WrongNote = true;
			errorStyle;
			alert(`Note Error: combination #${position} is not valid.`);
			return;
    	};
	} else {
		let result = noteConvertRules[note];
		if (result != null) {
			finalCode.push(result);
			WrongNote = false;
			errorStyle;
		} else {
			WrongNote = true;
			errorStyle;
			alert(`Note Error: note #${position} is not a valid note.`);
			return;
		};
	};
};

//Style changes if translation error occurs
function errorStyle() {
	if (!WrongNote) {
		for (const button of translateBtns) {
			button.classList.remove('translation-error');
			button.classList.add('translation-success');
		};
		for (const button of copyBtns) {
			button.classList.remove('translation-block');
		};
	} else {
		for (const button of translateBtns) {
			button.classList.remove('translation-success');
			button.classList.add('translation-error');
		};
		for (const button of copyBtns) {
			button.classList.add('translation-block');
		};
	};
};

//Copies final code to clipboard
function copyCode() {
	const result = finalCode.join('');
	if (!WrongNote) {
		navigator.clipboard.writeText(result);
		for (const button of copyBtns) {
			button.classList.add('translation-success');
			clearEfects(button,'translation-success',1500);
		};
	}; 
};

// Transposes notes by moving the lines number up or down
function transposeNotes(event) {
	if (transpositionIndex.value > 11) {
		transpositionIndex.value = 11;
	};
	if (transpositionIndex.value < -11) {
		transpositionIndex.value = -11;
	};
	const num = (transpositionIndex.value*0.5);
	let transposedLines = [];
	for (let i=linesForTransposition.length-1; i>-1; i--) {
		let item = linesForTransposition[i] + num;
		if (item<1) { //get rid of 0 and extra =#, 'pull up' the numbers a bit 
			item-=1;
		};
		if (Number.isInteger(item)) {
			if (item === 2) {
				transposedLines.push(`(${item})🎼`);//\uD834\uDD1E
			} else {
				transposedLines.push(`(${item})`);
			}
		} else {
			transposedLines.push('==)');
		};
	};
	return transposedLines;
};

// Shows\hides scale
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
	};	
}; 

//Changes scale display
function changeScale() {
	const transposedLines = transposeNotes();
	const rect = scaleNotes.getBoundingClientRect();
	scaleNotes.innerHTML = '';
	scaleNotesTooltip.innerHTML = '';
	for (let y=0; y<12; y++) {
		const newTR = document.createElement('tr');
		for (let x=0; x<14; x++) {
			const newTD = document.createElement('td');
			if (x<1) {
				newTD.textContent = `${transposedLines[y]}`;
			};
			if (x === 12-y) {
				newTD.textContent = `[${notesAudioNames[y]}]`;
				//newTD.setAttribute('data-title', `${noteRelations[scaleSelector.value][11-y]}`);
			} else if (x === 13-y) {
				newTD.textContent = `{${noteRelations[scaleSelector.value][11-y]}}`;
				newTD.classList.add('mouseover-notes');
			}
			newTR.appendChild(newTD);
		};
		scaleNotes.appendChild(newTR);
	};
};

// Custom tooltip handling
function handleTooltip(event) {
	if (event.type === 'mouseenter') {
		for (const cell of document.querySelectorAll('.mouseover-notes')) {
			cell.style.visibility = 'visible';
		}
	} else {
		for (const cell of document.querySelectorAll('.mouseover-notes')) {
			cell.style.visibility = 'hidden';
		}
	};
};

//Fetch database
async function fetchDatabase() {
	const response = await fetch('database.json');
	DatabaseManager.database = await response.json();
	DatabaseManager.database.sort((a,b) => { //strings can be compared for alphabetical order in js and will give a boolean, hwat?????
		if (a.name.toLowerCase() < b.name.toLowerCase()) {
			return -1;
		}
		if (a.name.toLowerCase() < b.name.toLowerCase()) {
			return 1;
		}
		return 0;
	});
	const database = DatabaseManager.database;
	for (let i=0; i<database.length; i++) {
		renderDatabaseOptions(i);
	};
};
fetchDatabase();

//Searches for a name/band of the songs in the database
function searchDatabase(event, database = DatabaseManager.database) {
	databaseSelector.innerHTML = `<option></option>`;
	databaseSelector.remove(0);
	if (databaseSearchBar.value == '') {
		for (let i=0; i<database.length; i++) {
			renderDatabaseOptions(i);
		};
		return;
	};
	let matches = 0;
	for (let i=0; i<database.length; i++) {
		if (database[i].name.toLowerCase().includes(databaseSearchBar.value.toLowerCase()) || database[i].band.toLowerCase().includes(databaseSearchBar.value.toLowerCase())) {
			matches++;
			renderDatabaseOptions(i);
		};
	};
	if (matches<1) {
		databaseSelector.innerHTML = `<option>No results</option>`;
	};
	databaseComment();
};

// Overwrites the database selector
function renderDatabaseOptions(i, database = DatabaseManager.database) {
	//calculates length of the song\\
	const lastTimingLetters = database[i].code.slice(-2).split('');
	const beats = (timingConvertRules.indexOf(lastTimingLetters[0])*64) + (timingConvertRules.indexOf(lastTimingLetters[1]));
	const miliseconds = beats*62.5;
	const seconds = Math.floor(miliseconds/1000);
	const minutes = Math.floor(seconds/60);
	let extraSeconds = seconds % 60;
	extraSeconds = extraSeconds<10 ? `0${extraSeconds}` : extraSeconds;
 	const runtime = `${minutes}:${extraSeconds}`;
 	//for each song creates an option element and appends it to the database selector\\
	const opt = document.createElement('option');
	opt.value = i;
	opt.textContent = `${database[i].name} - ${database[i].band} - ~${runtime}`;
	opt.setAttribute('data-index', i);
	databaseSelector.appendChild(opt);
};

// Copies song code from database
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
		};
	};
};

// Adds meta commentary to selected codes
function databaseComment() {
	const option = databaseSelector.options[databaseSelector.selectedIndex];
	if (option.textContent === 'No results') {
		databaseSelector.setAttribute('title', `well... maybe check in later?`);
		return;
	};
	const index = Number(option.dataset.index);
	if (DatabaseManager.database[index].message) {
		databaseSelector.setAttribute('title', DatabaseManager.database[index].message);
	} else {
		databaseSelector.removeAttribute('title');
	};
};

// Updates shawzin picture near shawzin selector
function updateShawzinPic() {
	shawzinPic.src = `images/${shawzinsSelect.value}.png`;
	shawzinPic.alt = `${shawzinsSelect.value}`;
};

// Toggles shawzin modal
function toggleShawzinModal() {
	if (this.id === 'shawzin-pic') {
		shawzinPicModal.style.display = "block";
		shawzinPicModalImg.src = shawzinPic.src;
		shawzinPicModalCaption.textContent = shawzinPic.alt;
	} else {
		shawzinPicModal.style.display = "none";
	}
}

// Creates js-html binding
class NoteTableBinding {
	constructor(table, label) {
		this.labelElement = label;
		this.tableElement = table;
		this.noteSheetArr = []; //2d array representation of the note sheet table
		this.id = 'sheetBinding';
		this.continuePlaying = false;
		this.startingTime = 0;
		this.skipSize = 4;
	};

	// Generates interactable note sheet
	generateNoteSheet(noteLength, isGenerating) {
		if (isGenerating) { //clear array, table, label
			this.noteSheetArr.length = 0;
			this.tableElement.innerHTML = ''; 
			this.labelElement.innerHTML = ''; 
		}; 

		for (let y=0; y<12; y++) {
			const newTR = document.createElement('tr');
			newTR.id = `tr-${y}`;
			newTR.className = `sheet-table-rows`;
			this.tableElement.appendChild(newTR);
			if (isGenerating) { 
				this.noteSheetArr.push([]); 
			};

			for (let x=0; x<noteLength; x++) {
				const newTD = document.createElement('td');
				newTD.id = `td-${x}-tr-${y}`;
				newTD.className = `sheet-table-cells`;
				const div = document.createElement('div'); //insert into cells for better control over size and content
				div.classList.add('cell-divs-basic');
				if (!isGenerating && this.noteSheetArr[y][x-1] === 1) { 
					div.classList.add('cell-on'); 
				};
				
				if (x !== 0) {
					newTD.addEventListener('click', this.updateNoteCell.bind(this));// overwrite 'this' to be the class and not the source of the event.
					if (isGenerating) { 
						this.noteSheetArr[y].push(0); 
					};
					div.style.fontSize = "22px";
					div.style.fontWeight = "bold";
				};
				if (x%16 === 0) {
					newTD.style.borderRight = "4px solid rgb(178, 51, 3)";
					if (y === 11) {
						div.textContent = `${x} {${x/16}}`;
					};
				} else if (x%8 === 0) {
					newTD.style.borderRight = "2px solid rgb(255, 95, 35)";
					if (y === 11) {
						div.textContent = `${x}`;
					};
				} else if (x%4 === 0) {
					newTD.style.borderRight = "1px solid rgb(25, 0, 103)"
					if (y === 11) {
						div.textContent = `${x}`;
					};
				};
				if (y === 11) {
					div.style.padding = '5px 2px 0 2px';
				};	
				if (x === 0) {
					const labelTR = document.createElement('tr');
					labelTR.id = `tr-${y}`;
					labelTR.className = `sheet-table-rows`;
					newTD.style.border = "1px solid black";
					div.classList.remove('cell-divs-basic');
					div.classList.add('cell-divs-labels');
					newTD.appendChild(div);
					labelTR.appendChild(newTD);
					this.labelElement.appendChild(labelTR);
					this.labelElement.style.boxShadow = "0px 0px 10px 5px rgba(31, 28, 99, 1.0)";
					this.labelElement.style.border = "8px solid #261C63"; 
					this.labelElement.style.borderRight = "0";
				} else {
					newTD.appendChild(div);
					newTR.appendChild(newTD);
				};
			};
		};
	};

	// Collects notes from note sheet
	noteSheetCollector() {
		let returnedNotes = [];
		for (let x=0; x<this.noteSheetArr[0].length; x++) { //loop for columns to be played
			let activeNotes = []; 
			for (let y=0; y<this.noteSheetArr.length; y++) { //loop for rows to be played
				if (this.noteSheetArr[y][x] === 1) {
					activeNotes.push(`${notesAudioNames[y]}`);
				};
			};
			if (activeNotes.length>=1) { //connect notes by "+" if we have more than one 
				let finalNotes = `${x+1}${activeNotes.join('+')}`; //add correct timing number
				returnedNotes.push(finalNotes); //{timing}{note/s and +},{timing}{note/s and +}......
			};
		};
		return returnedNotes;
	};

	// Updates note sheet cells
	updateNoteCell(event) { 
		const cell = event.currentTarget;
		const div = cell.children[0];
		const cellY = Number(cell.id.match(/(?<=tr-)\d+/i)[0]);
		const cellX = Number(cell.id.match(/(?<=td-)\d+/i)[0]-1);
		if (this.noteSheetArr[cellY][cellX] !== 1) {
			//Note ON
			div.classList.remove(...['cell-on-err', 'cell-off-err']);
			div.classList.add('cell-on');
			this.noteSheetArr[cellY][cellX] = 1;
			div.textContent = div.textContent.replace('⚠️', '');
		} else {
			//Note OFF
			div.classList.remove(...['cell-on', 'cell-on-err', 'cell-off-err']);
			this.noteSheetArr[cellY][cellX] = 0;
			div.textContent = div.textContent.replace('⚠️', '');
		};
		//this.errorCell(div, {y: cellY, x: cellX});
		this.combinationHint(undefined, [cellX]);
	};

	// Checks the note sheet arr and compares to current state of cells
	refreshSheet(chunkLength = 4096, newPosition = 0) {
		const cellsToHint = [];
		for (let y=0; y<12; y++) { //overwrite notes starting from newPosition
			for (let x=0; x<chunkLength; x++) {
				if (newPosition+x > this.noteSheetArr[0].length-1) { //don't overshoot
					break;
				};

				const currentCell = document.getElementById(`td-${newPosition+x+1}-tr-${y}`);
				if (this.noteSheetArr[y][newPosition+x] === 1){
					currentCell.children[0].classList.add('cell-on');
				} else {
					currentCell.children[0].classList.remove('cell-on');
				};
				cellsToHint.push(x);
			};	
		};
		this.combinationHint(undefined, cellsToHint);
	};

	// Make cell display an error 
	errorCell(div, coords) {
		/*if (WrongNote) {
			if (this.noteSheetArr[coords.y][coords.x] === 0) {
				//Note OFF err
				div.classList.remove(...['cell-on-err', 'cell-on']);
				div.classList.add('cell-off-err');
			} else {
				//Note ON err
				div.classList.remove(...['cell-off-err', 'cell-on']);
				div.classList.add('cell-on-err');
			};
			if (!div.textContent.includes('⚠️')) {
				div.textContent = `${div.textContent}⚠️`;
			};
		};*/
		//this.combinationHint();
	};

	// Hint allowed combinations
	combinationHint(notes = this.noteSheetCollector(), coords) {
		for (let x=0; x<coords.length; x++) {
			for (let y=0; y<this.noteSheetArr.length; y++) { //clear heat class for all note-columns provided
				const currentCell = document.getElementById(`td-${coords[x]+1}-tr-${y}`);
				currentCell.classList.remove(`${currentCell.className.match(/(cell-heat-)+\d+/ig)}`); //clear the heat class
			};			
		};
		if (notes.length < 1) { //empty note sheet
			return;
		};  
		const noteRules = {
			a:11,b:10,c:9,d:8,e:7,f:6,g:5,h:4,i:3,j:2,k:1,l:0
		};
		const entries = Object.entries(multiNoteConvertRules);
		for (let n=0; n<notes.length; n++) { //iterate over all notes provided, on the x-axis
			const match = notes[n].match(/[a-z]+/gi).join('').toLowerCase();
			let regexBuild = `.*`;
			for (let s=0; s<match.length; s++) { //find all (match[0]|match[1]|......)characters in any order and space apart at least once
				regexBuild += `[${match}]+.*`;
			};
			const regex = new RegExp(regexBuild, 'ig');
			//const regex = new RegExp(`.*(${match}){${match.replaceAll('|', '').length}}.*`, 'ig'); //find (match[0]|match[1]|......)characters (match length without '|')times in a row
			let accumulator = '';
			for (let i=0; i<entries.length; i++) {//iterate over all keys in rules
				if (regex.test(entries[i][0])) {
					accumulator += `${entries[i][0]}`;
				};
			};
			const result = [...new Set(accumulator)]; //a trick to turn a set into array
			const x = Number(`${notes[n].match(/\d+/gi)}`);
			for (let y=0; y<result.length; y++) {//iterate over cells on the note sheet 
				const currentCell = document.getElementById(`td-${x}-tr-${noteRules[`${result[y]}`]}`);
				const cellRegex = new RegExp(`${result[y]}{1}`, 'ig');
				currentCell.classList.remove(`${currentCell.className.match(/(cell-heat-)+\d+/ig)}`); //clear the heat class
				currentCell.classList.add(`cell-heat-${accumulator.match(cellRegex).length}`);
			};
		};
	};

	// Render the playhead at the page reload
	initPlayhead(time = this.startingTime, loading, animation) {
		const x=0||time;
		if (loading) {
			for (let y=0; y<this.noteSheetArr.length; y++) { //loop for rows to be colored
				const currentCell = document.getElementById(`td-${x}-tr-${y}`);
				currentCell.classList.add('cell-playing');
			};
		};
		const interest = document.getElementById('note-sheet-container');
		if (animation === 'fast') {
			interest.style.scrollBehavior = 'auto';
		} else {
			interest.style.scrollBehavior = 'smooth';
		};
		const noteSize = 38.437;
		interest.scrollTo(((noteSize*x)-4), 0); //put the playhead in view
	};

	// Copies notes chunk from startNote-endNote to another position
	copyPasteNotes(noteChunk, newPosition) {
		try {
			if (noteChunk.match(/\D/gi).join('') !== '-') {
				alert(`Copy-paste Error: invalid 'from' structure, must be startingNote-endingNote.`);
				return;
			};
		} catch (err) {
			alert(`Unexpected Error: ${err}`);
			return;
		};
		const chunkStart = Number(noteChunk.split('-')[0])-1;
		const chunkEnd = Number(noteChunk.split('-')[1]);
		if (chunkStart>chunkEnd) {
			alert(`Copy-paste Error: invalid 'from' number, startingNote must be <= endingNote.`);
			return;
		};
		if (chunkStart<0 || chunkEnd<1 || chunkStart>4095 || chunkEnd>4096) {
			alert(`Copy-paste Error: invalid 'from' number, acceptable range is 1-4096.`);
			return;
		};
		newPosition = Number(newPosition)-1;
		if (newPosition > this.noteSheetArr[0].length-1 || newPosition<0) {
			alert(`Copy-paste Error: invalid 'to' number, acceptable range is 1-4096.`);
			return;
		};
		const copiedArr = [];

		for (let y=0; y<this.noteSheetArr.length; y++) { //copy chunk
			copiedArr.push([]);
			for (let x=chunkStart; x<chunkEnd; x++) {
				copiedArr[y].push(this.noteSheetArr[y][x]);
			};	
		};
		for (let y=0; y<copiedArr.length; y++) { //overwrite notes starting from newPosition
			for (let x=0; x<copiedArr[y].length; x++) {
				if (newPosition+x > this.noteSheetArr[0].length-1) { //don't overshoot
					break;
				};

				this.noteSheetArr[y][newPosition+x] = copiedArr[y][x];
			};	
		};
		progressSave.call(this.tableElement); //secure the new notes
		this.refreshSheet(copiedArr[0].length, newPosition);
		copyMoveBtn.classList.add('translation-success');
		clearEfects(copyMoveBtn, 'translation-success', 2000);
	};

	// Updates line numbers near the note names
	transpose_lines() {
		const transposedLines = transposeNotes();
		for (let y=0; y<this.noteSheetArr.length; y++) { //loop for rows to be colored
			const div = document.getElementById(`td-0-tr-${y}`).children[0];
			div.innerHTML = `${notesAudioNames[y]} <sub>${transposedLines[y]}</sub>`;
			div.setAttribute('title', `${noteRelations[scaleSelector.value][11-y]}`);
			div.style.cursor = 'help'; 
		};
	};

	// Special progress load
	progress_load() {
		const loadA = JSON.parse(localStorage.getItem(noteSheet.id));
		const loadB = JSON.parse(localStorage.getItem('starting_time'));
		if (loadA != null) {
			this.noteSheetArr = loadA;
			this.generateNoteSheet(4097, false);
		} else {
			this.generateNoteSheet(4097, true);
			progressSave.call(this.tableElement);
		};
		if (loadB != null) {
			this.startingTime = loadB;
		} else {
			progressSave.call(playerPlayBtn); //any player button will do
		};
		this.transpose_lines();
		this.initPlayhead(...[,true,'fast']);
	};
};
const sheetBinding = new NoteTableBinding(noteSheet, document.getElementById("notes-list"));

// Deals with forward/backward skip buttons  
async function skipNotes(event, time, skipSize = sheetBinding.skipSize) {
	if (sheetBinding.continuePlaying === true) {
		playerPlayBtn.click();
		await Delay(700);
	};
	time = time||sheetBinding.startingTime;
	let x=0||time;

	for (let y=0; y<sheetBinding.noteSheetArr.length; y++) { //loop for rows to be cleared
		let currentCell = document.getElementById(`td-${x}-tr-${y}`);
		currentCell.classList.remove('cell-playing');
	};

	if (event?.target?.id === playerRightBtn.id || event === 'right') { 
		sheetBinding.startingTime<=(4096-skipSize) ? sheetBinding.startingTime+=skipSize : sheetBinding.startingTime=4096;
	} else {
		sheetBinding.startingTime>=skipSize ? sheetBinding.startingTime-=skipSize : sheetBinding.startingTime=0;
	};
	
	x = sheetBinding.startingTime;
	for (let y=0; y<sheetBinding.noteSheetArr.length; y++) { //loop for rows to be colored
		let currentCell = document.getElementById(`td-${x}-tr-${y}`);
		currentCell.classList.add('cell-playing');
	};
	sheetBinding.initPlayhead(x, false, '');
};

// Sets amount of columns(notes) to skip
function setSkipAmount(event, skipSize = Number(playheadSkipRange.value)) {
	if (skipSize == '') {
		sheetBinding.skipSize = 4;
	} else {
		if (skipSize > 4096) {
			playheadSkipRange.value = 4096;
		};
		if (skipSize < 1) {
			playheadSkipRange.value = 1;
		};
		sheetBinding.skipSize = skipSize;
	};
};

// Sets up the track
async function setupTrack(event, speed = 62.5, time = sheetBinding.startingTime) {
	if (slowModeToggle.checked) {
		speed = 125;
	};
	if (event.target.src.includes(`images/player-buttons-play.png`)) {
		event.target.src = `images/player-buttons-pause.png`;
		sheetBinding.continuePlaying = true;
		if (!MusicManager.isSetup) {
			try {
				MusicManager.audioContext = new AudioContext();
				console.log(`%cAudio Context was set up.`, 'color:gold');
				MusicManager.isSetup = true;
			} catch(err) {
				alert(`Unexpected Error: ${err}`);
				return;
			};
		};
		if (!MusicManager.isSampled) {
			try {
				MusicManager.audioBuffers = await setupAudioBuffers(octaveNotes);
				console.log(`%cAudio buffers were loaded.`, 'color:gold')
				MusicManager.isSampled = true;
			} catch(err) {
				alert(`Unexpected Error: ${err}`);
				return;
			};
		};
		for (let x=0||time; x<sheetBinding.noteSheetArr[0].length; x++) { //loop for columns to be played
			const activeNotes = []; 
			for (let y=0; y<sheetBinding.noteSheetArr.length; y++) { //loop for rows to be played
				if (sheetBinding.noteSheetArr[y][x] === 1) {
					activeNotes.push(MusicManager.audioBuffers[y]);
				};
				const currentCell = document.getElementById(`td-${x}-tr-${y}`);
				currentCell.classList.add('cell-playing');
				if (x>0) {
					const previousCell = document.getElementById(`td-${x-1}-tr-${y}`);
					previousCell.classList.remove('cell-playing');
				};
			};
			await Delay(speed); //16 notes(columns) per second max
			playTrack(activeNotes, undefined, speed);
			if (x%20 === 0) { //scroll every 20 cells
				sheetBinding.initPlayhead(x, false, 'fast');
			};
			if (sheetBinding.continuePlaying == false) {
				sheetBinding.startingTime = x;
				sheetBinding.initPlayhead(...[,false,'']);
				progressSave.call(this);
				/*
				await Delay(speed+10);
				for (let i=0; i<MusicManager.samplesArr.length; i++) { //old samples being stopped and deleted
					MusicManager.samplesArr[i].stop();
					MusicManager.samplesArr[i].disconnect();
				};
				MusicManager.samplesArr.length = 0;
				*/
				return;
			};
		};
	} else {
		event.target.src = `images/player-buttons-play.png`;
		sheetBinding.continuePlaying = false;
		sheetBinding.initPlayhead(...[,false,'']);
		/*
		await Delay(speed+10);
		for (let i=0; i<MusicManager.samplesArr.length; i++) { //old samples being stopped and deleted
			MusicManager.samplesArr[i].stop();
			MusicManager.samplesArr[i].disconnect();
		};
		MusicManager.samplesArr.length = 0;
		*/
	};
};

// Load audio file
async function getAudio(filePath) { 
	const response = await fetch(filePath);
	const arrayBuffer = await response.arrayBuffer();
	const audioBuffer = await MusicManager.audioContext.decodeAudioData(arrayBuffer);
	return audioBuffer;	
};

// Handle audio files
async function setupAudioBuffers(notes) {
	const audioBuffers = [];
	const selectedScale = scaleSelector.options[scaleSelector.selectedIndex].text.split(' ');
	for (let i=0; i<notes[0].length; i++) {			//what shawzin 												//what note (octave)
		const sample = await getAudio(`audio/Octaves/${octavesShawzin[shawzinsSelect.selectedIndex]}ShawzinOct${notes[scaleSelector.selectedIndex][i]}.ogg`);
		audioBuffers.push(sample);
	};
	return audioBuffers;
};

// Play columns of notes
async function playTrack(audioBufferArr = MusicManager.audioBufferArr, time = 0, speed) {
	if (!audioBufferArr[0]) {
		return;
	};

	if (MusicManager.volumeControl == '') { //set up volume node
		MusicManager.volumeControl = MusicManager.audioContext.createGain();
		MusicManager.volumeControl.connect(MusicManager.audioContext.destination);
	};

	MusicManager.volumeControl.gain.value = volumeSlider.value / 200;
	const oldLength = MusicManager.samplesArr.length;

	for (let i=0; i<audioBufferArr.length; i++) { //sample settings
		const sampleSource = new AudioBufferSourceNode(MusicManager.audioContext, {buffer: audioBufferArr[i]});
		sampleSource.connect(MusicManager.volumeControl);
		MusicManager.samplesArr.push(sampleSource);
	};
	for (let i=oldLength; i<MusicManager.samplesArr.length; i++) { //fresh samples being played
		MusicManager.samplesArr[i].start(time);
	};

	await Delay(speed);
	for (let i=0; i<oldLength; i++) { //old samples being stopped and deleted
		MusicManager.samplesArr[i].stop();
		MusicManager.samplesArr[i].disconnect();
	};
	MusicManager.samplesArr.splice(0,oldLength);
	/*
		I'm deleting old samples 1 note after adding and playing new ones	
		so the program doesn't sound jerky, 
		a little overlap will smooth out the note transitions
	*/
};

// Version control
async function versionControl() {
 	const containerList = document.querySelector('#patch-notes-container > ol');
 	const response = await fetch('patchnotes.json');
	const patchnotes = await response.json();
	for (let i=0; i<patchnotes.length; i++) {
		let onion = { //complicated nesting
			layer1: document.createElement('li'), 
			layer2: document.createElement('span'),
			layer3: document.createElement('ul'),
			get layers() {
				this.layer2.innerHTML = `<h3 style="display: inline-block">${patchnotes[i].title}</h3> <code style="display: inline-block">${digestDate(patchnotes[i].date)}</code>`;
				for (let x=0; x<patchnotes[i].description.length; x++) {
					let newLi = document.createElement('li');
					newLi.textContent = `${patchnotes[i].description[x]}`;
					if (patchnotes[i].subdescription[`${x}`] && patchnotes[i].subdescription[`${x}`].length>0) {
						let newUl = document.createElement('ul');
						for (let y=0; y<patchnotes[i].subdescription[`${x}`].length; y++) {
							let newSubLi = document.createElement('li');
							newSubLi.textContent = `${patchnotes[i].subdescription[`${x}`][y]}`;
							newUl.appendChild(newSubLi);
						}
						newLi.appendChild(newUl);
					}
					this.layer3.appendChild(newLi);
				}
				this.layer1.appendChild(this.layer2);
				this.layer1.appendChild(this.layer3);
				return this.layer1;
			}
		}
		containerList.appendChild(onion.layers);
	}
 			
	function digestDate(date) { //display dates in local date format
		let processedDate = date.split(',');
		let lastUpdateDate = new Date(Date.UTC(...processedDate)); //y-m-d, months are 0 indexed
		let displayedDate = lastUpdateDate.toLocaleString(undefined, {timezone: 'UTC'});
		return displayedDate.slice(0,10);
	}

	function lastVersion() {
		const versionWindow = document.getElementById('last-update');
		const match = patchnotes[0].title.match(/\d+\.\d+\.\d+/);
		versionWindow.textContent = match;
		localStorage.setItem('version', JSON.stringify(match));
	}
	lastVersion();
}

// Custom delay
function Delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

// General function for effect timeout
async function clearEfects(element, effect, time) {
	await Delay(time);
	element.classList.remove(effect);
};

// Custom error
function CustomError(message) {
	const error = new Error(message);
	return error;
};
CustomError.prototype = Object.create(Error.prototype);

// Custom keyboard combinations
const keyLog = {};
async function handleKeyboard({ type, key, repeat, metaKey }) {
	if (repeat) { //delay the function by 100ms, not enough to notice but enough to decrease lag when playing the track
		await Delay(100);
	};
	key = key.toLowerCase();
	if (type === 'keydown') {
		keyLog[key] = true;
		if (keyLog.shift) {
			if (key === 'arrowright') {
				playerRightBtn.dispatchEvent(new Event('click'));
	    	};
	    	if (key === 'arrowleft') {
				playerLeftBtn.dispatchEvent(new Event('click'));
   			};
   			if (key === 'arrowup') {
				++playheadSkipRange.value;
				playheadSkipRange.dispatchEvent(new Event('input'));
   			};
   			if (key === 'arrowdown') {
   				--playheadSkipRange.value;
				playheadSkipRange.dispatchEvent(new Event('input'));
   			};
   			if (key === 'p') {
				playerPlayBtn.dispatchEvent(new MouseEvent('click'));
   			};
		};
   		if (keyLog.v) {
   			if (key === '=' || key === '+') {
				++volumeSlider.value;
				volumeSlider.dispatchEvent(new Event('input'));
   			};
   			if (key === '-' || key === '_') {
				--volumeSlider.value;
				volumeSlider.dispatchEvent(new Event('input'));
   			};
   		};
   		if (keyLog.t) {
   			if (key === '=' || key === '+') {
				++transpositionIndex.value;
				transpositionIndex.dispatchEvent(new Event('input'));
   			};
   			if (key === '-' || key === '_') {
				--transpositionIndex.value;
				transpositionIndex.dispatchEvent(new Event('input'));
   			};
   		};
   		if (keyLog.d && keyLog.a && keyLog.n && keyLog.s && keyLog.e && keyLog.r) {
   			console.log(`easter egg`);
   		}
	};
	if (type === 'keyup') { //remove the key from the log on keyup.
 		delete keyLog[key];
	};
};