console.log("index.js loaded")
console.log(jsonData);

function updateTime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var hoursM = date.getHours();
  var hours = hoursM;
  var suffix = "AM";
  var weekDay = date.getDay();
  var weekDayString = "Sunday";

  if(weekDay === 1) {
    weekDayString = "Monday";
  } else if(weekDay === 2) {
    weekDayString = "Tuesday";
  } else if(weekDay === 3) {
    weekDayString = "Wednesday";
  } else if(weekDay === 4) {
    weekDayString = "Thursday";
  } else if(weekDay === 5) {
    weekDayString = "Friday";
  } else if(weekDay === 6) {
    weekDayString = "Saturday";
  }
  if(hours > 12) {
    hours = hours - 12;
    suffix = "PM";
  } else if(hours === 0) {
    hours = 12;
    suffix = "AM";
  }
  var minutes = date.getMinutes();
  var minutesStr = minutes.toString();
  var seconds = date.getSeconds();
  var secondsStr = seconds.toString();
  if(minutesStr === "0" || minutesStr === "1" || minutesStr === "2" || minutesStr === "3" || minutesStr === "4" || minutesStr === "5" || minutesStr === "6" || minutesStr === "7" || minutesStr === "8" || minutesStr === "9") {
    minutesStr = "0" + minutesStr;
  }

  if(secondsStr === "0" || secondsStr === "1" || secondsStr === "2" || secondsStr === "3" || secondsStr === "4" || secondsStr === "5" || secondsStr === "6" || secondsStr === "7" || secondsStr === "8" || secondsStr === "9") {
    secondsStr = "0" + secondsStr;
  }


var eventDate;

  if(weekDay === 3) { //Wednesday
    var schedule = jsonData.rmhs.wednesday;
    //console.log(isPast([hours, minutes, seconds], schedule.aS));
  } else if(weekDay === 6 || weekDay === 0) { //weekends
    var schedule = jsonData.rmhs.default;
    //console.log(isPast([hours, minutes, seconds], schedule.aS));
    if(weekDay === 6) {
       eventDate = new Date(year, month, (day + 2));
    } else {
      eventDate = new Date(year, month, (day + 1));
    }
    eventDate.setHours(schedule.aS[0]);
    eventDate.setMinutes(schedule.aS[1]);
    eventDate.setSeconds(schedule.aS[2]);
    var timeUntilNext = msToStr(daysBetween(date, eventDate));
    document.getElementById("countdown").innerHTML = timeUntilNext;
  } else { //weekdays (not Wednesday)
    var schedule = jsonData.rmhs.default;
    //console.log(isPast([hours, minutes, seconds], schedule.aS));
  }
  var eventWeekDay = eventDate.getDay();
 var eventWeekDayString;
  if(eventWeekDay === 1) {
    eventWeekDayString = "Monday";
  } else if(eventWeekDay === 2) {
    eventWeekDayString = "Tuesday";
  } else if(eventWeekDay === 3) {
    eventWeekDayString = "Wednesday";
  } else if(eventWeekDay === 4) {
    eventWeekDayString = "Thursday";
  } else if(eventWeekDay === 5) {
    eventWeekDayString = "Friday";
  } else if(eventWeekDay === 6) {
    weekDayString = "Saturday";
  }


  document.getElementById("time").innerHTML = hours + ":" + minutesStr + " " + suffix + " - " + weekDayString + ", " + (month+1) + "/" + day + "/" + year + "<br/><br/>" + eventDate.getHours() + ":" + eventDate.getMinutes() + " - " + eventWeekDayString + ", " + eventDate.getMonth() + "/" + eventDate.getDate() + "/" + eventDate.getFullYear();
}


function msToStr( s ) {
  var fm = [Math.floor(s/60/60/24),Math.floor(s/60/60)%24,Math.floor(s/60)%60,s%60];
      if(fm[0] !== 0) {
        return fm[0] + " Days, " + fm[1] + " Hours, " + fm[2] + " Minutes and " + fm[3] + " Seconds";
      } else if(fm[1] !== 0) {
        return fm[1] + " Hours, " + fm[2] + " Minutes and " + fm[3] + " Seconds";
      } else if(fm[2] !== 0) {
        return fm[2] + " Minutes and " + fm[3] + " Seconds";
      } else {
        return fm[3] + " Seconds";
      }
}



function daysBetween( date1, date2 ) {
  //Get 1 day in milliseconds

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return Math.round(difference_ms/1000);
}

function isPast(time, currentTime) {
  if(currentTime[0] <= time[0] && currentTime[1] <= time[1] && currentTime[2] <= time[2]) {
    return false;
  } else {
    return true;
  }
}
function timeTo(currentTime, time) {
  return
}

window.onload = function() {
  updateTime();
  setInterval(updateTime, 1000);
}
