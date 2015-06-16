Object.query = function(object, query, fallbackValue, scopes) {
  var undefined, result, match, index;

  if (typeof scopes === 'undefined') {
    scopes = {
      root: object,
      parents: []
    };
  }

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
    }

    switch (query[0]) {
    case '.':
      match = query.match(/^\.([^\.\[]*)(.*)$/);
      index = match[1];
      query = match[2];
      break;
    case '[':
      match = query.match(/^\[([^\]]*)\](.*)$/);
      index = match[1];
      query = match[2];
      break;
    case '/':
      return Object.query(scopes.root, query.substr(1), fallbackValue);
    case '^':
      if (scopes.parents.length === 0) {
        throw new Error('no parent scope found ' + query);
      }
      object = scopes.parents[0];
      scopes = {
        root: scopes.root,
        parents: scopes.parents.slice(1)
      };
      return Object.query(object, query.substr(1), fallbackValue, scopes);
    default:
      throw new Error('invalid query format ' + query);
    }

    if (object.hasOwnProperty(index)) {
      return Object.query(tryRun(object[index]), query, fallbackValue, scopes);
    } else {
      return JSON.parse(fallbackValue);
    }
  } else if (query.constructor === Array) {
    result = [];
    query.forEach(function(query) {
      var subResult;
      if (query.constructor === Array) {
        result.push(Object.query(object, query, undefined, scopes));
      } else {
        subResult = Object.query(object, query, undefined, scopes);
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
    result = Object.query(object, query['<array>'], undefined, scopes);
    var newScopes = {
      root: scopes.root,
      parents: [object].concat(scopes.parents)
    };
    if (result !== null) {
      result = result.map(function(item) {
        return Object.query(tryRun(item), query['<item>'], undefined, newScopes);
      });
    }
    if (query['<flatten>'] === true) {
      result = [].concat.apply([], result);
    }
    return result;
  } else {
    result = {};
    for (index in query) {
      setRecursiveKeyInObject(result, index,
                              Object.query(object, query[index], undefined, scopes));
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
