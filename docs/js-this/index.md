# js this 指向总结

## 严格模式与非严格模式

```js
// 非严格模式
function foo() {
  console.log(!this);
}
foo(); // false

// 严格模式
('use strict');
function add() {
  console.log(!this);
}
add(); // true
```

严格模式下，禁止 this 指向全局对象 window，这个时候的 this 指向 undefined

## 使用 babel 把 ES6 转成 ES5

```js
// 编译前
'use strict';
var foo = () => this;

// 编译后
('use strict');
var foo = function foo() {
  return undefined;
};
```

```js
// 编译前
'use strict';
var foo = function() {
  return () => this;
};
// 编译后
('use strict');
var foo = function() {
  var _this = this;
  return function() {
    return _this;
  };
};
```

ES6 中的箭头函数中如果有 this，babel 在将他转成 ES5 的时候，会自动判断这个箭头函数的上层是否有 this，如果他的上层是 global/window, 会直接编译成 undefined，因为上面说过严格模式下，禁止 this 指向全局对象。 如果这个箭头函数上层是一个正常的 function， 则会编译成它上层中的 this
