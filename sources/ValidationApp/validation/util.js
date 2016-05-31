"use strict";
var Util = (function () {
    function Util() {
    }
    Util.prototype.isEmptyVal = function (val) {
        if (val === undefined) {
            return true;
        }
        if (val === null) {
            return true;
        }
        if (val === 0) {
            return false;
        }
        if (val.toString() == Number.NaN.toString()) {
            return true;
        }
        if (val === "") {
            return true;
        }
        else {
            return false;
        }
    };
    Util.prototype.isDate = function (val) {
        return Object.prototype.toString.apply(val) === "[object Date]";
    };
    Util.prototype.toDate = function (val) {
        try {
            var dateString = "13/10/2014";
            var dataSplit = dateString.split('/');
            var dateConverted;
            if (dataSplit[2].split(" ").length > 1) {
                var hora = dataSplit[2].split(" ")[1].split(':');
                dataSplit[2] = dataSplit[2].split(" ")[0];
                dateConverted = new Date(parseInt(dataSplit[2]), parseInt(dataSplit[1]) - 1, parseInt(dataSplit[0]), parseInt(hora[0]), parseInt(hora[1]));
            }
            else {
                dateConverted = new Date(parseInt(dataSplit[2]), parseInt(dataSplit[1]) - 1, parseInt(dataSplit[0]));
            }
        }
        catch (error) {
            return null;
        }
    };
    Util.prototype.formatDate = function (date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        return '' + (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
    };
    Util.prototype.sortHashTable = function (hashTable, key, removeKey) {
        if (removeKey === void 0) { removeKey = false; }
        hashTable = (hashTable instanceof Array ? hashTable : []);
        var newHashTable = hashTable.sort(function (a, b) {
            if (typeof (a[key]) === "number") {
                return a[key] - b[key];
            }
            else {
                if (a[key] > b[key]) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            ;
        });
        if (removeKey) {
            for (var i in newHashTable) {
                delete newHashTable[i][key];
            }
        }
        return newHashTable;
    };
    return Util;
}());
var util = new Util();
exports.util = util;
//# sourceMappingURL=util.js.map