var countdown, countdownParent, html, countdownPosition, plannerData = {
	"_0": [],
	"_1": [],
	"_2": [],
	"_3": [],
	"_4": [],
	"_5": [],
	"_6": []
};
if (localStorage.getItem("plannerData")) {
	try {
		plannerData = JSON.parse(localStorage.getItem("plannerData"));
		if (!plannerData._0) {
			plannerData = {
				"_0": [],
				"_1": [],
				"_2": [],
				"_3": [],
				"_4": [],
				"_5": [],
				"_6": []
			};
		}
	} catch {
		plannerData = {
			"_0": [],
			"_1": [],
			"_2": [],
			"_3": [],
			"_4": [],
			"_5": [],
			"_6": []
		};
	}
}
if (localStorage.getItem("countdownPosition")) {
	countdownPosition = JSON.parse(localStorage.getItem("countdownPosition"))
} else {
	countdownPosition = [0, 0];
}

function recalculateAHour() {
	if (localStorage.getItem("AHour") === "true") {
		if (!document.getElementById("0")) {
			document.getElementById("days").insertAdjacentHTML('afterend', "<tr id=\"0\"><td class=\"hour\">A</td><td><textarea class=\"input\"></textarea></td><td><textarea class=\"input\"></textarea></td><td><textarea class=\"input\"></textarea></td><td><textarea class=\"input\"></textarea></td><td><textarea class=\"input\"></textarea></td></tr>");
		}
	} else {
		if (document.getElementById("0")) {
			document.getElementById("0").parentNode.removeChild(document.getElementById("0"));
		}
	}
	recalculateInputSizes();
}

function recalculateInputSizes() {
	var height = window.innerHeight;
	for (var j = 0; j < document.getElementsByClassName('input').length; j++) {
		//console.log(document.getElementsByClassName('input')[j].value);
		if (localStorage.getItem("AHour") === "true") {
			document.getElementsByClassName('input')[j].style.height = ((height - 125)) / 7 + "px";
		} else {
			document.getElementsByClassName('input')[j].style.height = ((height - 100)) / 6 + "px";
		}

	}
}

function isInViewport(element) {
	var rect = element.getBoundingClientRect();
	var html = document.documentElement;
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || html.clientHeight) &&
		rect.right <= (window.innerWidth || html.clientWidth)
	);
}


function dragElement(elmnt) {
	var pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	if (document.getElementById(elmnt.id + "header")) {
		// if present, the header is where you move the DIV from:
		document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	} else {
		// otherwise, move the DIV from anywhere inside the DIV:
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		document.getElementById('countdown').parentNode.removeChild(document.getElementById('countdown'));
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		if (e.clientX > 0 && e.clientX < window.innerWidth) {
			pos1 = pos3 - e.clientX;
			pos3 = e.clientX;
			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}
		if (e.clientY > 0 && e.clientY < window.innerHeight) {
			pos2 = pos4 - e.clientY;
			pos4 = e.clientY;
			elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		}
		// set the element's new position:


	}

	function closeDragElement() {
		countdownParent.insertAdjacentHTML('beforeend', html);
		localStorage.setItem("countdownPosition", JSON.stringify([document.getElementById("countdownContainer").style.top, document.getElementById("countdownContainer").style.left]));
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}
window.onload = function() {
	recalculateAHour();
	document.body.onmouseup = function() {
		recalculateAHour();
	}
	recalculateInputSizes();
	document.getElementById("countdownContainer").style.top = countdownPosition[0];
	document.getElementById("countdownContainer").style.left = countdownPosition[1];
	if (localStorage.getItem("AHour") === "true") {
		for (var i = 0; i < 7; i++) {
			for (var j = 0; j < 5; j++) {
				if (eval("plannerData._" + i + "[j]") !== undefined) {
					console.log(eval("plannerData._" + i + "[j]"));
					document.getElementById(i.toString()).children[j + 1].children[0].value = eval("plannerData._" + i + "[j]");
				} else {
					console.log(eval("plannerData._" + i + "[j]"));
					document.getElementById(i.toString()).children[j + 1].children[0].value = "";
				}
			}
		}
	} else {
		for (var i = 1; i < 7; i++) {
			for (var j = 0; j < 5; j++) {
				if (eval("plannerData._" + i + "[j]") !== undefined) {
					console.log(eval("plannerData._" + i + "[j]"));
					document.getElementById(i.toString()).children[j + 1].children[0].value = eval("plannerData._" + i + "[j]");
				} else {
					console.log(eval("plannerData._" + i + "[j]"));
					document.getElementById(i.toString()).children[j + 1].children[0].value = "";
				}
			}
		}
	}
	countdownParent = document.getElementById('countdown').parentNode;
	html = '<iframe id="countdown" width="1152" height="648" src="../index.html" style="-webkit-transform:scale(0.5);-moz-transform-scale(0.5);margin:-150px; margin-top:-160px; margin-left:-290px;">';

	dragElement(document.getElementById("countdownContainer"));
	for (var h = 0; h < document.getElementsByClassName('input').length; h++) {
		document.getElementsByClassName('input')[h].onkeyup = function() {
			var evalString = "plannerData._";
			plannerData = {
				"_0": [],
				"_1": [],
				"_2": [],
				"_3": [],
				"_4": [],
				"_5": [],
				"_6": []
			};
			if (localStorage.getItem("AHour") === "true") {
				for (var i = 0; i < 7; i++) {
					for (var j = 0; j < 5; j++) {
						eval(evalString + i + ".push(\"" + document.getElementById(i.toString()).children[j + 1].children[0].value + "\")");
					}
				}
			} else {
				for (var i = 1; i < 7; i++) {
					for (var j = 0; j < 5; j++) {
						eval(evalString + i + ".push(\"" + document.getElementById(i.toString()).children[j + 1].children[0].value + "\")");
					}
				}
			}
			localStorage.setItem("plannerData", JSON.stringify(plannerData));

		}
	}


}

window.onresize = function() {
	recalculateInputSizes();
}