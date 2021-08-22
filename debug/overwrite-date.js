'use strict';

$(document).ready(() => {
    let dates = flatpickr("#date", {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            defaultDate: new Date()
        }
    );
    let iframe = $(`#test`);
    console.log(iframe)
    console.log(dates.selectedDates[0])
    iframe.bind("load", () => {
        iframe.contents().find("body").append("<script>getCurrentDate = function () {return parent.document.getElementById(\"date\")._flatpickr.selectedDates[0]}</script>")
    });
})