
var fs = require('fs');

//load file "./build/validation.js"
var api = fs.readFileSync('./build/validation.js').toString();

//load template "template.tpl"
var template = fs.readFileSync('./template.tpl').toString();

// load node_modules/almond/almond.js
var almond = fs.readFileSync('./node_modules/almond/almond.js');

template = template.replace('$apiName$', '"mw"');

template = template.replace('$almond$', almond);

template = template.replace('$api$', api);

//Save final api
fs.writeFileSync('./build/mw-validation.js', template);
