"use strict";
exports.__esModule = true;
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
            //Globalize.culture(culture);
        }
    }
};
exports.configuration = configuration;
configuration.culture.setCulture(configuration.culture.defaultCulture);
//# sourceMappingURL=configuration.js.map