// manage custom css
let css = window.localStorage.getItem("css");
console.log(css);


var iFramed = (window !== window.parent)

if(css && !iFramed) {
    $('head').append(`<style id="custom_css"></style>`);
}
