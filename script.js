function createArray(data) {
	if (!data) {
		return;
	} else if (!Array.isArray(data)) {
		data = convertArray(data);
	}

	var id = '00';
	var style = '';
	var content = '';

	for (i = 0; i < 5; i++) {
		for (j = 0; j < 5; j++) {
			id = (4-i).toString() + (j).toString();
			style = 'style="top: '+(i+1)*100+'px; left: '+(j+1)*100+'px;"';
			content += '<div id="'+id+'" class="pixel" '+style+' onclick="pixelSwitch(this,event)">';
			//content += id.toString();
			content += '<div class="' + data[i][j] + '"></div>';
			content += "</div>";
		}
	}
	document.getElementById("container").innerHTML = content;
	dataOutput();
	return;
}

function convertArray(data) {
	data = data.split("-");
	for(var i = 0; i < data.length; i++) {
		data[i] = data[i].split("");
	}
	return data;
}

function setArray(data) {
	if (!data) {
		return;
	} else if (!Array.isArray(data)) {
		data = convertArray(data);
	}
	var id = '00';
	for (i = 0; i < 5; i++) {
		for (j = 0; j < 5; j++) {
			id = (4-i).toString() + (j).toString();
			document.getElementById(id).firstChild.className = data[i][j];
		}
	}
	dataOutput();
	return;
}

function setRandom() {
	var a = ["a","b","c","d","e","f"];
	var r = 0;
	var s = "";
	for (let i = 0; i < 25; i++) {
		r = Math.floor(Math.random() * 6);
		if (i == 5 || i == 10 || i == 15 || i == 20) {
			s += "-";
		}
		s += a[r];
	}
	setArray(s);
	return;
}

createArray("facff-afaff-afaac-afffa-eaaaf");

// End initilisation
// Begin interaction

function pixelSwitch(i, e) {
	// https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
	var rect = e.target.getBoundingClientRect();
	var x = e.clientX - rect.left - 50; // X position from element centre
	var y = e.clientY - rect.top - 50; // Y position from element centre
	var status = i.firstChild.className;
	//alert(status + x + y);
	//alert(i.id);
	if (Math.max(Math.abs(x + y), Math.abs(x - y)) < 50) {
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
	dataOutput();
	return;
}

// Symmetry modes

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
	var mirror = (4-id.charAt(1)).toString()+(4-id.charAt(0)).toString();
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
	var mirror = (id.charAt(0)).toString()+(4-id.charAt(1)).toString();
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
	var mirror = (4-id.charAt(0)).toString()+(id.charAt(1)).toString();
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
	var mirror = (4-id.charAt(0)).toString()+(4-id.charAt(1)).toString();
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

function setCorner(val) {
	var r = document.querySelector(':root');
	r.style.setProperty('--corner', val);
	return;
}

function setBackground(hex) {
	// document.getElementById("container").style.background = hex;
	var r = document.querySelector(':root');
	r.style.setProperty('--background', hex);
	return;
}

function setForeground(hex) {
	// var id = '00';
	// for (i = 0; i < 5; i++) {
	// 	for (j = 0; j < 5; j++) {
	// 		id = (i).toString() + (j).toString();
	// 		document.getElementById(id).firstChild.style.background = hex;
	// 	}
	// }
	var r = document.querySelector(':root');
	r.style.setProperty('--foreground', hex);
	return;
}

// Data outputs

function dataOutput() {
	var outputStr = "40_41_42_43_44-30_31_32_33_34-20_21_22_23_24-10_11_12_13_14-00_01_02_03_04"
	var outputArr = `var array = [
	["40", "41", "42", "43", "44"],
	["30", "31", "32", "33", "34"],
	["20", "21", "22", "23", "24"],
	["10", "11", "12", "13", "14"],
	["00", "01", "02", "03", "04"]
];`
	var id = '00';
	var className = '';
	for (i = 0; i < 5; i++) {
		for (j = 0; j < 5; j++) {
			id = (4-i).toString() + (j).toString();
			className = document.getElementById(id).firstChild.className;
			outputArr = outputArr.replace(id,className);
			outputStr = outputStr.replace(id,className);
		}
	}
	outputStr = outputStr.replace(/_/g,"");
	document.getElementById("outputString").value = outputStr;
	document.getElementById("outputArray").value = outputArr;
	document.getElementById("image").value = outputStr+".png";
	// document.getElementById("vector").value = outputStr+".svg";
	return;
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