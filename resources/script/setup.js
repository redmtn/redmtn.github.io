'use strict';

let schedule;

let scheduleData;

const scheduleDir = "resources/schedule";

function yamlResource(...resource) {
    var final = scheduleDir;
    resource.forEach(resource => final += `/${resource}`);
    return fetch(final + ".yml")
        .then(data => {
            return data.text();
        });
}

yamlResource("schools") // load schedules
    .then(schools => {
            parseSchedules(schools).then(value => {
                scheduleData = value;
                TaskQueue.add(() => {
                    for (const school in value) {
                        let schoolSelect = $("#school_select");
                        schoolSelect.append(`<option value="${school}">${value[school].name}</option>`)
                        schoolSelect.on("change", () => updateScheduleSelection())
                        updateScheduleSelection();

                        $("#schedule_select").on("change", () => updateSelected());
                    }
                })
            });
        }
    );

function updateScheduleSelection() {
    let select = $("#schedule_select");
    select.html(""); // Clear contents

    let schoolSelection = $("#school_select").val()

    let schedules = scheduleData[schoolSelection].schedules;
    for (let schedule in schedules) {
        select.append(`<option value="${schedule}">${schedules[schedule].name}</option>`)
    }

    updateSelected();
}

function updateSelected() {
    schedule = scheduleData[$("#school_select").val()].schedules[$("#schedule_select").val()];
}

TaskQueue.add(() => {

    $("#settingsIcon").on('click', function (e) {
        e.preventDefault(); // dont redirect
    });


    MicroModal.init();

    window.setInterval(() => {
        let time = calculateNextEvent(new Date());
        $("#countdown").html(time.timestamp);
        $("#event").html(`Until ${time.event}`);
        $("#event_time").html(`${time.event}: ${prettyDate(time.date)}`);
        $("#current_time").html(`Current Time: ${prettyDate(new Date())}`);
    }, 1000);
})