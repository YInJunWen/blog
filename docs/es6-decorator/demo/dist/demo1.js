'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function deco(target) {
    target.prototype.foo = function () {
        console.log('foo');
    };
}

var Add = (_dec = deco(), _dec(_class = function () {
    function Add() {
        _classCallCheck(this, Add);
    }

    _createClass(Add, [{
        key: 'add',
        value: function add() {
            console.log(1);
        }
    }]);

    return Add;
}()) || _class);

var a = new Add();
a.foo();

function add() {}