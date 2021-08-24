fetch("./scripts.yml")
    .then(yaml => yaml.text())
    .then(yaml => {
        let sheetsObj = jsyaml.load(yaml);
        console.log(sheetsObj);

        sheetsObj.scripts.forEach(scriptYaml => {
            $(document).ready(() => {
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
                            if(scripts) {
                                let scriptsObj = JSON.parse(scripts);
                                let contains = false;
                                for(let scriptEntry of scriptsObj) {
                                    if(scriptEntry.id === scriptYaml.id) contains = true;
                                }
                                if(contains && !confirm("Overwrite existing script?")) {
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