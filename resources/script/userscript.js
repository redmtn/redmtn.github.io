'use strict';

const iFramed = (window !== window.parent);


let scripts = window.localStorage.getItem("scripts");

if(scripts && !iFramed) {
    let parsed = JSON.parse(scripts);
    for(let script of parsed) {
        console.log(`Injecting script "${script.id}"`);
        new Function(script.contents).apply(null);
        // eval(script.contents); // security is for losers
    }
}