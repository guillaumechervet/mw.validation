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
        return Globalize.parseDate(val);
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