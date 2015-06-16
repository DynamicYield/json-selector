require('./index.js');

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

var i, result;
for (i = 0; i < tests.length; i++) {
  console.log('Testing', JSON.stringify(tests[i][0]), 'with', JSON.stringify(tests[i][1]));
  result = Object.query(testJson, tests[i][0]);
  if (JSON.stringify(result) === JSON.stringify(tests[i][1])) {
    console.log('Pass');
  } else {
    console.log('Fail', JSON.stringify(result));
  }
}
