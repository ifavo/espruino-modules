// open database
var DB = require('org.favo.db').connect("test.db");

// add dummy entries
DB.add({"test": 1});
DB.add({"test": 2});
DB.add({"test": 3});


// get entries
DB.get(1); // returns {"test": 1}
DB.get(2); // returns {"test": 2}
DB.get(3); // returns {"test": 3}


// entry count
DB.len(); // returns 3

// remove entries
DB.rem(1); // removes the first entry

// reset database by deleting all entries
DB.truncate();

// open a second database
var DB2 = require('org.favo.db').connect("test2.db");
DB2.add({});

