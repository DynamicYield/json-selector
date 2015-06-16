Object.query = function(object, query, fallbackValue) {
  var result, match, index;

  if (query === null) {
    return object;
  } else if (typeof query === 'string') {
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
  } else if (query.constructor === Array) {
    result = [];
    query.forEach(function(query) {
      var subResult;
      if (query.constructor === Array) {
        result.push(Object.query(object, query));
      } else {
        subResult = Object.query(object, query);
        if (subResult.constructor === Array) {
          subResult.forEach(function(subResult) {
            result.push(subResult);
          });
        } else {
          result.push(subResult);
        }
      }
    });
    return result;
  } else if (query.hasOwnProperty('<array>') && query.hasOwnProperty('<item>')) {
    result = Object.query(object, query['<array>']);
    if (result === null) {
      return result;
    } else {
      return result.map(function(item) {
        return Object.query(tryRun(item), query['<item>']);
      });
    }
  } else {
    result = {};
    for (index in query) {
      setRecursiveKeyInObject(result, index, Object.query(object, query[index]));
    }
    return result;
  }

  function setRecursiveKeyInObject(object, key, value) {
    var keyParts =
        key
        .replace(/\\./g, '~`~')
        .split('.')
        .map(function(s) { return s.replace(/~`~/g, '.'); });
    var current = object;
    for (var i = 0; i < keyParts.length - 1; i++) {
      if (!current.hasOwnProperty(keyParts[i])) {
        current[keyParts[i]] = {};
      }
      current = current[keyParts[i]];
    }
    current[keyParts[i]] = value;
  }

  function tryRun(object) {
    if (typeof object === 'function' && new RegExp('^function [^(]*\\(\\)').test(object.toString())) {
      return object();
    } else {
      return object;
    }
  }
};
