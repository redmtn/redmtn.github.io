console.log("index.js loaded")

$(document).ready(function(e) {
    $.getJSON( "./resources/timestamps.json" , function(data){
        console.log(data);
    });
});

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
  var seconds = date.getSeconds();
  document.getElementById("time").innerHTML = hours + ":" + minutes + ":" + seconds + " " + suffix + " - " + weekDayString + ", " + day + "/" + (month+1) + "/" + year;
}
window.onload = function() {
  updateTime();
  setInterval(updateTime, 1000);
}
