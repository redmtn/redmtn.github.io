$(document).ready(() => {
    let iframe = $("#test");


    function apply() {
        console.log("Applying CSS...")
        iframe.attr('src', iframe.attr('src'));
    }


    const editor = ace.edit("editor");

    iframe.on("load", () => {
        iframe.contents().find("head").append(`<script>${editor.getValue()}</script>`);
    })

    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/javascript");

    $("#setScript").on("click", () => apply())

    $("#install").on("click", () => {
        console.log("Installing...")
        let id = $("#script_id").val();
        console.log(`ID: ${id}`)
        let scripts = window.localStorage.getItem("scripts");
        if(scripts) {
            let scriptsObj = JSON.parse(scripts);
            let contains = false;
            for(let scriptEntry of scriptsObj) {
                if(scriptEntry.id === id) contains = true;
            }
            if(contains && !confirm("Overwrite existing script?")) {
                return;
            }
            scriptsObj = scriptsObj.filter(e => e.id !== id); // remove duplicates
            scriptsObj.push({
                id: id,
                contents: editor.getValue()
            });
            window.localStorage.setItem("scripts", JSON.stringify(scriptsObj));
        } else {
            window.localStorage.setItem("scripts", JSON.stringify([
                {
                    id: id,
                    contents: editor.getValue()
                }
            ]))
        }
    })
});