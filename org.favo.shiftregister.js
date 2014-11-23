/* Copyright (c) 2014 Mario Micklisch */
/*
Module for Shift Registers
tested with the 74HC595 but should work with other registers too

Example:
```
var spi = new SPI();
spi.setup({mosi: C1, sck: C2});
var latchPin = A0;

var register = require('org.favo.shiftregister').connect(spi, latchPin);

register.on(0); // single pins
register.off([2,3,4]); // array of pins
register.off(0); // single pins
register.off([3,4]); // array of pins
register.getStatus(); // array with current status
register.setStatus([0,1,0,1,0,1,0,1]); // array overwriting current status
```

*/

exports.connect = function(spi, lp) {

  // register status
  var status = [0,0,0,0,0,0,0,0,0,0];
  
  /**
   * set a single pin on
   * @param {Number} pin|array
   */
  function setOn(pin) {
    if ( typeof(pin) == 'object' ) {
      for ( var i in pin ) {
        status[pin[i]]=1;
      }
    }
    else status[pin]=1;
    sendStatus();
  }

  /**
   * set a single pin off
   * @param {Number} pin|array
   */
  function setOff(pin) {
    if ( typeof(pin) == 'object' ) {
      for ( var i in pin ) {
        status[pin[i]]=0;
      }
    }
    else status[pin]=0;
    sendStatus();
  }

  /**
   * gets the current pin status as array
   * @return {Array}
   */
  function getStatus() {
    return status;
  }

  /**
   * sets the current status for all pins
   * @param {Array} status
   */
  function setStatus(newStatus) {
    status = newStatus;
    sendStatus();
  }
  
  /**
   * send pin status to the register
   */
  function sendStatus() {
    var cmd = 0;
    for ( var i in status ) {
      cmd += status[i]<<i;
    }

    spi.send(cmd, lp);
  }

  /**
   * public interface to the register
   */
  return {
    status: getStatus,
  	on: setOn,
  	off: setOff
  }
};