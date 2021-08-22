'use strict';

// a bunch of rule implementations

class Rule {
    #match

    schedule

    static #weekArray = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    static #toNumericDay(day) {
        for (let i = 0; i < this.#weekArray.length; i++) {
            if (this.#weekArray[i].equalsIgnoreCase(day)) return i;
        }
        throw new Error("Invalid day: " + day);
    }

    constructor(match, schedule) {
        this.#match = match;
        this.schedule = schedule;
    }

    matches(date) {
        return this.#match(date);
    }

    static default(schedule) {
        return new Rule(() => {
            return true
        }, schedule);
    }

    static weekDays(schedule, ...days) {
        let numericDays = [];

        days.forEach(day => numericDays.push(Rule.#toNumericDay(day)));

        return new Rule(date => numericDays.includes(date.getDay()), schedule);
    }
}