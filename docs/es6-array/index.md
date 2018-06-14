# es6 中 array 的扩展

## 扩展运算符

在 ES5 中，如果需要把一个数组作为函数的参数，通常需要使用 apply 方法

```js
function add(x, y, z) {
  console.log([x, y, z]); // [1,2,3]
}
add.apply(null, [1, 2, 3]);
```

扩展运算符`...`可以看做是`...rest`运算符的逆操作，用来把数组转为以逗号分隔的序列化参数，所以上面使用 apply 的方法我们可以这样实现：

```js
function add(x, y, z) {
  console.log([x, y, z]); // [1,2,3]
}
add(...[1, 2, 3]);
```

当然了扩展运算符也可以这么用

```js
function add(x, y, z) {
  console.log([x, y, z]); // [1,2,3]
}
add(1, ...[2, 3]);
```

扩展运算符后面甚至可以使用表达式

```js
let a = [...(true ? [1, 2, 3] : [4, 5]), 6, 7]; // [1,2,3,6,7]
```

扩展运算符也可以用来实现数组的合并操作、复制操作

```js
var a = [1, 2, 3];
var b = [4, 5, 6];
var c = [...a, ...b, 7]; // [1, 2, 3, 4, 5, 6, 7]
var d = [...a]; // [1, 2, 3]
```

注意:

> 使用扩展运算符实现的合并操作、复制操作属于深拷贝！也就是说修改来源数组，并不会改变新生成的数组！[案例](./src/demo2.js)

扩展运算符不仅仅用在数组上，只要目标对象具有遍历器接口`Iterator`都可以使用扩展运算符，因为扩展运算符实际上是`for...of`方法的一种特殊实现, 比如通过`document.querySelectorAll()`方法获取到的 NodeList 对象，就可以使用扩展运算符

```js
var divs = document.querySelectorAll("div");
var list = [...divs];
```

所以如果类数组对象没有遍历器接口，可以通过人工部署遍历器接口后再使用扩展运算符

扩展运算符甚至可以拿来把字符串转成真正的数组

```js
var person = "zhangsan";
var a = [...person]; // ['z', 'h', 'a', 'n', 'g', 's', 'a', 'n']
```

## 类数组转成真实数组的方法 Array.from(target, map, this)

**类数组** 指的是拥有 length 属性的对象

```js
var persons = {
  "0": "zhangsan",
  1: "lisi",
  other: "wangwu",
  length: 3
};
```

在 ES5 中，如果想在类数组中使用数组的方法，需要先把这个类数组转成一个真正的数组，可以通过`[].slice.call()`

```js
var a = [].slice.call(persons); // ['zhangsan', 'lisi']
```

ES6 中提供了新的方法`Array.from()`

```js
var a = Array.from(persons); // ['zhangsan', 'lisi']
```

从执行结果可以看出，只有键名可以转为数字的属性值才能被放进返回的数组内

Array.from()顺便提供了 map 方法，可以在转成真正的数组后，执行一次 map 函数，再返回执行后的数组，和 map 函数相同，也提供了指定上下文的功能`Array.from(target, mapFn, mapThis)`

```js
var person = { name: "zhangsan" };
var a = Array.from(
  [1, 2, 3],
  function(item, index) {
    this[index] = item;
    return item * item;
  },
  person
);

console.log(a); // [ 1, 4, 9 ]
console.log(person); // { '0': 1, '1': 2, '2': 3, name: 'zhangsan' }
```

上面的案例与下面的结果是相同的

```js
var person = { name: "zhangsan" };
var a = Array.from([1, 2, 3]).map(function(item, index) {
  this[index] = item;
  return item * item;
}, person);

console.log(a); // [ 1, 4, 9 ]
console.log(person); // { '0': 1, '1': 2, '2': 3, name: 'zhangsan' }
```

注意:

> 这里有一个大坑，这里的 mapFn 千万不能使用箭头函数，否则后面绑定的 mapThis 是无效的

## 新的创建数组方法 Array.of()

ES6 之前创建数组的构造函数`Array()`会根据传入参数数量的产生不同的结果

- 如果传入一个数字作为参数，会产生一个指定长度的数组，且数组的每一个元素均为空
- 如果传入两个及以上参数，会产生一个由参数组成的新数组

```js
Array(5); // [, , , , ]
Array(5, 6); // [5, 6]
```

`Array.of()`就是为了弥补`Array`的不足，不管传入什么参数，都会生成一个真正的数组,保证了输出结果的统一性， 如果没有参数，会返回一个空数组

```js
Array.of(); //[]
Array.of(1); //[1]
Array.of(1, 2, 3); // [1, 2, 3]
```

## [].copyWithin(target, start, end)

copyWithin 方法主要用于数组内部元素的拷贝操作,

- target 指定开始替换的起始位置，负值的时候表示倒数
- start 表示开始读取的位置， 可以省略， 默认为 0
- end 表示结束读取的位置，可有省略默认为数组的长度

```js
[1, 2, 3, 4, 5].copyWithin(3); // [1, 2, 3, 1, 2]
[1, 2, 3, 4, 5].copyWithin(3, 1); // [1, 2, 3, 2, 3]
[1, 2, 3, 4, 5].copyWithin(3, 1, 2); // [1, 2, 3, 2, 5]
[1, 2, 3, 4, 5].copyWithin(2, 1, 3); // [1, 2, 2, 3, 5]
```

## find(fn(value, index, arr), fnThis)与 findIndex(fn(value, index, arr), fnThis)

这两个方法都是通过传入一个函数来判断数组中是否有满足指定的条件的 **第一个** 元素

find()方法，返回满足条件的元素本身,如果没有找到返回 `undefined`

```js
[1,2,3].find(function(item){
    returbn item> 1
})   // 2


[1,2,3].find(function(item){
    returbn item> 4
})   // undefined
```

findIndex()方法返回满足条件的元素所在位置的索引值，如果没有找到返回`-1`

```js
[1,2,3].findIndex(function(item){
    returbn item> 1
})   // 1

[1,2,3].findIndex(function(item){
    returbn item> 4
})   // -1
```

这两个方法也可以接受[第二个参数]('./src/demo4.js)，用来绑定作为判断条件函数的 this

```js
var person = { age: 13 };
var a = [12, 13, 14];

a.find(function(item) {
  return item > this.age;
}, person); // 14

a.findIndex(function(item) {
  return item > this.age;
}, person); // 2
```

在 ES5 中判断数组中是否包含某个元素，通常会使用 indexOf 方法，由于实现方式的不同，indexOf 方法无法判断`NaN`，而 find 与 findIndex 方法弥补了这方面的不足[案例](./src/demo5.js)

```js
var a = [Nan, 2];
a.indexOf(NaN); // -1
a.find(function(item) {
  return Object.is(NaN, item);
}); // NaN
a.findIndex(function(item) {
  return Object.is(NaN, item);
}); // 0
```

## [].fill(value, start, end)

fill 方法可以使用指定值填充数组，value 指定填充的内容，它的值可以是任何有效对象，start 指定填充的起始位置与结束位置，start 默认为 0，end 默认为数组的长度，如果未指定 start 和 end，数组的所有元素都会被填充为指定值

```js
[1, 2, 3].fill(0); // [0, 0, 0]
[1, 2, 3].fill(0, 1); // [1, 0, 0]
[1, 2, 3].fill(0, 1, 2); // [1, 0, 3]
```

注意：

> 如果填充对象是一个复合数据类型，这里的填充操作是一个[浅拷贝](./src/demo6.js)

```js
var a = { name: "zhangsan" };
var b = [1, 2, 3].fill(a, 0, 1);
console.log(b); // [ { name: 'zhangsan' }, 2, 3 ]
a.name = "lisi";
console.log(b); // [ { name: 'lisi' }, 2, 3 ]
```

## entries()、keys()、values()

ES6 对数组提供了这三个方法来扩展对数组元素的获取，三种方法都返回一个遍历器对象，可以通过`for...of...`或者`Iterator.next().value`获取其中的内容

```js
var a = [1, 2, 3];
for (let x of a.keys()) {
  console.log(x); // 0,1,2
}

for (let x of a.entries()) {
  console.log(x); // [0, 1], [1, 2], [2, 3]
}

for (let x of a.values()) {
  console.log(x); //.values() is not a function
}
```

注意：

> 按照官方文档，数组的 values 方法也可以返回一个遍历器对象，但是我在 Node 环境中执行的时候，提示`.values() is not a function`，也没有在网上查找到相应的解释，只能暂时把责任推到 node 环境还没有实现该方法上，知道问题的麻烦告诉我一声。entries 和 keys 可以正常使用

另外需要注意，这里是数组的属性，要和`Object.keys(), Object.values(), Object.entries()`区分开

## includes(target, index)

includes 方法也是用来检查元素中是否包含指定的元素，并且可以指定开始查找的位置,返回一个布尔值

```js
[1, 2, 3].includes(2); // true
[1, 2, 3].includes(10); // false
```

ES6 之前通常使用 indexOf 来判断，但是 indexOf 无法判断`NaN`，因此 includes()也弥补了这个不足，这是因为 indexOf 内部使用了`===`而 includes 内部则使用了不一样的算法

```js
[1, 2, NaN].indexOf(NaN); // -1
[1, 2, NaN].includes(NaN); // true;
```

如果指定了第二个参数，会从参数指定的位置开始查找

```js
[1, 2, 3].includes(2, 1); // true
[1, 2, 3].includes(2, 2); // false
```

## 数组中的空位

在使用构造函数`Array`时，如果只传递一个参数，会生成一个指定长度的数组，这个时候数组的每一个元素都是一个 **空位**，对于这些空位 ES5 不同的方法处理的方式不同[案例]('./src/demo8.js)

- forEach，filter，reduce，some，every,map 会跳过空位
- join 和 toString 会将空位当做 undefined，但是 undefined 和 null 在转字符串的时候，会被转成一个空字符串

空位和 undefined 是不同的，undefined 是基础数据类型中的一种值，而空位是没有值的

```js
0 in [undefined, undefined]; // true
0 in [,]; // false
```

上面的例子中，第一个数组说明第一个位置是有值的 ，而第二个数组的第一个位置是没有值的

ES6 统一了对空位的处理，不再跳过空位，而是统一将空位处理为 undefined

Array.from()会将空位转成 undefined

```js
Array.from([, , ,]); // [undefined, undefiend, undefined]
```

fill()方法在填充的时候，也不会跳过空位

```js
[, , ,].fill(0); //[0, 0, 0]
```

find()和 findIndex()会把空位当做 undefined 处理

```js
[, 1, 2].find(item => {
  return Object.is(undefined, item);
});
```

copyWithin() 会连空位一起拷贝

```js
[1, 2, 3, , 5].copyWithin(0, 3); // [,5,3,,5]
```

for...in...操作不会跳过空位,而 map 会跳过空位

```js
let a = 0;
for (let x in [, , ,]) {
  a++;
}
console.log(a); // 3

let b = 0;
[, , ,].map(x => {
  b++;
});
console.log(b); // 0
```

entries()会把空位处理成 undefined

```js
var a = [, ,];

for (let x of a.entries()) {
  console.log(x); // [0, undefined], [1, undefined]
}
```
