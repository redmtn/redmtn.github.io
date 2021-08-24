'use strict';

let scripts = window.localStorage.getItem("scripts");

if(scripts) {
    let parsed = JSON.parse(scripts);
    for(let script of parsed) {
        console.log(`Injecting script ${script.id}`)
        eval(script.text)
    }
}