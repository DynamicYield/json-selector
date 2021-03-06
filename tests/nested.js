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
      "weather.temp_min": ".temp.min",
      "weather.temp_max": ".temp.max",
      "weather.temp_day": ".temp.mean",
      "weather.wind.speed": ".windspeed",
      "weather\\.temp\\.min": ".temp.min"
    },
    {
      weather: {
        temp_min: 14,
        temp_max: 15,
        temp_day: 14.5,
        wind: {
          speed: 17
        }
      },
      'weather.temp.min': 14
    }
  ],
  [
    {
      "weather": {
        "temp_min": ".temp.min",
        "temp_max": ".temp.max",
        "temp_day": ".temp.mean",
        "wind": {
          "speed": ".windspeed"
        }
      }
    },
    {
      weather: {
        temp_min: 14,
        temp_max: 15,
        temp_day: 14.5,
        wind: {
          speed: 17
        }
      }
    }
  ],
  [
    {
      "<array>": ".list",
      "<item>": {
        "numbers": {
          "<array>": ".baz",
          "<item>": ".a"
        },
        "others": {
          "<array>": ".baz",
          "<item>": {
            "val": ".b"
          }
        }
      }
    },
    [
      {
        numbers: [4, 5],
        others: [
          {val: 1},
          {val: 2}
        ]
      },
      {
        numbers: [6, 7, 8],
        others: [
          {val: 1},
          {val: 2},
          {val: 3}
        ]
      }
    ]
  ],
  [
    [
      ".temp.min",
      ".temp.max",
      ".list[0].baz"
    ],
    [
      14,
      15,
      { a: 4, b: 1 },
      { a: 5, b: 2 }
    ]
  ],
  [
    [
      ".temp.min",
      ".temp.max",
      [".list[0].baz"]
    ],
    [
      14,
      15,
      [
        { a: 4, b: 1 },
        { a: 5, b: 2 }
      ]
    ]
  ]
];

describe('Nested Tests', function() {
  tests.forEach(function(testCase) {
    it('query ' + JSON.stringify(testCase[0]), function() {
      test
        .value(Object.query(testJson, testCase[0]))
        .is(testCase[1]);
    });
  });
});
