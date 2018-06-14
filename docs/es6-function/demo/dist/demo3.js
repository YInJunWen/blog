"use strict";

function add() {
    for (var _len = arguments.length, value = Array(_len), _key = 0; _key < _len; _key++) {
        value[_key] = arguments[_key];
    }

    console.log(value);
}
function foo(name) {
    for (var _len2 = arguments.length, value = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        value[_key2 - 1] = arguments[_key2];
    }

    console.log(value);
}