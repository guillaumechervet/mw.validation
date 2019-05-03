const format = function(format: string, ...args) {
  return format.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] !== "undefined" ? args[number] : match;
  });
};

const template = function(format: string, data) {
  if (!data) return format;
  Object.keys(data).forEach(key => {
    format = format.replace("{" + key + "}", data[key]);
  });
  return format;
};

function endWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export { format, endWith, template };
