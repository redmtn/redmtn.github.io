'use strict';

function splitDifference(date1, date2) {
    let delta = Math.abs(date1.getTime() - date2.getTime()) / 1000;
    let days = Math.floor(delta / 86400);
    delta -= days * 86400;
    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    let seconds = Math.floor(delta) % 60;
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}

function prettyPrintDiff(diff, long) {
    let result = "";

    if(diff.days) {
        result += diff.days;
        if(long) result += " Days ";
        else result += "D "
    }

    if(diff.hours) {
        result += diff.hours;
        if(long) result += " Hours ";
        else result += "H "
    }

    if(diff.minutes) {
        result += diff.minutes;
        if(long) result += " Minutes ";
        else result += "M "
    }

    result += diff.seconds;
    if(long) result += " Seconds";
    else result += "S";

    return result;
}

function calculateNextEvent() {
    let currentDate = getCurrentDate();
    let futureDate = new Date(currentDate.getTime());

    let ohgodohfuck = 0;
    while(true) {
        if(ohgodohfuck > 100) throw new Error("oh god oh fuck");

        let chosen;
        for (let currentRule of schedule.rules) {
            if(currentRule.matches(futureDate)) {
                chosen = currentRule.schedule;
                break;
            }
        }


        for (let time in chosen.times) {
            let timeObj = chosen.times[time];
            futureDate.setHours(timeObj.time.hours);
            futureDate.setMinutes(timeObj.time.minutes);
            futureDate.setSeconds(timeObj.time.seconds);

            if(currentDate.getTime() < futureDate.getTime()) {
                return {
                    event: timeObj.name,
                    date: futureDate
                }
            }
        }
        futureDate.setDate(futureDate.getDate() + 1);
        ohgodohfuck++;
    }
}

function prettyDate(date) {
    return `${date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })} - ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}