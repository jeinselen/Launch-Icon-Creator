var arr0 = [
	["f", "b", "a", "f", "f"],
	["b", "f", "a", "f", "f"],
	["a", "f", "a", "a", "a"],
	["a", "f", "f", "f", "d"],
	["a", "a", "a", "d", "f"]
];

var arr1 = [
	["f", "b", "c", "f", "f"],
	["b", "f", "a", "f", "f"],
	["a", "f", "a", "a", "c"],
	["a", "f", "f", "f", "d"],
	["e", "a", "a", "d", "f"]
];

var content = "";

for (i = 0; i < 5; i++) {
	for (j = 0; j < 5; j++) {
		content +=
			'<div id="' +
			i +
			"" +
			j +
			'" class="pixel" style="top: ' +
			(i + 1) * 100 +
			"px; left: " +
			(j + 1) * 100 +
			'px;">';
		content += '<div class="top ' + arr0[i][j] + '"></div>';
		// content += '<div class="bot ' + arr0[i][j] + '"></div>';
		content += "</div>";
	}
}
document.getElementById("container").innerHTML = content;