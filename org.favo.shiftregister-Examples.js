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