'use strict';

String.prototype.equalsIgnoreCase = function (that) {
    return this.toUpperCase() === that.toUpperCase();
};