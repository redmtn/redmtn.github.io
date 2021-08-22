fetch("./stylesheets.yml")
    .then(yaml => yaml.text())
    .then(yaml => {
        let sheetsObj = jsyaml.load(yaml);
        console.log(sheetsObj);

        sheetsObj.sheets.forEach(sheet => {
            TaskQueue.add(() => {
                $("#content")
                    .append(`
<div>
<h2>${sheet.name}</h2>
<p>${sheet.description}</p>
<br>
<iframe id="cont_${sheet.id}" src='../index.html'></iframe>
</div>
`)
                let iframe = $(`#cont_${sheet.id}`);
                iframe.on("load", () => {
                    iframe.contents().find("#main_style").attr("href", sheet.url.replace("{THIS}", window.location.origin))
                })
            })
        })
    })