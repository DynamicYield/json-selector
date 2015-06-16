Object.query = function(object, query, fallbackValue) {
  var match, index;

  if (query === null) {
    return object;
  }

  if (typeof fallbackValue === 'undefined') {
    match = query.match(/^(.*?)\s*(?:\|\|\s*(.*))?$/);
    query = match[1];
    fallbackValue = typeof match[2] !== 'undefined' ? match[2] : null;
  }

  if (!query.length) {
    return tryRun(object);
  } else if (query[0] === '.') {
    match = query.match(/^\.([^\.\[]*)(.*)$/);
    index = match[1];
    query = match[2];
  } else if (query[0] === '[') {
    match = query.match(/^\[([^\]]*)\](.*)$/);
    index = match[1];
    query = match[2];
  } else {
    throw new Error('invalid query format ' + query);
  }

  if (object.hasOwnProperty(index)) {
    return Object.query(tryRun(object[index]), query, fallbackValue);
  } else {
    return JSON.parse(fallbackValue);
  }

  function tryRun(object) {
    if (typeof object === 'function' && new RegExp('^function [^(]*\\(\\)').test(object.toString())) {
      return object();
    } else {
      return object;
    }
  }
};
