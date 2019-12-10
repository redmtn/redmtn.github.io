var timestampsJSON;
var menuHTML = '';
var schoolSelect, scheduleSelect;
var useHMS = false;
var scheduleJSON;
var timestampsArr;
var schoolJSON;

function main() {
	var date = new Date();
	var event = calculateTime();
	if(event.times[0]) {
		document.getElementById("countdown").innerHTML = event.times[0] + "D " + event.times[1] + "H " + event.times[2] + "M " + event.times[3] + "S";
	} else if(event.times[1]) {
		document.getElementById("countdown").innerHTML = event.times[1] + "H " + event.times[2] + "M " + event.times[3] + "S";
	} else if(event.times[2]) {
		document.getElementById("countdown").innerHTML = event.times[2] + "M " + event.times[3] + "S";
	} else {
		document.getElementById("countdown").innerHTML = event.times[3] + "S";
	}
	document.getElementById("event").innerHTML = "Until " + event.name
	document.getElementById("time").innerHTML = "Current Time: " + date.toLocaleString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		}) + " - " + (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear()) +
		"<br>" + event.name + ": " + event.eventDate.toLocaleString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		}) + " - " + +(event.eventDate.getMonth() + 1) + "/" + (event.eventDate.getDate()) + "/" + (event.eventDate.getFullYear());
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
	var evenName = "";
	whileLoop:
		while(true) {
			timestampsArr = getScheduleTimes(scheduleJSON, compDate);
			for(var i = 0; i < timestampsArr.length; i++) {
				compDate.setHours(timestampsArr[i][0] + scheduleJSON.offset[0]);
				compDate.setMinutes(timestampsArr[i][1] + scheduleJSON.offset[1]);
				compDate.setSeconds(timestampsArr[i][2] + scheduleJSON.offset[2]);
				if(date.getTime() < compDate.getTime()) {
					evenName = timestampsArr[i][3]
					break whileLoop;
				}
			}
			compDate.setDate(compDate.getDate() + 1);
		}
	return {
		"times": getDHMS(date, compDate),
		"name": evenName,
		"eventDate": compDate
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
	$.getJSON('../../resources/timestamps.json', function(data) {
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