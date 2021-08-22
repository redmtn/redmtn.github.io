'use strict';

$(document).ready(() => {
    let iframe = $(`#test`);
    flatpickr("#date", {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            defaultDate: new Date()
        }
    ).config.onChange.push(() => iframe[0].contentWindow.expireTime());


    iframe.bind("load", () => {
        iframe.contents().find("body").append("<script>getCurrentDate = function () {return parent.document.getElementById(\"date\")._flatpickr.selectedDates[0]}</script>")
    });
})