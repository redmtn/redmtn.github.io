function fuzzyRawDate(date) {
    if(date.getHours() < 4) {
        return "Night"
    } else if(date.getHours() < 11) {
        return "Morning"
    } else if(date.getHours() < 14) {
        return "Noon"
    } else if(date.getHours() < 17) {
        return "Afternoon"
    } else return "Night";
}

const oneDay = 1000 * 60 * 60 * 24;

function getMidnight(day){
    const date = new Date(day);
    date.setMilliseconds(999);
    date.setSeconds(59);
    date.setMinutes(59);
    date.setHours(23);
    return date;
}

function isTomorrow(date){
    const midnightTonight = getMidnight(new Date());
    const midnightTomorrow = new Date(midnightTonight.getTime() + oneDay);

    return date > midnightTonight && date < midnightTomorrow;
}

$(document).ready(() => {
    prettyPrintDiff = function (diff, long) {
        if(diff.days > 7) {
            return "More Than a Week"
        } else if(diff.days > 1) {
            return "One Week"
        } else if(diff.days === 1 || diff.hours > 12) {
            return "One Day"
        } else if(diff.hours > 6) {
            return "Several Hours"
        } else if(diff.hours > 1) {
            return "A Few Hours"
        } else if(diff.hours === 1 || diff.minutes > 45) {
            return "An Hour"
        } else if(diff.minutes > 15) {
            return "Half an Hour"
        } else if(diff.minutes > 1) {
            return "A Few Minutes"
        } else return "A Few Seconds"
    }

    prettyDate = function (date) {
        if(isTomorrow(date)) {
            return `Tomorrow ${fuzzyRawDate(date)}`;
        }

        return fuzzyRawDate(date);
    }
})