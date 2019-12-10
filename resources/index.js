var timestampsJSON;
var menuHTML = '';
var schoolSelect, scheduleSelect;
var useHMS = false;
var scheduleJSON;
var timestampsArr;
var schoolJSON;
var eventDateTemp = new Date();
var eventNameTemp;

var htmlPrefs = `
<br>
Upload Custom Stylesheet: <input type="file" id="stylesheetFile" accept=".css" onchange="setCSS(this.files)"> <input type="button" value="Delete Custom Style" onclick="removeCSS()"><br>
<a href="./stylesheets">Manage Stylesheets</a>
`;


function main() {
	var date = new Date();
	var dateEvent;
	if(eventDateTemp.getTime() < date.getTime()) {
		dateEvent = calculateTime();
		eventDateTemp = dateEvent.eventDate;
		eventNameTemp = dateEvent.name;
		console.log("Recalculating...", dateEvent);
	} else {
		dateEvent = {
			"times": getDHMS(date, eventDateTemp),
			"name": eventNameTemp,
			"eventDate": eventDateTemp
		};
	}
	if(dateEvent.times[0]) {
		document.getElementById("countdown").innerHTML = dateEvent.times[0] + "D " + dateEvent.times[1] + "H " + dateEvent.times[2] + "M " + dateEvent.times[3] + "S";
	} else if(dateEvent.times[1]) {
		document.getElementById("countdown").innerHTML = dateEvent.times[1] + "H " + dateEvent.times[2] + "M " + dateEvent.times[3] + "S";
	} else if(dateEvent.times[2]) {
		document.getElementById("countdown").innerHTML = dateEvent.times[2] + "M " + dateEvent.times[3] + "S";
	} else {
		document.getElementById("countdown").innerHTML = dateEvent.times[3] + "S";
	}
	document.getElementById("event").innerHTML = "Until " + dateEvent.name;
	document.getElementById("time").innerHTML = "Current Time: " + date.toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	}) + " - " + (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear()) + "<br>" + dateEvent.name + ": " + dateEvent.eventDate.toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	}) + " - " + +(dateEvent.eventDate.getMonth() + 1) + "/" + (dateEvent.eventDate.getDate()) + "/" + (dateEvent.eventDate.getFullYear());
}

function getScheduleTimes(schedule, currentTime) {
	if(schedule.specialDays.length > 0) {
		for(var i = 0; i < schedule.specialDays.length; i++) {
			if(schedule.specialDays[i].type === "weekly" && currentTime.getDay() === schedule.specialDays[i].value) {
				return eval("schedule.times." + schedule.specialDays[i].scheduleName);
			}
		}
	}
	return schedule.times.default;
}

function getDHMS(date1, date2) {
	var delta = Math.abs(date1.getTime() - date2.getTime()) / 1000;
	var days = Math.floor(delta / 86400);
	delta -= days * 86400;
	var hours = Math.floor(delta / 3600) % 24;
	delta -= hours * 3600;
	var minutes = Math.floor(delta / 60) % 60;
	delta -= minutes * 60;
	var seconds = Math.floor(delta) % 60;
	return [days, hours, minutes, seconds];
}

function calculateTime() {
	var date = new Date();
	var compDate = new Date();
	var eventName = "";
	whileLoop:
		while(true) {
			timestampsArr = getScheduleTimes(scheduleJSON, compDate);
			for(var i = 0; i < timestampsArr.length; i++) {
				compDate.setHours(timestampsArr[i][0] + scheduleJSON.offset[0]);
				compDate.setMinutes(timestampsArr[i][1] + scheduleJSON.offset[1]);
				compDate.setSeconds(timestampsArr[i][2] + scheduleJSON.offset[2]);
				if(date.getTime() < compDate.getTime()) {
					eventName = timestampsArr[i][3]
					break whileLoop;
				}
			}
			compDate.setDate(compDate.getDate() + 1);
		}
	return {
		"times": getDHMS(date, compDate),
		"name": eventName,
		"eventDate": compDate
	}
}

function replaceCSS() {
	console.log(localStorage.getItem("css"));
	if(localStorage.getItem("css") !== null) {
		if(document.getElementById("customStyle")) {
			document.getElementById("customStyle").parentNode.removeChild(document.getElementById("customStyle"));
		}
		console.log(localStorage.getItem("css").indexOf("override: true"));
		if(localStorage.getItem("css").indexOf("useHMS: true") >= 0) {
			useHMS = true;
			console.log("always using HMS");
		}
		document.getElementById("mainStylesheet").insertAdjacentHTML("beforebegin", "<style id='customStyle'>" + localStorage.getItem("css") + "</style>");
		console.log("inserting new CSS");

		if(localStorage.getItem("css").indexOf("override: true") >= 0) {
			document.getElementById("mainStylesheet").remove();
			console.log("main CSS overridden");
		}
	}
}

function updateMenu(school, schedule) {
	console.log(school, schedule);
	var menuHTML = '';
	schoolJSON;
	menuHTML += "School: <select id='schoolSelect' onchange='schoolSelect=this.value'>";
	var chosenSchool;
	if(school) {
		for(var i = 0; i < timestampsJSON.schools.length; i++) {
			if(timestampsJSON.schools[i].id === school) {
				schoolJSON = timestampsJSON.schools[i];
				menuHTML += "<option value='" + timestampsJSON.schools[i].id + "' selected>" + timestampsJSON.schools[i].name + "</option>";
			} else {
				menuHTML += "<option value='" + timestampsJSON.schools[i].id + "'>" + timestampsJSON.schools[i].name + "</option>";
			}
		}
		menuHTML += "</select><br>Schedule: <select id='scheduleSelect' onchange='scheduleSelect=this.value'>";
		if(schedule) {
			for(var i = 0; i < schoolJSON.schedules.length; i++) {
				if(schoolJSON.schedules[i].id === schedule) {
					menuHTML += "<option value='" + schoolJSON.schedules[i].id + "' selected>" + schoolJSON.schedules[i].name + "</option>";
					scheduleJSON = schoolJSON.schedules[i];
				} else {
					menuHTML += "<option value='" + schoolJSON.schedules[i].id + "'>" + schoolJSON.schedules[i].name + "</option>";
				}
			}
		}
	} else {
		for(var i = 0; i < timestampsJSON.schools.length; i++) {
			menuHTML += "<option value='" + timestampsJSON.schools[i].id + "'>" + timestampsJSON.schools[i].name + "</option>";
		}
		menuHTML += "</select><br>Schedule: <select id='scheduleSelect' onchange='scheduleSelect=this.value'>";
		for(var i = 0; i < timestampsJSON.schools[0].schedules.length; i++) {
			menuHTML += "<option value='" + timestampsJSON.schools[0].schedules[i].id + "'>" + timestampsJSON.schools[0].schedules[i].name + "</option>";
		}
	}
	console.log(menuHTML);
	document.getElementById("settings").onclick = function(e) {
		e.preventDefault();
		var dialog = bootbox.dialog({
			message: menuHTML + htmlPrefs,
			closeButton: true,
			onEscape: function() {
				updateMenu(schoolSelect, scheduleSelect);
			}
		});
	}
}

function onLoad() {
	replaceCSS();
	$.getJSON('./resources/timestamps.json', function(data) {
		console.log(data);
		timestampsJSON = data;
		schoolSelect = timestampsJSON.schools[0].id;
		scheduleSelect = timestampsJSON.schools[0].schedules[0].id
		updateMenu(schoolSelect, scheduleSelect);
		setInterval(function() {
			main()
		}, 1000);
	});
}

function removeCSS() {
	bootbox.confirm({
		message: "Are you sure you want to delete your custom stylesheet?",
		buttons: {
			confirm: {
				label: 'Yes',
				className: 'btn-success'
			},
			cancel: {
				label: 'No',
				className: 'btn-danger'
			}
		},
		callback: function(result) {
			if(result === true) {
				localStorage.removeItem("css");
				location.reload();
			}
		}
	});
}

function setCSS(files) {
	var file = files[0];
	console.log(files);
	var allowed_types = ['text/css'];
	if(allowed_types.indexOf(file.type) == -1) {
		alert('Error: Incorrect file type. Please upload a *.CSS file.');
		return;
	}
	var max_size_allowed = 4 * 1024
	if(file.size > max_size_allowed) {
		alert('Error: Size exceeds max 4KB');
		return;
	}
	var reader = new FileReader();
	reader.addEventListener('load', function(e) {
		var text = e.target.result;
		console.log(text);
		localStorage.setItem("css", text);
		window.location.href = window.location.href;
	});
	reader.readAsText(file);
}