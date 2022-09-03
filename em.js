_app = {};

_app.tests = {
  my: (myName = () => {
    console.log("hi");
  }),
};

_app.countTests = function () {
  var counter = 0;
  for (var key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      var subTests = _app.tests[key];
      console.log(subTests);
      for (var testName in subTests) {
        console.log("hi", testName);
        if (subTests.hasOwnProperty(testName)) {
          counter++;
        }
      }
    }
  }
  return counter;
};

console.log(_app.countTests());
