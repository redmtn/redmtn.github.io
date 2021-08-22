'use strict';

String.prototype.equalsIgnoreCase = function (that) {
    return this.toUpperCase() === that.toUpperCase();
};

class TaskQueue {
    static #tasks = [];

    static #finished = false;

    static add(task) {
        if (!this.#finished) {
            this.#tasks.push(task);
        } else {
            task();
        }
    }

    static finish() {
        this.#finished = true;
        this.#tasks.forEach(task => task());
    }
}