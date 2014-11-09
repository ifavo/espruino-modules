var Promise = require('org.favo.promise');

/**
 * test function
 *  @return {Promise}
 */
function testSuccess () {
  var promise = Promise.defer();

  setTimeout(function () {
    promise.resolve("world"); // resolve = success
  }, 1000);

  return promise;
}



/**
 * test function
 *  @return {Promise}
 */
function testError () {
  var promise = Promise.defer();

  setTimeout(function () {
    promise.reject("error information"); // reject the promise = error
  }, 1000);

  return promise;
}


testSuccess().then(function (data) {
  console.log("Hello " + data);
});

testError().then(function (data) {
  console.log("Hello " + data);
}, function (err) {
  console.log("received error: " + err);
});


testSuccess().then(function () {
    console.log("success");
}).next(function() {
    console.log("first success"); // called after 2000ms.
    return "ok";
}, 2000).next(function(res) {
    console.log(res); // call after more 2000ms, and res is "ok"
}, 2000);



var param = "world";

Promise.when(testSuccess(), testError(), param).then(function (res) {
    console.log("result", res);
});

Promise.when(testSuccess(), testError(), param).next(function (data) {
    return "aloha " + data;
}).then(function (res) {
    console.log("result", res);
});

Promise.when(testSuccess(), param).next(function (data) {
    return "hi " + data;
}).then(function (res) {
    console.log("success", res);
}, function (res) {
    console.log("error", res);
});

Promise.when(testError(), param).next(function (data) {
    return "hello " + data;
}).then(function (res) {
    console.log("success", res);
}, function (res) {
    console.log("error", res);
});