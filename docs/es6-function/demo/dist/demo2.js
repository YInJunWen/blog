'use strict';

var x = 1;
function add(x) {
  console.log(x);
  var x = 2;
  console.log(x);
}
add(1);