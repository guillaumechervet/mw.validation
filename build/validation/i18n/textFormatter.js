"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var format = function (format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return format.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== "undefined" ? args[number] : match;
    });
};
exports.format = format;
var template = function (format, data) {
    if (!data)
        return format;
    Object.keys(data).forEach(function (key) {
        format = format.replace("{" + key + "}", data[key]);
    });
    return format;
};
exports.template = template;
function endWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
exports.endWith = endWith;
