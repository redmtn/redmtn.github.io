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

                        let scheduleSelect = $("#schedule_select");

                        updateScheduleSelection(true);

                        if (localStorage.getItem("school")) {
                            console.log(`Restoring school: ${localStorage.getItem("school")}`)
                            schoolSelect.val(localStorage.getItem("school"))
                        }

                        if (localStorage.getItem("schedule")) {
                            console.log(`Restoring schedule: ${localStorage.getItem("schedule")}`)
                            scheduleSelect.val(localStorage.getItem("schedule"))
                        }

                        scheduleSelect.on("change", () => updateSelected());
                    }
                })

                TaskQueue.add(() => {
                    let time = calculateNextEvent(new Date());
                    window.setInterval(() => {
                        let currentDate = new Date();

                        if(currentDate.getTime() >= time.date.getTime()) {
                            time = calculateNextEvent(currentDate)
                        }

                        $("#countdown").html(prettyPrintDiff(splitDifference(currentDate, time.date)));
                        $("#event").html(`Until ${time.event}`);
                        $("#event_time").html(`${time.event}: ${prettyDate(time.date)}`);
                        $("#current_time").html(`Current Time: ${prettyDate(new Date())}`);
                    }, 1000);
                })
            });
        }
    );

function updateScheduleSelection(init) {
    let select = $("#schedule_select");
    select.html(""); // Clear contents

    let schoolSelection = $("#school_select").val()

    let schedules = scheduleData[schoolSelection].schedules;
    for (let schedule in schedules) {
        select.append(`<option value="${schedule}">${schedules[schedule].name}</option>`)
    }

    updateSelected(init);
}

function updateSelected(init) {
    let school = $("#school_select").val();
    let scheduleSelect = $("#schedule_select").val()
    schedule = scheduleData[school].schedules[scheduleSelect];
    if (!init) {
        window.localStorage.setItem("school", school)
        window.localStorage.setItem("schedule", scheduleSelect)
    }
}

TaskQueue.add(() => {

    $("#settingsIcon").on('click', function (e) {
        e.preventDefault(); // dont redirect
    });


    MicroModal.init();
})