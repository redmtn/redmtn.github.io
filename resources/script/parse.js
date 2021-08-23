'use strict';

let schoolYaml;


function parseSchedules(yaml) {
    schoolYaml = jsyaml.load(yaml);
    let schools = [];

    schoolYaml.schools.forEach(school => schools.push(parseSchool(school)));

    return Promise.all(schools)
        .then(value => {
            const schoolsObj = {};
            value.forEach(school => schoolsObj[school.id] = school);
            return schoolsObj;
        });
}

function parseSchool(schoolID) {
    return yamlResource(schoolID, "school") // load schedules
        .then(yaml => {
            let schoolYaml = jsyaml.load(yaml);
            let schedules = [];

            for (const schedule of schoolYaml.schedules) {
                schedules.push(parseSchedule(schoolID, schedule));
            }

            return Promise.all(schedules)
                .then(finishedSchedules => {
                    const schedulesObj = {
                        id: schoolID,
                        name: schoolYaml.name,
                        schedules: {}
                    }

                    finishedSchedules.forEach(schedule => schedulesObj.schedules[schedule.id] = schedule);

                    return schedulesObj;
                });
        });
}

function parseSchedule(schoolID, scheduleID) {
    return yamlResource(schoolID, scheduleID, "schedule")
        .then(yaml => {
            let scheduleYaml = jsyaml.load(yaml);
            return parseRules(scheduleYaml.rules, schoolID, scheduleID)
                .then(rules => {
                    return {
                        id: scheduleID,
                        name: scheduleYaml.name,
                        rules: rules
                    };
                })
        });
}

function parseTimestamp(time, offset) {
    let arr = time.split(":").map(str => parseInt(str, 10));
    let offsetArr = offset.split(":").map(str => parseInt(str));
    return {
        hours: arr[0] + offsetArr[0],
        minutes: arr[1] + offsetArr[1],
        seconds: arr[2] + offsetArr[2]
    };
}

function getTimes(schoolID, scheduleID, timesID) {
    return yamlResource(schoolID, scheduleID, "times", timesID)
        .then(yaml => {
            let scheduleObj = jsyaml.load(yaml)

            let parsedSchedule = {};

            parsedSchedule.times = {};

            for(const time in scheduleObj.times) {
                parsedSchedule.times[time] = {
                    name: scheduleObj.times[time].name,
                    time: parseTimestamp(scheduleObj.times[time].time, scheduleObj.offset)
                }
            }

            return parsedSchedule;
        });
}

function parseRules(rulesObj, schoolID, scheduleID) {
    let rules = rulesObj.map(rule => parseRule(rule, schoolID, scheduleID));
    rules.push(getTimes(schoolID, scheduleID, "default")
        .then(times => Rule.default(times))); // Default rule is last.
    return Promise.all(rules);
}

function parseRule(ruleObj, schoolID, scheduleID) {
    switch (ruleObj.type) {
        case "weekly":
            return getTimes(schoolID, scheduleID, ruleObj.schedule)
                .then(times => {
                    let args = ruleObj.days;
                    args.unshift(times)
                    return Rule.weekDays.apply(Rule, args);
                })
        default:
            throw new Error("Unknown rule type: " + ruleObj.type)
    }
}