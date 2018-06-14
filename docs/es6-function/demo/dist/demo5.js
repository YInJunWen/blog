"use strict";

function add() {
  var _this = this;

  var foo = function foo() {
    console.log(_this.id);
  };
}
function foo() {
  var _this2 = this;

  setTimeout(function () {
    console.log(_this2.name);
  });
}