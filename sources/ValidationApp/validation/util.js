define([], function () {
    function isEmptyVal(val) {
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
    }
    ;
    function isDate(val) {
        return Object.prototype.toString.apply(val) === "[object Date]";
    }
    ;
    function toDate(val) {
        return Globalize.parseDate(val);
    }
    function padLeft(s, lenght, paddingChar) {
        s = s.toString();
        while (s.length < lenght) {
            s = paddingChar + s;
        }
        return s;
    }
    function formatDate(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        return '' + (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
    }
    function sortHashTable(hashTable, key, removeKey) {
        hashTable = (hashTable instanceof Array ? hashTable : []);
        var newHashTable = hashTable.sort(function (a, b) {
            return (typeof (a[key]) === 'number' ? a[key] - b[key] : a[key] > b[key]);
        });
        if (removeKey) {
            for (i in newHashTable) {
                delete newHashTable[i][key];
            }
        }
        return newHashTable;
    }
    return {
        isEmptyVal: isEmptyVal,
        isDate: isDate,
        toDate: toDate,
        formatDate: formatDate,
        sortHashTable: sortHashTable
    };
});
//# sourceMappingURL=util.js.map