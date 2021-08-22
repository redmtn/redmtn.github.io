fetch("./stylesheets.yml")
    .then(yaml => yaml.text())
    .then(yaml => {
        let sheetsObj = jsyaml.load(yaml);
        console.log(sheetsObj);

        sheetsObj.sheets.forEach(sheet => {
            $(document).ready(() => {
                $("#content")
                    .append(`
<div>
<h2>${sheet.name}</h2>
<p>${sheet.description}</p>
<br>
<iframe id="cont_${sheet.id}" src='../index.html'></iframe>
<br>
<input type="button" id="install_${sheet.id}" value="Install Stylesheet">
</div>
`)
                let iframe = $(`#cont_${sheet.id}`);
                iframe.on("load", () => {
                    iframe.contents().find("#main_style").attr("href", sheet.url.replace("{THIS}", window.location.origin))
                });

                let button = $(`#install_${sheet.id}`);

                button.on("click", () => {
                    console.log("Installing...")
                    if(window.localStorage.getItem("css") && !confirm("Overwrite existing stylesheet?")) {
                        return;
                    }
                    fetch(sheet.url.replace("{THIS}", window.location.origin))
                        .then(css => css.text())
                        .then(css => {
                            window.localStorage.setItem("css", css);
                            window.localStorage.setItem("css_overwrite", sheet.replace)
                            window.localStorage.setItem("use_hms", sheet["short-times"])
                        })
                });
            })
        })
    })