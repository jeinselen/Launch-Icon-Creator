// Global variables
var tileRes = 128;
var dataString = "5x5=afcaa-fafaa-faffc-faaaf-efffa";
var dataArray = [["a","f","c","a","a"],["f","a","f","a","a"],["f","a","f","f","c"],["f","a","a","a","f"],["e","f","f","f","a"]];
// var size1 = 5;
// var size0 = 4;
var Xa = 5;
var Xb = 4;
var Ya = 5;
var Yb = 4;
var outdated = false;

// String to array size and data processing functions
function stringToVariables(str) {
	if (str.length >= 5) { // Minimum viable string: "1x1=a"
		dataString = str; // Replace current global string variable
	} else {
		str = dataString; // Get current global string variable
	}
	
	var [size, data] = str.split("="); // Split canvas size and content data
	
	var [X, Y] = size.split("x"); // Get X/Y dimensions
	if (Xa != X) {
		Xa = X;
		Xb = X-1;
		outdated = true;
	} else if (Ya != Y) {
		Ya = Y;
		Yb = Y-1;
		outdated = true;
	}
	data = data.split("-"); // Split data into rows
	for(var i = 0; i < data.length; i++) {
		data[i] = data[i].split(""); // Split each row into individual characters
	}
	
	dataArray = data;
	// console.log("Variables updated from string");
	return;
}

function variablesToString() {
	var string = Xa + "x" + Ya + "=";
	arr = []
	for (const row of dataArray) {
		arr.push(row.join(''))
	}
	string += arr.join('-')
	
	dataString = string;
	// console.log("String updated from variables");
	return;
}

function updateX(data) {
	if (data == "-" && Xa >= 5) {
		Xa -= 2;
		Xb -= 2;
		resizeData("X-");
	} else if (data == "+" && Xa <= 13) {
		Xa += 2;
		Xb += 2;
		resizeData("X+");
	}
	// console.log("X size updated");
	return;
}

function updateY(data) {
	if (data == "-" && Ya >= 5) {
		Ya -= 2;
		Yb -= 2;
		resizeData("Y-");
	} else if (data == "+" && Ya <= 13) {
		Ya += 2;
		Yb += 2;
		resizeData("Y+");
	}
	// console.log("Y size updated");
	return;
}

function resizeData(data) {
	// Expand or contract each row
	if (data == "X-" || dataArray[0].length > Xa) {
		for (i = 0; i < dataArray.length; i++) {
			dataArray[i].shift(); // Remove first element
			dataArray[i].pop(); // Remove last element
			// dataArray[i].splice(0, 1);
			// dataArray[i].splice(-1, 1);
		}
	} else if (data == "X+" || dataArray[0].length < Xa) {
		for (i = 0; i < dataArray.length; i++) {
			dataArray[i].unshift("a"); // Add to beginning
			dataArray[i].push("a"); // Add to end
		}
	}
	
	// Expand or contract the number of rows (assumes )
	if (data == "Y-" || dataArray.length > Ya) {
		dataArray.shift(); // Remove first element
		dataArray.pop(); // Remove last element
		// dataArray.splice(0, 1);
		// dataArray.splice(-1, 1);
	} else if (data == "Y+" || dataArray.length < Ya) {
		var row = Array(Xa).fill("a");
		dataArray.unshift(row); // Add to beginning
		dataArray.push(row); // Add to end
	}
	// Update string data as well
	variablesToString();
	
	createArray();
	// console.log("Array expanded/contracted");
	return;
}

function createArray() {
	var container = document.getElementById('container');
	container.innerHTML = ''; // Remove any previous content
	container.style.width = Xa*tileRes+'px';
	container.style.height = Ya*tileRes+'px';
	
	var id = '00';
	var style = '';
	var content = '';
	for (i = 0; i < Xa; i++) {
		for (j = 0; j < Ya; j++) {
			id = (Xb-i).toString() + (j).toString();
			style = 'style="width: '+tileRes+'px; height: '+tileRes+'px; top: '+(i)*tileRes+'px; left: '+(j)*tileRes+'px;"';
			content += '<div id="'+id+'" class="pixel" '+style+' onclick="pixelSwitch(this,event)">';
			// content += '<div class="' + dataArray[i][j] + '"></div>'; // Get class from dataArray global variable
			content += '<div class=""></div>'; // Fill with empty elements, relying on setArray() to complete processing
			content += "</div>";
		}
	}
	document.getElementById("container").innerHTML = content;
	outdated = false;
	
	setArray();
	// dataFromPixels();
	// console.log("Create Array completed");
	return;
}

// Set dataArray variable and trigger update
function setArray(str) {
	// If presumably valid string is provided, update global variables (shortest possible string: "1x1=a")
	if (str && str.length >= 5) {
		dataString = str;
		stringToVariables(str);
		if (outdated) { resizeData(); }
	// If "rand" is specified, generate random values
	} else if (str && str == "rand") {
		var char = ["a","a","a","a","b","c","d","e","f","f","f","f"]; // Control population frequency by adding duplicate members
		dataArray = []; // Empty current array
		var row = [];
		for (i = 0; i < Ya; i++) {
			for (j = 0; j < Xa; j++) {
				row.push(char[Math.floor(Math.random() * char.length)]) // Add random character to row
			}
			dataArray.push(row) // Add row to array
			row = []; // Reset row
		}
		variablesToString(); // Update string data
	// If single character is provided, fill entire space with that character
	} else if (str && str.length == 1) {
		dataArray = Array(Xa).fill(str) // Create row (horizontal)
		dataArray = Array(Ya).fill(dataArray) // Populate rows (vertical)
		variablesToString(); // Update string data
	}
	// If no string is provided, the existing global variable will be used
	
	// Set individual pixel elements
	var id = '00';
	for (i = 0; i < Xa; i++) {
		for (j = 0; j < Ya; j++) {
			id = (Xb-i).toString() + (j).toString();
			document.getElementById(id).firstChild.className = dataArray[i][j];
		}
	}
	updateDisplay(); // Update output display (bypass data from pixels since we've already updated the pixels from the data)
	// console.log("Set Array completed");
	return;
}

// Trigger default array creation on page load
createArray();





// Interaction Functions
function pixelSwitch(i, e) {
	// https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
	var rect = e.target.getBoundingClientRect();
	var halfRes = tileRes * 0.5;
	var x = e.clientX - rect.left - halfRes; // X position from element centre
	var y = e.clientY - rect.top - halfRes; // Y position from element centre
	var status = i.firstChild.className;
	if (Math.max(Math.abs(x + y), Math.abs(x - y)) < halfRes) {
		if (status == "a") {
			status = "f";
		} else {
			status = "a";
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
	} else if (document.getElementById("symmetryMirror").checked) {
		symmetryMirror(i.id, status);
	}
	dataFromPixels();
	return;
}

function dataFromPixels() {
	var id = "";
	var char = "";
	dataArray = []; // Clear current data array
	for (i = 0; i < Xa; i++) {
		var row = [];
		for (j = 0; j < Ya; j++) {
			id = (Xb-i).toString() + (j).toString();
			char = document.getElementById(id).firstChild.className;
			row.push(char);
		}
		dataArray.push(row);
	}
	variablesToString(); // Update global string based on new global array values
	updateDisplay(); // Update output display
	// console.log("Data updated from pixels");
	return;
}





// Symmetry Functions
function symmetryDiag(id, className) {
	var mirror = id.charAt(1)+id.charAt(0);
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
	var mirror = (Yb-id.charAt(1)).toString()+(Xb-id.charAt(0)).toString();
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
	var mirror = (id.charAt(0)).toString()+(Yb-id.charAt(1)).toString();
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
	var mirror = (Xb-id.charAt(0)).toString()+(id.charAt(1)).toString();
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

function symmetryMirror(id, className) {
	var mirror = (Xb-id.charAt(0)).toString()+(Yb-id.charAt(1)).toString();
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





// Change settings

function setBackground(hex) {
	var r = document.querySelector(':root');
	r.style.setProperty('--background', hex);
	return;
}

function setForeground(hex) {
	var r = document.querySelector(':root');
	r.style.setProperty('--foreground', hex);
	return;
}





// Data outputs

function updateDisplay() {
	document.getElementById("xvalue").innerHTML = Xa;
	document.getElementById("yvalue").innerHTML = Ya;
	document.getElementById("outputString").value = dataString; // Update output display
}

function saveImage(el,id) {
	var source = document.getElementById(id);
	var anchor = document.getElementById('download');
	
	domtoimage.toPng(source).then(function (dataUrl) {
		anchor.href = dataUrl;
		anchor.download = el.value;
		anchor.click();
	}).catch(function (error) {
		console.error('dom-to-image failure', error);
	});
	
	// HTML to Image — this seems to implement retina resolutions (images are larger on iPad, but identical on a non-retina desktop display)
	
	// htmlToImage.toPng(source).then(function (dataUrl) {
	// 	download(dataUrl, el.value);
	// });
	
	// Attempts to use FileSaver and/or HTML2Canvas on Apple systems (either MacOS or iOS) failed
	
	// console.log("...download completed?");
}

function saveVector(el,id) {
	var source = document.getElementById(id);
	var anchor = document.getElementById('download');

	domtoimage.toSvg(source).then(function (dataUrl) {
		anchor.href = dataUrl;
		anchor.download = el.value;
		anchor.click();
	}).catch(function (error) {
		console.error('dom-to-image failure', error);
	});
}