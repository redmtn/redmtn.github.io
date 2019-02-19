console.log("index.js loaded")
console.log(jsonData);
var debug = false;
var year;
var month;
var day;
var weekDay;
var eventWeekDay;
var eventWeekDayString;
var eventHours;
var eventMinutes;
var eventMonth;
var eventDay;
var eventYear;
var eventDate;
var eventName;
var eventSuffix;
function updateTime() {
  var date;
  if(debug === true) {
    date = calDate;
  } else {
    date = new Date();
  }
  year = date.getFullYear();
  month = date.getMonth();
  day = date.getDate();
  var hoursM = date.getHours();
  var hours = hoursM;
  var suffix = "AM";
  weekDay = date.getDay();
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



calculate(date);
  eventSuffix = "AM";
  if(eventHours > 12) {
    eventHours = eventHours - 12;
    eventSuffix = "PM";
  } else if(eventHours === 0) {
    eventHours = 12;
    eventSuffix = "AM";
  }
  var eventMinutesStr = eventMinutes.toString();
  if(eventMinutesStr === "0" || eventMinutesStr === "1" || eventMinutesStr === "2" || eventMinutesStr === "3" || eventMinutesStr === "4" || eventMinutesStr === "5" || eventMinutesStr === "6" || eventMinutesStr === "7" || eventMinutesStr === "8" || eventMinutesStr === "9") {
    eventMinutesStr = "0" + eventMinutesStr;
  }
  document.getElementById("time").innerHTML = "Current Time: " + hours + ":" + minutesStr + " " + suffix + " - " + weekDayString + ", " + (month+1) + "/" + day + "/" + year + "<br/><br/>" + eventName + ": " + eventHours + ":" + eventMinutesStr + eventSuffix + " - " + eventWeekDayString + ", " + (eventMonth+1) + "/" + eventDay + "/" + eventYear;
}


function calculate(date) {
  var foundNext = false;
  var schedule = jsonData.rmhs.default;
  for(var i = 0; i < jsonData.rmhs.specialDays.length; i++) {
    if(jsonData.rmhs.specialDays[i].type === "weekly") {
      if(weekDay === jsonData.rmhs.specialDays[i].value) {
        schedule = jsonData.rmhs[jsonData.rmhs.specialDays[i].scheduleName];
      }
    } else if(jsonData.rmhs.specialDays[i].type === "single") {
      if(date.getDate() === jsonData.rmhs.specialDays[i].value[0] && date.getMonth()+1 === jsonData.rmhs.specialDays[i].value[1] && date.getFullYear() === jsonData.rmhs.specialDays[i].value[2]) {
        schedule = jsonData.rmhs[jsonData.rmhs.specialDays[i].scheduleName];
      }
    }
  }
  eventDate = new Date(year, month, day);
  var addNum = 1;
  while(foundNext === false && addNum < 365) {
    eventDate.setDate(eventDate.getDate()+1);
    if(eventDate.getDay() !== 0 && eventDate.getDay() !== 6) {
      var schedule = jsonData.rmhs.default;
      for(var i = 0; i < jsonData.rmhs.specialDays.length; i++) {
        if(jsonData.rmhs.specialDays[i].type === "weekly") {
          if(eventDate.getDay() === jsonData.rmhs.specialDays[i].value) {
            schedule = jsonData.rmhs[jsonData.rmhs.specialDays[i].scheduleName];
          }
        } else if(jsonData.rmhs.specialDays[i].type === "single") {
          if(eventDate.getDate() === jsonData.rmhs.specialDays[i].value[0] && eventDate.getMonth()+1 === jsonData.rmhs.specialDays[i].value[1] && eventDate.getFullYear() === jsonData.rmhs.specialDays[i].value[2]) {
            schedule = jsonData.rmhs[jsonData.rmhs.specialDays[i].scheduleName];
          }
        }
      }
      for(var i = 0; i < schedule.length; i++) {
        eventDate.setHours(schedule[i][0]);
        eventDate.setMinutes(schedule[i][1]);
        eventDate.setSeconds(schedule[i][2]);
        if(isPast(eventDate, date) === false) {
          eventName = schedule[i][3];
          document.getElementById("countdown").innerHTML = msToStr(daysBetween(date, eventDate)) + " Until " + eventName;
          foundNext = true;
          i = schedule.length;
        }
      }
    }
  }

  for(var i = 0; i < schedule.length; i++) {
    eventDate.setHours(schedule[i][0]);
    eventDate.setMinutes(schedule[i][1]);
    eventDate.setSeconds(schedule[i][2]);
    if(isPast(eventDate, date) === false) {
      eventName = schedule[i][3];
      document.getElementById("countdown").innerHTML = msToStr(daysBetween(date, eventDate)) + " Until " + eventName;
      foundNext = true;
      i = schedule.length;
    }
  }

  /*
  if(schedule.aS) {
    eventDate.setHours(schedule.aS[0]);
    eventDate.setMinutes(schedule.aS[1]);
    eventDate.setSeconds(schedule.aS[2]);
  }
  if(isPast(eventDate, date) === false && schedule.aS !== undefined) {
    var timeUntilNext = msToStr(daysBetween(date, eventDate));
    eventName = "A Hour Starts";
    document.getElementById("countdown").innerHTML = timeUntilNext + " Until A Hour";
  } else {
    if(schedule.aE) {
      eventDate.setHours(schedule.aE[0]);
      eventDate.setMinutes(schedule.aE[1]);
      eventDate.setSeconds(schedule.aE[2]);
    }
    if(isPast(eventDate, date) === false && schedule.aE !== undefined) {
      var timeUntilNext = msToStr(daysBetween(date, eventDate));
      eventName = "A Hour Ends";
      document.getElementById("countdown").innerHTML = timeUntilNext + " Until A Hour Ends";
    } else {
      eventDate.setHours(schedule.firstS[0]);
      eventDate.setMinutes(schedule.firstS[1]);
      eventDate.setSeconds(schedule.firstS[2]);
      if(isPast(eventDate, date) === false) {
        var timeUntilNext = msToStr(daysBetween(date, eventDate));
        eventName = "First Hour Starts";
        document.getElementById("countdown").innerHTML = timeUntilNext + " Until First Hour Starts";
      } else {
        eventDate.setHours(schedule.firstE[0]);
        eventDate.setMinutes(schedule.firstE[1]);
        eventDate.setSeconds(schedule.firstE[2]);
        if(isPast(eventDate, date) === false) {
          var timeUntilNext = msToStr(daysBetween(date, eventDate));
          eventName = "First Hour Ends";
          document.getElementById("countdown").innerHTML = timeUntilNext + " Until First Hour Ends";
        } else {
          eventDate.setHours(schedule.secondS[0]);
          eventDate.setMinutes(schedule.secondS[1]);
          eventDate.setSeconds(schedule.secondS[2]);
          if(isPast(eventDate, date) === false) {
            var timeUntilNext = msToStr(daysBetween(date, eventDate));
            eventName = "Second Hour Starts";
            document.getElementById("countdown").innerHTML = timeUntilNext + " Until Second Hour Starts";
          } else {
            eventDate.setHours(schedule.secondE[0]);
            eventDate.setMinutes(schedule.secondE[1]);
            eventDate.setSeconds(schedule.secondE[2]);
            if(isPast(eventDate, date) === false) {
              var timeUntilNext = msToStr(daysBetween(date, eventDate));
              eventName = "Second Hour Ends";
              document.getElementById("countdown").innerHTML = timeUntilNext + " Until Second Hour Ends";
            } else {
              eventDate.setHours(schedule.thirdS[0]);
              eventDate.setMinutes(schedule.thirdS[1]);
              eventDate.setSeconds(schedule.thirdS[2]);
              if(isPast(eventDate, date) === false) {
                var timeUntilNext = msToStr(daysBetween(date, eventDate));
                eventName = "Third Hour Starts";
                document.getElementById("countdown").innerHTML = timeUntilNext + " Until Third Hour Starts";
              } else {
                eventDate.setHours(schedule.thirdE[0]);
                eventDate.setMinutes(schedule.thirdE[1]);
                eventDate.setSeconds(schedule.thirdE[2]);
                if(isPast(eventDate, date) === false) {
                  var timeUntilNext = msToStr(daysBetween(date, eventDate));
                  eventName = "Third Hour Ends";
                  document.getElementById("countdown").innerHTML = timeUntilNext + " Until Third Hour Ends";
                } else {
                  eventDate.setHours(schedule.fourthS[0]);
                  eventDate.setMinutes(schedule.fourthS[1]);
                  eventDate.setSeconds(schedule.fourthS[2]);
                  if(isPast(eventDate, date) === false) {
                    var timeUntilNext = msToStr(daysBetween(date, eventDate));
                    eventName = "Fourth Hour Starts";
                    document.getElementById("countdown").innerHTML = timeUntilNext + " Until Fourth Hour Starts";
                  } else {
                    eventDate.setHours(schedule.fourthE[0]);
                    eventDate.setMinutes(schedule.fourthE[1]);
                    eventDate.setSeconds(schedule.fourthE[2]);
                    if(isPast(eventDate, date) === false) {
                      var timeUntilNext = msToStr(daysBetween(date, eventDate));
                      eventName = "Fourth Hour Ends";
                      document.getElementById("countdown").innerHTML = timeUntilNext + " Until Fourth Hour Ends";
                    } else {
                      eventDate.setHours(schedule.fifthS[0]);
                      eventDate.setMinutes(schedule.fifthS[1]);
                      eventDate.setSeconds(schedule.fifthS[2]);
                      if(isPast(eventDate, date) === false) {
                        var timeUntilNext = msToStr(daysBetween(date, eventDate));
                        eventName = "Fifth Hour Starts";
                        document.getElementById("countdown").innerHTML = timeUntilNext + " Until Fifth Hour Starts";
                      } else {
                        eventDate.setHours(schedule.fifthE[0]);
                        eventDate.setMinutes(schedule.fifthE[1]);
                        eventDate.setSeconds(schedule.fifthE[2]);
                        if(isPast(eventDate, date) === false) {
                          var timeUntilNext = msToStr(daysBetween(date, eventDate));
                          eventName = "Fifth Hour Ends";
                          document.getElementById("countdown").innerHTML = timeUntilNext + " Until Fifth Hour Ends";
                        } else {
                          eventDate.setHours(schedule.sixthS[0]);
                          eventDate.setMinutes(schedule.sixthS[1]);
                          eventDate.setSeconds(schedule.sixthS[2]);
                          if(isPast(eventDate, date) === false) {
                            var timeUntilNext = msToStr(daysBetween(date, eventDate));
                            eventName = "Sixth Hour Starts";
                            document.getElementById("countdown").innerHTML = timeUntilNext + " Until Sixth Hour Starts";
                          } else {
                            eventDate.setHours(schedule.sixthE[0]);
                            eventDate.setMinutes(schedule.sixthE[1]);
                            eventDate.setSeconds(schedule.sixthE[2]);
                            if(isPast(eventDate, date) === false) {
                              var timeUntilNext = msToStr(daysBetween(date, eventDate));
                              eventName = "Sixth Hour Ends";
                              document.getElementById("countdown").innerHTML = timeUntilNext + " Until Sixth Hour Ends";
                            } else {
                              eventDate.setDate(eventDate.getDate() + 1);
                              eventDate.setHours(schedule.secondS[0]);
                              eventDate.setMinutes(schedule.secondS[1]);
                              eventDate.setSeconds(schedule.secondS[2]);
                              if(isPast(eventDate, date) === false) {
                                var timeUntilNext = msToStr(daysBetween(date, eventDate));
                                eventName = "A Hour Starts Tomorrow";
                                document.getElementById("countdown").innerHTML = timeUntilNext + " Until A Hour";
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

  }*/
  eventWeekDay = eventDate.getDay();
 eventWeekDayString;
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
  eventHours = eventDate.getHours();
  eventMinutes = eventDate.getMinutes();
  eventMonth = eventDate.getMonth();
  eventDay = eventDate.getDate();
  eventYear = eventDate.getFullYear();

}



function msToStr(s) {
  var fm = [Math.floor(s/60/60/24),Math.floor(s/60/60)%24,Math.floor(s/60)%60,s%60];
  if(window.innerWidth >= 875) {
      if(fm[0] !== 0) {
        return fm[0] + " Days, " + fm[1] + " Hours, " + fm[2] + " Minutes and " + fm[3] + " Seconds";
      } else if(fm[1] !== 0) {
        return fm[1] + " Hours, " + fm[2] + " Minutes and " + fm[3] + " Seconds";
      } else if(fm[2] !== 0) {
        return fm[2] + " Minutes and " + fm[3] + " Seconds";
      } else {
        return fm[3] + " Seconds";
      }
    } else {
      if(fm[0] !== 0) {
        return fm[0] + "D " + fm[1] + "H " + fm[2] + "M " + fm[3] + "S";
      } else if(fm[1] !== 0) {
        return fm[1] + "H " + fm[2] + "M " + fm[3] + "S";
      } else if(fm[2] !== 0) {
        return fm[2] + "M " + fm[3] + "S";
      } else {
        return fm[3] + "S";
      }
    }
}



function daysBetween(date1, date2) {
  var date1Ms = date1.getTime();
  var date2Ms = date2.getTime();
  var differenceMs = date2Ms - date1Ms;
  return Math.round(differenceMs/1000);
}

function isPast(time, currentTime) {
if(currentTime < time) {
    return false;
} else {
    return true;
}
}
var calDate = new Date();
window.onload = function() {
  updateTime();
  setInterval(updateTime, 1000);
  if(window.location.hash === "#test" || window.location.hash === "#debug") {
    console.log("debug mode");
    debug = true;
    document.getElementById("content").insertAdjacentHTML('beforeend', '<center><div class="datepicker-here" id="datepicker" data-language="en"></div><br/><h4>It looks like you found the Debug Page! If you would like to go back to the regular site, click <a href="' + window.location.origin + '">here</a>. If you are just woundering how this site works, feel free to look around!</h4></center>');
    $('#datepicker').datepicker({timepicker: true,
      onSelect: function (fd, d, picker) {
            if(!d) {
              return;
            } else {
              calDate = d;
            }
        }
    })
$('#datepicker').data('datepicker')

  }
}
