let css = window.localStorage.getItem("css");
console.log(css);

if(css) {
    $('head').append(`<style id="custom_css"></style>`);
}
