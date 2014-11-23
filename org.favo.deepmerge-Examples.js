var deepmerge = require('org.favo.deepmerge').deepmerge;

var obj1 = {
	hello: "hello",
	world: "world",
	date: {
		day: 23,
		month: 1,
		year: 1980
	}
};

var obj2 = {
	hello: "hi",
	date: {
		year: 2014
	}
};

console.log ( deepmerge(obj1, obj2) ) ;

/**
 * output looks like this:
 *
 * {
 *  "hello": "hi",
 *  "world": "world",
 *  "date": { "day": 23, "month": 1, "year": 2014 }
 * }
 */