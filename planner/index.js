var countdown, countdownParent, html, countdownPosition;
if (localStorage.getItem("countdownPosition")) {
	countdownPosition = JSON.parse(localStorage.getItem("countdownPosition"))
} else {
	countdownPosition = [0, 0];
}

function recalculateInputSizes() {
	var height = document.getElementById('reference').clientHeight;
	for (var j = 0; j < document.getElementsByClassName('input').length; j++) {
		//console.log(document.getElementsByClassName('input')[j].value);
		document.getElementsByClassName('input')[j].style.height = height + "px";

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
	recalculateInputSizes();
	document.getElementById("countdownContainer").style.top = countdownPosition[0];
	document.getElementById("countdownContainer").style.left = countdownPosition[1];

	if (localStorage.getItem("plannerData")) {
		data = JSON.parse(localStorage.getItem("plannerData"));
		for (var i = 0; i < data.length; i++) {
			document.getElementsByClassName('input')[i].value = data[i]
		}
	}
	countdownParent = document.getElementById('countdown').parentNode;
	html = '<iframe id="countdown" width="1152" height="648" src="../index.html" style="-webkit-transform:scale(0.5);-moz-transform-scale(0.5);margin:-150px; margin-top:-160px; margin-left:-290px;">';

	dragElement(document.getElementById("countdownContainer"));
	var data = [];
	for (var i = 0; i < document.getElementsByClassName('input').length; i++) {
		console.log("bazinga");
		document.getElementsByClassName('input')[i].onchange = function() {
			data = [];
			for (var j = 0; j < document.getElementsByClassName('input').length; j++) {
				//console.log(document.getElementsByClassName('input')[j].value);
				data.push(document.getElementsByClassName('input')[j].value);

			}
			localStorage.setItem('plannerData', JSON.stringify(data));
			console.log(JSON.stringify(data));
			console.log(data);
		}
	}


}
window.onresize = recalculateInputSizes();