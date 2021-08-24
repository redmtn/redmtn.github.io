$(document).ready(() => {
    prettyPrintDiff = function (diff, long) {
        if(diff.days > 7) {
            return "More than a week"
        } else if(diff.days > 1) {
            return "One week"
        } else if(diff.days === 1 || diff.hours > 12) {
            return "One day"
        } else if(diff.hours > 6) {
            return "Several hours"
        } else if(diff.hours > 1) {
            return "A few hours"
        } else if(diff.hours === 1 || diff.minutes > 45) {
            return "One hour"
        } else if(diff.minutes > 20) {
            return "Half an hour"
        } else if(diff.minutes > 5) {
            return "A few minutes"
        } else return "Soon"
    }
})