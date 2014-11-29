// get the template module
var TPL = require('org.favo.template').render;

console.log ( TPL("Hello {name}", {name: "You"}) ); // returns "Hello You"
console.log( TPL("Hello {location.planet}", {name: "You", location: {planet: "World"}}) ); // returns "Hello World"