
    var format = function (format: string, ...args) {
        //var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined'
        ? args[number]
        : match
      ;
        });
    };

    function endWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    export {format, endWith};
