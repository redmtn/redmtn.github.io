'use strict';

let schedule;

let scheduleData;

const scheduleDir = "resources/schedule";

let hms = window.localStorage.getItem("use_hms");

function yamlResource(...resource) {
    let final = scheduleDir;
    resource.forEach(resource => final += `/${resource}`);
    return fetch(final + ".yml")
        .then(data => {
            return data.text();
        });
}

let jankyWayToExpireTime = false;

function expireTime() {
    console.log("Expiring...")
    jankyWayToExpireTime = true;
}

yamlResource("schools") // load schedules
    .then(schools => {
            parseSchedules(schools).then(value => {
                scheduleData = value;
                $(document).ready(() => {
                    let schoolSelect = $("#school_select");
                    for (const school in value) {
                        schoolSelect.append(`<option value="${school}">${value[school].name}</option>`)
                    }

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

                    $(document).ready(() => {
                        let time = calculateNextEvent();
                        update(time);
                        window.setInterval(() => {
                            let currentDate = getCurrentDate();

                            if(currentDate.getTime() >= time.date.getTime() || jankyWayToExpireTime) {
                                time = calculateNextEvent();
                                jankyWayToExpireTime = false;
                            }
                            update(time);
                        }, 1000);
                    })
                })

            });
        }
    );

function update(time) {
    let diff = splitDifference(getCurrentDate(), time.date);
    $(".countdown").html(prettyPrintDiff(diff, hms === "false" || hms === false));
    $("#event").html(`Until ${time.event}`);
    $("#event_time").html(`${time.event}: ${prettyDate(time.date)}`);
    $("#current_time").html(`Current Time: ${prettyDate(getCurrentDate())}`);

    $("title").text(`${prettyPrintDiff(diff, false)} Until ${time.event}`)
}

$(document).ready(() => {
    let hmsCheck = $("#use_hms");
    hmsCheck.prop("checked", window.localStorage.getItem("use_hms") !== "false");
    hmsCheck.on("change", () => {
        window.localStorage.setItem("use_hms", hmsCheck.prop("checked"));
        hms = hmsCheck.prop("checked");
    });

    let overrideCheck = $("#css_overwrite")
    overrideCheck.prop("checked", window.localStorage.getItem("css_overwrite") !== "false");
    overrideCheck.on("change", () => {
        window.localStorage.setItem("css_overwrite", overrideCheck.prop("checked"));
    });
});


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

$(document).ready(() => {
    $("#settingsIcon").on('click', function (e) {
        e.preventDefault(); // dont redirect
    });


    MicroModal.init();
})