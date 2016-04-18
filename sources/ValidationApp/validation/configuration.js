"use strict";
var configuration = {
    dates: {
        dateProvider: function () {
            var date = new Date();
            date.setHours(0, 0, 0, 0);
            return date;
        }
    },
    culture: {
        defaultCulture: 'fr',
        setCulture: function (culture) {
        }
    }
};
exports.configuration = configuration;
configuration.culture.setCulture(configuration.culture.defaultCulture);
//# sourceMappingURL=configuration.js.map