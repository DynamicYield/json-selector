require('../index.js');
var test = require('unit.js');

var testJson = {
  windspeed: 17,
  temp: {
    min: 14,
    max: 15,
    mean: 14.5
  },
  list: [
    {
      baz: [
        { a: 4, b: 1 },
        { a: 5, b: 2 }
      ],
      baq: 4
    },
    {
      baz: [
        { a: 6, b: 1 },
        { a: 7, b: 2 },
        function() {
          return { a: 8, b: 3 };
        }
      ],
      baq: 10
    }
  ]
};

var tests = [
  [
    {
      "<array>": ".list",
      "<flatten>": true,
      "<item>": {
        "<array>": ".baz",
        "<item>": {
          "k": ".a",
          "m": "^.baq",
          "n": "/.windspeed",
          "n2": "^^.windspeed"
        }
      }
    },
    [
      {
        "k": 4,
        "m": 4,
        "n": 17,
        "n2": 17
      },
      {
        "k": 5,
        "m": 4,
        "n": 17,
        "n2": 17
      },
      {
        "k": 6,
        "m": 10,
        "n": 17,
        "n2": 17
      },
      {
        "k": 7,
        "m": 10,
        "n": 17,
        "n2": 17
      },
      {
        "k": 8,
        "m": 10,
        "n": 17,
        "n2": 17
      }
    ]
  ]
];

describe('Scope Tests', function() {
  tests.forEach(function(testCase) {
    it('query ' + JSON.stringify(testCase[0]), function() {
      test
        .value(Object.query(testJson, testCase[0]))
        .is(testCase[1]);
    });
  });
});
