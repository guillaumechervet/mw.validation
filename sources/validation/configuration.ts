

    
    var configuration = {
        dates: {
            dateProvider: function() {
                var date = new Date();
                date.setHours(0, 0, 0, 0);
                return date;
            }
        },
        culture: {
            defaultCulture: 'fr',
            setCulture: function(culture) {
                //Globalize.culture(culture);
            }
        }
    };

    configuration.culture.setCulture(configuration.culture.defaultCulture);

    export {configuration};

