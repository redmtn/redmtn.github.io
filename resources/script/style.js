// manage custom css
let css = window.localStorage.getItem("css");
console.log(css);


var iFramed = (window !== window.parent)

TaskQueue.add(() => {
    if (css && !iFramed) {
        if (window.localStorage.getItem("css_overwrite")) {
            $("#main_style").remove();
            console.log("Overwriting CSS...")
        }
        $('head').append(`<style id="custom_css">${window.localStorage.getItem("css")}</style>`);
    }
})
