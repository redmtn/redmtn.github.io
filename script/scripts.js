fetch("./scripts.yml")
    .then(yaml => yaml.text())
    .then(yaml => {
        let sheetsObj = jsyaml.load(yaml);
        console.log(sheetsObj);

        $(document).ready(() => {
            let scripts = window.localStorage.getItem("scripts");
            let removeStuff = $("#remove_area");
            if (scripts) {
                let scriptsObj = JSON.parse(scripts);
                if(scriptsObj.length === 0) {
                    removeStuff.hide();
                }
                for (let scriptEntry of scriptsObj) {
                    $("#scripts_remove").append(`<option value="${scriptEntry.id}">${scriptEntry.id}</option>`)
                }
            } else {
                removeStuff.hide();
            }

            $("#remove_button").on("click", () => {
                let scripts = window.localStorage.getItem("scripts");
                let scriptsObj = JSON.parse(scripts);
                scriptsObj = scriptsObj.filter(e => e.id !== $("#scripts_remove").val()); // remove duplicates
                window.localStorage.setItem("scripts", JSON.stringify(scriptsObj));
                window.location.href = window.location.href; // AKA: im too lazy to write proper logic
            })
            sheetsObj.scripts.forEach(scriptYaml => {
                $("#content")
                    .append(`
<div>
<h2>${scriptYaml.name}</h2>
<p>${scriptYaml.description}</p>
<br>
<iframe id="cont_${scriptYaml.id}" src='../index.html'></iframe>
<br>
<input type="button" id="install_${scriptYaml.id}" value="Install Script">
</div>
`)
                let iframe = $(`#cont_${scriptYaml.id}`);
                iframe.on("load", () => {
                    fetch(scriptYaml.url.replace("{THIS}", window.location.origin))
                        .then(script => script.text())
                        .then(script => {
                            iframe.contents().find("head").append(`<script>${script}</script>`)
                        });
                });

                let button = $(`#install_${scriptYaml.id}`);

                button.on("click", () => {
                    console.log("Installing...")
                    fetch(scriptYaml.url.replace("{THIS}", window.location.origin))
                        .then(script => script.text())
                        .then(script => {
                            let scripts = window.localStorage.getItem("scripts");
                            if (scripts) {
                                let scriptsObj = JSON.parse(scripts);
                                let contains = false;
                                for (let scriptEntry of scriptsObj) {
                                    if (scriptEntry.id === scriptYaml.id) contains = true;
                                }
                                if (contains && !confirm("Overwrite existing script?")) {
                                    return;
                                }
                                scriptsObj = scriptsObj.filter(e => e.id !== scriptYaml.id); // remove duplicates
                                scriptsObj.push({
                                    id: scriptYaml.id,
                                    contents: script
                                });
                                window.localStorage.setItem("scripts", JSON.stringify(scriptsObj));
                            } else {
                                window.localStorage.setItem("scripts", JSON.stringify([
                                    {
                                        id: scriptYaml.id,
                                        contents: script
                                    }
                                ]))
                            }
                        })
                });
            })
        })
    })