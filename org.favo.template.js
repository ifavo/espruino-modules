/* Copyright (c) 2014 Mario Micklisch */
/*
very small templating module

Example:
```
// get the template module
var TPL = require('org.favo.template').render;

TPL("Hello {name}", {name: "You"}); // returns "Hello You"
TPL("Hello {location.planet}", {name: "You", location: {planet: "World"}}); // returns "Hello World"

```

*/

function render (s, d, p) {
  p=(p)?p+'.':'';
  for (var k in d) {
    if(typeof(d[k])=='object') {
      s=render(s,d[k],p+k);
    }
    else {
      while(s.indexOf('{'+p+k+'}')>=0) {
        s=s.replace('{'+p+k+'}',d[k]);
      }
    }
  }
  return s;
}
exports.render = render;