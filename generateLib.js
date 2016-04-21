
var fs = require('fs');

//load file "./build/validation.js"
var api = '';

//load template "template.tpl"
var template = '';

// load node_modules/almond/almond.js
var almond = '';

template = template.replace('$apiName$','mw-validation');

template = template.replace('$almond$',almond);

template = template.replace('$api$',api);

//Save final api

console.log(template);