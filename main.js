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

var testJson = {
  foo: 'bar',
  list: [
    {
      baz: [
        4,
        5
      ],
      baq: 4
    },
    {
      baz: [
        6,
        7,
        function() {
          return "yay";
        }
      ],
      baq: 10
    }
  ],
  run: function() {
    return {
      yes: '1',
      no: '0'
    };
  },
  fun: function(a) {
    return a + a;
  }
};

var tests = [
  [".list[1].baq", 10],
  [".foo", "bar"],
  [".run.yes", "1"],
  [".foo || \"sad\"", "bar"],
  [".run.yes || \"sad\"", "1"],
  [".list[1].baz[2]", "yay"],
  [".baz", null],
  [".run.baz", null],
  [".baz || 0", 0],
  [".baz.quux || 1", 1],
  [".run.baz || \"2\"", '2'],
  ["", testJson],
  [null, testJson]
];

var i, result;
for (i = 0; i < tests.length; i++) {
  console.log('Testing \"' + tests[i][0] + "\" with ", tests[i][1]);
  result = Object.query(testJson, tests[i][0]);
  if (result === tests[i][1]) {
    console.log('Pass');
  } else {
    console.log('Fail', result);
  }
}
