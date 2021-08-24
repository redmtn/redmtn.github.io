'use strict';

// manage custom css
let css = window.localStorage.getItem("css");


$(document).ready(() => {
    if (css && !iFramed) {
        console.log("Applying custom CSS...")
        if (window.localStorage.getItem("css_overwrite") !== "false") {
            $("#main_style").remove();
            console.log("Overwriting CSS...")
        }
        $('head').append(`<style id="custom_css">${window.localStorage.getItem("css")}</style>`);
    }
})
