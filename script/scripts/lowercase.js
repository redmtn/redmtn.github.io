$(document).ready(() => {
    prettyPrintDiff = function(diff, long) {
    let result = "";

    if(diff.days) {
        result += diff.days;
        if(long) result += " Days ";
        else result += "d "
    }

    if(diff.hours) {
        result += diff.hours;
        if(long) result += " Hours ";
        else result += "h "
    }

    if(diff.minutes) {
        result += diff.minutes;
        if(long) result += " Minutes ";
        else result += "m "
    }

    result += diff.seconds;
    if(long) result += " Seconds";
    else result += "s";

    return result;
}
});