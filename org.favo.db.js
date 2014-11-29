/* Copyright (c) 2014 Mario Micklisch */
/*
small database module

Example:
```
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


```

*/

var BUFFER_READ = 1024;

exports.connect = function (DB) {
  var DB_LEN = -1;

  /**
   * delete all entries of a database file
   * @return {DB}
   */
  function truncate () {
    var f = E.openFile(DB, 'w');
    f.write();
    f.close();
    DB_LEN = 0;
    return this;
  }

  /**
   * add a new entry to the database
   * @param {Object} row
   * @return {DB}
   */
  function add(row) {
    var f = E.openFile(DB, 'a');
    f.write(JSON.stringify(row) + "\n");
    f.close();
    
    if ( DB_LEN >= 0 ) {
      DB_LEN++;
    }
    return this;
  }

  /**
   * remove an entry from the database
   * @param {Number} idx index
   * @return {DB}
   */
  function rem(idx) {
    var f = E.openFile(DB, 'r');
    var f2 = E.openFile(DB + '.tmp', 'w');
    var row;
    var curIdx = 0;
    var buffer = '';
    var data = '';
    var removed = false;

    // read the file in n-byte-steps
    while ( (data = f.read(BUFFER_READ)) ) {

      // if the targed entry was already removed, stream the rest of the data into the tmp file
      if ( removed ) {
        f2.write(data);
        continue;
      }

      buffer += data;

      // is there a line break, indicating different entries?
      if ( buffer.indexOf("\n") != -1 ) {
        // split entries
        var rows = buffer.split("\n");

        // was there a partial entry read at the end?
        if ( buffer[buffer.length-1] != "\n" ) {
          buffer = rows.pop();
        }

        // otherwise reset the buffer
        else {
          buffer = '';
        }

        // calculate index where we are at
        var newCurIdx = curIdx + rows.length;

        // are we at the requested index?
        if ( idx >= curIdx && idx <= newCurIdx ) {
          var ignore = idx - curIdx - 1;
          var saveRows = [];
          for ( var i in rows ) {
            if ( i != ignore ) {
              saveRows.push(rows[i]);
              if ( DB_LEN >= 0 ) {
                DB_LEN--;
              }
            }
          }
          f2.write(saveRows.join("\n"));
          removed = true;
        }
        else {
          f2.write(rows.join("\n"));
        }
        curIdx += rows.length;
      }
    }
    f.close();
    f2.close();

    // copy f2 back to f
    f = E.openFile(DB, 'w');
    f2 = E.openFile(DB + '.tmp', 'r');
    f2.pipe(f, {chunkSize: BUFFER_READ, complete: function () {
      f.close();
      f2.close();

      // remove tmp file
      f2 = E.openFile(DB + '.tmp', 'w');
      f2.write();
      f2.close();
    }});

    return this;
  }

  /**
   * get the number of entries in the database
   * @param {Bool} forceUpdate optional: ignore cache and enforce reading from source file
   * @return {Number}
   */
  function len(forceUpdate) {
    // use cached DB_LEN if available
    if ( !forceUpdate && DB_LEN >= 0 ) {
      return DB_LEN;
    }
  
    var f = E.openFile(DB, 'r');
    var cnt = -1;
    var buffer = '';
    var data = '';

    while ( (data = f.read(BUFFER_READ)) ) {
      buffer += data;
      // is there a line break, indicating different entries?
      if ( buffer.indexOf("\n") != -1 ) {
        // split entries
        var rows = buffer.split("\n");

        // was there a partial entry read at the end?
        if ( buffer[buffer.length-1] != "\n" ) {
          buffer = rows.pop();
        }

        // otherwise reset the buffer
        else {
          buffer = '';
        }

        cnt += rows.length;
      }
    }
    f.close();

    DB_LEN = cnt;
    return DB_LEN;
  }

  /**
   * get a single entry from the database, identified by its index
   * @param {Number} idx index
   * @return {Object} row
   */
  function get(idx) {
    var f = E.openFile(DB, 'r');
    var row;
    var curIdx = 0;
    var match = null;
    var buffer = '';
    var data = '';

    // read the file in n-byte-steps
    while ( (data = f.read(BUFFER_READ)) ) {

      buffer += data;

      // is there a line break, indicating different entries?
      if ( buffer.indexOf("\n") != -1 ) {
        // split entries
        var rows = buffer.split("\n");

        // was there a partial entry read at the end?
        if ( buffer[buffer.length-1] != "\n" ) {
          buffer = rows.pop();
        }

        // otherwise reset the buffer
        else {
          buffer = '';
        }

        // calculate index where we are at
        var newCurIdx = curIdx + rows.length;

        // are we at the requested index?
        if ( idx >= curIdx && idx <= newCurIdx ) {
          match = rows[idx - curIdx - 1];
          break;
        }
        curIdx += rows.length;
      }
    }
    f.close();

    try {
      match = JSON.parse(match);
    }
    catch (e) {
      match = false;
    }
    return match;
  }

  return {
    add: add,
    rem: rem,
    len: len,
    get: get
  };

}
