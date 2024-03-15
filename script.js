// Global variables
var tileRes = 128;
var placementSize = 500;
// var placementScale = 1.0;
var dataString = "05x05=afcaa-fafaa-faffc-faaaf-efffa";
var dataArray = [["a","f","c","a","a"],["f","a","f","a","a"],["f","a","f","f","c"],["f","a","a","a","f"],["e","f","f","f","a"]];
var size1 = 5;
var size0 = 4;

function logVariables(input) {
	// console.log("tileRes: "+tileRes+"\nplacementSize: "+placementSize+"\ndataString: "+dataString+"\ndataArray: "+dataArray+"\nsize1: "+size1+"\nsize0: "+size0);
	console.log(input+"    tileRes: "+tileRes+"    placementSize: "+placementSize+"    dataString: "+dataString+"    dataArray: "+dataArray+"    size1: "+size1+"    size0: "+size0);
}





// Update variables based on string
function stringToVariables(str) {
	// Update or use global string (minimum viable string: "1x1=a")
	if (str.length >= 5) {
		dataString = str; // Replace current global string variable
	} else {
		str = dataString; // Get current global string variable
	}
	
	var [size, data] = str.split("="); // Split canvas size and content data
	
	var [X, Y] = size.split("x"); // Get X/Y dimensions
	X = parseInt(X);
	Y = parseInt(Y);
	// Only X is currently used, simplifying calculation of canvas sizes and ensuring mirror modes work as expected (they only work with odd numbers for now)
	if (size1 != X) {
		size1 = X;
		size0 = X-1;
	}
	data = data.split("-"); // Split data into rows
	for(var i = 0; i < data.length; i++) {
		data[i] = data[i].split(""); // Split each row into individual characters
	}
	
	// Update global array
	dataArray = data;
	
	// console.log("Variables updated from string");
	return;
}

// Update string based on variables
function variablesToString() {
	// Use global data
	var string = size1.toString().padStart(2, '0') + "x" + size1.toString().padStart(2, '0') + "=";
	arr = []
	// console.log("dataArray: "+dataArray);
	for (var row of dataArray) {
		// console.log("row: "+row);
		arr.push(row.join(''))
	}
	string += arr.join('-')
	
	// Update global string
	dataString = string;
	
	// console.log("String updated from variables");
	return;
}





// Start of the processing chain
// Replace content with fill, random, or preset string
function setData(str) {
	// If string is provided, update global variables (shortest possible string: "1x1=a")
	// Danger: assumes string is valid (there isn't really any validation process other than checking if it exists)
	
	// If "rand" is specified, generate random values
	if (str && str.startsWith("rand=")) {
		let char = Array.from(str.replace('rand=','')); // Remove identifier and split chracters into array
		// var char = ["a","a","a","a","b","c","d","e","f","f","f","f"]; // Control population frequency by adding duplicate members
		dataArray = []; // Empty current array
		var row = [];
		for (i = 0; i < size1; i++) {
			for (j = 0; j < size1; j++) {
				row.push(char[Math.floor(Math.random() * char.length)]) // Add random character to row
			}
			dataArray.push(row) // Add row to array
			row = []; // Reset row
		}
		variablesToString(); // Update string data
	
	// If single character is provided, fill entire space with that character
	} else if (str && str.length == 1) {
		dataArray = Array(size1).fill(str) // Create row (horizontal)
		dataArray = Array(size1).fill(dataArray) // Populate rows (vertical)
		variablesToString(); // Update string data
	
	// If any string is provided, assume it's valid and process
	} else if (str && str.length >= 5) {
		dataString = str;
		stringToVariables(str);
	}
	
	// logVariables("0");
	
	updateSize();
	return;
}

// Increase/decrease canvas size variables, clamp to valid range
function updateSize(input) {
	if (input == "-") {
		size1 -= 2;
	} else if (input == "+") {
		size1 += 2;
	}
	
	// Clamp and validate size (must be odd integer)
	if (size1 >= 19) {
		size1 = 19;
	} else if (size1 <= 3) {
		size1 = 3;
	}	else {
		size1 = parseInt((parseInt(size1)+1)*0.5)*2-1;
	}
	
	// Update 0 based size value
	size0 = size1-1;
	
	// logVariables("1");
	
	resizeData();
	return;
}

// Update data array based on new size definition or increment/decrement
function resizeData(input) {
	var sizeX = dataArray[0].length;
	var sizeY = dataArray.length;
	var sizeDiffX = Math.abs(size1-sizeX);
	var sizeDiffY = Math.abs(size1-sizeY);
	var sizeValX = sizeDiffX*0.5;
	var sizeValY = sizeDiffY*0.5;
	
	// logVariables("2");
	// console.log("2    sizeX: "+sizeX+"    sizeY: "+sizeY+"    sizeDiffX: "+sizeDiffX+"    sizeDiffY: "+sizeDiffY+"    sizeValX: "+sizeValX+"    sizeValY: "+sizeValY);
	
	if (sizeY > size1) {
		// Remove rows
		dataArray.splice(0, sizeValY);
		dataArray.splice(-1, sizeValY);
	}
	
	if (sizeX > size1) {
		// Remove elements in rows
		for (i = 0; i < dataArray.length; i++) {
			dataArray[i].splice(0, sizeValX);
			dataArray[i].splice(-1, sizeValX);
		}
	}
	
	if (sizeX < size1) {
		// Add elements in rows
		var addArray = Array(sizeValX).fill("a");
		for (i = 0; i < dataArray.length; i++) {
			dataArray[i] = addArray.concat(dataArray[i], addArray);
		}
	}
	
	if (sizeY < size1) {
		// Add rows
		var row = Array(size1).fill("a");
		var rows = Array(sizeValY).fill(row);
		dataArray = [].concat(rows, dataArray, rows);
	}
	
	// Update string data
	variablesToString();
	
	// logVariables("2");
	
	createArray();
	return;
}

// Create canvas of pixel elements
function createArray() {
	// Get placement and container elements, reset content, set size and scale
	var placement = document.getElementById('placement');
	var container = document.getElementById('container');
	container.innerHTML = ''; // Remove any previous content
	var containerRes = size1*tileRes;
	container.style.width = containerRes+'px';
	container.style.height = containerRes+'px';
	placement.style.width = containerRes+'px';
	placement.style.height = containerRes+'px';
	// Don't enable placement scaling changes till the mouse interactions are figured out for scaled values
	// var placementScale = placementSize / containerRes;
	// placement.style.transform = "scale("+placementScale+")";
	
	// Create individual pixel elements
	var id = '';
	var style = '';
	var content = '';
	for (i = 0; i < size1; i++) {
		for (j = 0; j < size1; j++) {
			// Define element settings
			id = (size0-i).toString().padStart(2, "0") + (j).toString().padStart(2, "0");
			style = 'style="width: '+tileRes+'px; height: '+tileRes+'px; top: '+(i)*tileRes+'px; left: '+(j)*tileRes+'px;"';
			// Add elements to content collection
			content += '<div id="'+id+'" class="pixel" '+style+' onclick="pixelSwitch(this,event)">';
			content += '<div class="a"></div>'; // Fill with empty elements, relying on setArray() to complete processing
			content += "</div>";
		}
	}
	document.getElementById("container").innerHTML = content;
	
	// logVariables("3");
	
	setArray();
	return;
}

// Set canvas pixel element styles
function setArray(str) {
	// If no string is provided, the existing global variable will be used
	
	// Set individual pixel elements
	var id = '';
	for (i = 0; i < size1; i++) { // rows
		for (j = 0; j < size1; j++) { // row elements
			id = (size0-i).toString().padStart(2, "0") + (j).toString().padStart(2, "0");
			// console.log("element ID: "+id);
			// console.log("array: "+dataArray[i][j]);
			document.getElementById(id).firstChild.className = dataArray[i][j];
		}
	}
	
//	logVariables("4");
	
	setForeground();
	updateDisplay();
	return;
}

function updateDisplay() {
	document.getElementById("canvasDimension").innerHTML = size1;
	document.getElementById("outputString").value = dataString;
	
//	logVariables("5");
	
	return;
}

// Trigger default array creation on page load
createArray();





// Change colours

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];		
}

function clickElement(id) {
	document.getElementById(id).click();
}

function gradientArray(gradient) {
	// The following assumes repeating gradient where first and last stop are the same and shouldn't be duplicated in a frequency-sensitive array
	const stops = gradient.match(/rgba?\([^)]+\)(?!\))|#[0-9a-f]{3,6}(?!\))/gi); // Ignore last gradient stop
	return stops;
}

function loadBackgroundImage(el) {
	// https://www.webmound.com/save-images-localstorage-javascript/
	const reader = new FileReader()
	reader.readAsDataURL(el.files[0])
	reader.addEventListener('load', () => {
		// console.log("loaded image data: " + reader.result);
		localStorage.setItem('backgroundImage', reader.result)
		document.querySelector(':root').style.setProperty('--backgroundImage', 'url("'+reader.result+'")');
	})
	return;
}

function setBackground(el) {
	const container = document.getElementById("container");
	if (el.className == "image") {
		document.getElementById("backgroundFile").style.opacity = 1.0;
		container.style.backgroundImage = 'var(--backgroundImage)';
	} else {
		document.getElementById("backgroundFile").style.opacity = 0.0;
		container.style.removeProperty("background-image");
	}
	var r = document.querySelector(':root');
	r.style.setProperty('--background', el.style.backgroundColor);
	return;
}

function loadForegroundImage(el) {
	// https://www.webmound.com/save-images-localstorage-javascript/
	const reader = new FileReader()
	reader.readAsDataURL(el.files[0])
	reader.addEventListener('load', () => {
		// console.log("loaded image data: " + reader.result);
		localStorage.setItem('foregroundImage', reader.result)
		document.querySelector(':root').style.setProperty('--foregroundImage', 'url("'+reader.result+'")');
	})
	return;
}

function setForeground(el) {
	if (typeof el == "undefined") {
		el = document.querySelector('input[name=foreground]:checked');
	}
	
	if (el.className == "image") {
		// Show load image file button
		document.getElementById("foregroundFile").style.opacity = 1.0;
		
		// Set up image offsets in array
		var containerRes = size1*tileRes;
		for (i = 0; i < size1; i++) { // rows
			for (j = 0; j < size1; j++) { // row elements
				id = (size0-i).toString().padStart(2, "0") + (j).toString().padStart(2, "0");
				var pixel = document.getElementById(id).firstChild;
				pixel.style.backgroundImage = 'var(--foregroundImage)';
				pixel.style.backgroundSize = containerRes + 'px';
				pixel.style.backgroundPosition = -j * tileRes + 'px ' + -i * tileRes + 'px';
			}
		}
	} else {
		// Hide load image file button
		document.getElementById("foregroundFile").style.opacity = 0.0;
		
		if (el.className == "random") {
			var arr = gradientArray(el.style.background);
			for (const child of document.getElementById("container").children) {
				child.firstChild.style.removeProperty("background-image");
				child.firstChild.style.backgroundColor = arr.random();
			}
		} else {
			for (const child of document.getElementById("container").children) {
				child.firstChild.style.removeProperty("background-image");
				child.firstChild.style.removeProperty("background-color");
			}
		}
	}
	
	var r = document.querySelector(':root');
	r.style.setProperty('--foreground', el.style.backgroundColor);
	return;
}





// Interaction Functions
function pixelSwitch(i, e) {
	// https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
	var rect = e.target.getBoundingClientRect();
	var halfRes = tileRes * 0.5;
	var x = e.clientX - rect.left - halfRes; // X position from element centre
	var y = e.clientY - rect.top - halfRes; // Y position from element centre
	var status = i.firstChild.className;
	
	if (Math.max(Math.abs(x + y), Math.abs(x - y)) < halfRes) {
		if (status == "f") {
			status = "a";
		} else {
			status = "f";
		}
	} else if (x < 0) {
		if (y > 0) {
			status = "c";
		} else {
			status = "d";
		}
	} else {
		if (y > 0) {
			status = "b";
		} else {
			status = "e";
		}
	}
	
	i.firstChild.className = status;
	if (document.getElementById("symmetryDiag").checked) {
		symmetryDiag(i.id, status);
	} else if (document.getElementById("symmetryDiag2").checked) {
		symmetryDiag2(i.id, status);
	} else if (document.getElementById("symmetryX").checked) {
		symmetryX(i.id, status);
	} else if (document.getElementById("symmetryY").checked) {
		symmetryY(i.id, status);
	} else if (document.getElementById("symmetryXY").checked) {
		symmetryXY(i.id, status);
	} else if (document.getElementById("symmetryRadial2").checked) {
		symmetryRadial2(i.id, status);
	} else if (document.getElementById("symmetryRadial4").checked) {
		symmetryRadial4(i.id, status);
	}
	
	dataFromPixels();
	return;
}

function dataFromPixels() {
	var id = "";
	var char = "";
	dataArray = []; // Clear current data array
	for (i = 0; i < size1; i++) {
		var row = [];
		for (j = 0; j < size1; j++) {
			id = (size0-i).toString().padStart(2, "0") + (j).toString().padStart(2, "0");
			char = document.getElementById(id).firstChild.className;
			row.push(char);
		}
		dataArray.push(row);
	}

	variablesToString(); // Update global string based on new global array values
	updateDisplay(); // Update output display
	return;
}





// Symmetry Functions
function symmetryDiag(id, className) {
	var mirror = (id.substring(2, 4)).toString().padStart(2, "0")+(id.substring(0, 2)).toString().padStart(2, "0");
	if (mirror != id) {
		var el = document.getElementById(mirror).firstChild;
		if (el) {
			switch (className) {
				case "a":
					el.className = "a";
					break;
				case "b":
					el.className = "d";
					break;
				case "c":
					el.className = "c";
					break;
				case "d":
					el.className = "b";
					break;
				case "e":
					el.className = "e";
					break;
				case "f":
					el.className = "f";
					break;
			}
		}
	}
	return;
}

function symmetryDiag2(id, className) {
	var mirror = (size0-id.substring(2, 4)).toString().padStart(2, "0")+(size0-id.substring(0, 2)).toString().padStart(2, "0");
	if (mirror != id) {
		var el = document.getElementById(mirror).firstChild;
		if (el) {
			switch (className) {
				case "a":
					el.className = "a";
					break;
				case "b":
					el.className = "b";
					break;
				case "c":
					el.className = "e";
					break;
				case "d":
					el.className = "d";
					break;
				case "e":
					el.className = "c";
					break;
				case "f":
					el.className = "f";
					break;
			}
		}
	}
	return;
}

function symmetryX(id, className) {
	var mirror = (id.substring(0, 2)).toString().padStart(2, "0")+(size0-id.substring(2, 4)).toString().padStart(2, "0");
	if (mirror != id) {
		var el = document.getElementById(mirror).firstChild;
		if (el) {
			switch (className) {
				case "a":
					el.className = "a";
					break;
				case "b":
					el.className = "c";
					break;
				case "c":
					el.className = "b";
					break;
				case "d":
					el.className = "e";
					break;
				case "e":
					el.className = "d";
					break;
				case "f":
					el.className = "f";
					break;
			}
		}
	}
	return;
}

function symmetryY(id, className) {
	var mirror = (size0-id.substring(0, 2)).toString().padStart(2, "0")+(id.substring(2, 4)).toString().padStart(2, "0");
	if (mirror != id) {
		var el = document.getElementById(mirror).firstChild;
		if (el) {
			switch (className) {
				case "a":
					el.className = "a";
					break;
				case "b":
					el.className = "e";
					break;
				case "c":
					el.className = "d";
					break;
				case "d":
					el.className = "c";
					break;
				case "e":
					el.className = "b";
					break;
				case "f":
					el.className = "f";
					break;
			}
		}
	}
	return;
}

function symmetryXY(id, className) {
	// XY
	var mirror = (size0-id.substring(0, 2)).toString().padStart(2, "0")+(size0-id.substring(2, 4)).toString().padStart(2, "0");
	if (mirror != id) {
		var el = document.getElementById(mirror).firstChild;
		if (el) {
			switch (className) {
				case "a":
					el.className = "a";
					break;
				case "b":
					el.className = "d";
					break;
				case "c":
					el.className = "e";
					break;
				case "d":
					el.className = "b";
					break;
				case "e":
					el.className = "c";
					break;
				case "f":
					el.className = "f";
					break;
			}
		}
	}
	
	// X
	var mirror = (id.substring(0, 2)).toString().padStart(2, "0")+(size0-id.substring(2, 4)).toString().padStart(2, "0");
	if (mirror != id) {
		var el = document.getElementById(mirror).firstChild;
		if (el) {
			switch (className) {
				case "a":
					el.className = "a";
					break;
				case "b":
					el.className = "c";
					break;
				case "c":
					el.className = "b";
					break;
				case "d":
					el.className = "e";
					break;
				case "e":
					el.className = "d";
					break;
				case "f":
					el.className = "f";
					break;
			}
		}
	}
	
	// Y
	var mirror = (size0-id.substring(0, 2)).toString().padStart(2, "0")+(id.substring(2, 4)).toString().padStart(2, "0");
	if (mirror != id) {
		var el = document.getElementById(mirror).firstChild;
		if (el) {
			switch (className) {
				case "a":
					el.className = "a";
					break;
				case "b":
					el.className = "e";
					break;
				case "c":
					el.className = "d";
					break;
				case "d":
					el.className = "c";
					break;
				case "e":
					el.className = "b";
					break;
				case "f":
					el.className = "f";
					break;
			}
		}
	}
	return;
}

function symmetryRadial2(id, className) {
	var mirror = (size0-id.substring(0, 2)).toString().padStart(2, "0")+(size0-id.substring(2, 4)).toString().padStart(2, "0");
	if (mirror != id) {
		var el = document.getElementById(mirror).firstChild;
		if (el) {
			switch (className) {
				case "a":
					el.className = "a";
					break;
				case "b":
					el.className = "d";
					break;
				case "c":
					el.className = "e";
					break;
				case "d":
					el.className = "b";
					break;
				case "e":
					el.className = "c";
					break;
				case "f":
					el.className = "f";
					break;
			}
		}
	}
	return;
}

function symmetryRadial4(id, className) {
	// Opposite
	var mirror = (size0-id.substring(0, 2)).toString().padStart(2, "0")+(size0-id.substring(2, 4)).toString().padStart(2, "0");
	if (mirror != id) {
		var el = document.getElementById(mirror).firstChild;
		if (el) {
			switch (className) {
				case "a":
					el.className = "a";
					break;
				case "b":
					el.className = "d";
					break;
				case "c":
					el.className = "e";
					break;
				case "d":
					el.className = "b";
					break;
				case "e":
					el.className = "c";
					break;
				case "f":
					el.className = "f";
					break;
			}
		}
	}
	
	// Clockwise
	var mirror = (size0-id.substring(2, 4)).toString().padStart(2, "0")+(id.substring(0, 2)).toString().padStart(2, "0");
	if (mirror != id) {
		var el = document.getElementById(mirror).firstChild;
		if (el) {
			switch (className) {
				case "a":
					el.className = "a";
					break;
				case "b":
					el.className = "c";
					break;
				case "c":
					el.className = "d";
					break;
				case "d":
					el.className = "e";
					break;
				case "e":
					el.className = "b";
					break;
				case "f":
					el.className = "f";
					break;
			}
		}
	}
	
	// Counter-Clockwise
	var mirror = (id.substring(2, 4)).toString().padStart(2, "0")+(size0-id.substring(0, 2)).toString().padStart(2, "0");
	if (mirror != id) {
		var el = document.getElementById(mirror).firstChild;
		if (el) {
			switch (className) {
				case "a":
					el.className = "a";
					break;
				case "b":
					el.className = "e";
					break;
				case "c":
					el.className = "b";
					break;
				case "d":
					el.className = "c";
					break;
				case "e":
					el.className = "d";
					break;
				case "f":
					el.className = "f";
					break;
			}
		}
	}
	return;
}





// Data outputs

function saveImage(el,id) {
	var source = document.getElementById(id);
	var anchor = document.getElementById('download');
	
	domtoimage.toPng(source).then(function (dataUrl) {
		anchor.href = dataUrl;
		anchor.download = dataString;
		anchor.click();
	}).catch(function (error) {
		console.error('dom-to-image failure', error);
	});
}

function saveVector(el,id) {
	var source = document.getElementById(id);
	var anchor = document.getElementById('download');

	domtoimage.toSvg(source).then(function (dataUrl) {
		anchor.href = dataUrl;
		anchor.download = dataString;
		anchor.click();
	}).catch(function (error) {
		console.error('dom-to-image failure', error);
	});
}