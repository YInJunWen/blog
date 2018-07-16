# es6-map 新的数据结构 Map 与 WeakMap

在之前的对象中，**键名** 只能是字符串，为了解决这个问题，ES6 推出了一个类似于普通对象的数据结构： Map。

Map 也是以键值对的形式出现，一个新的 Map 实例使用`new`关键字生成：

```js
let map = new Map();
```

`new Map()`方法，允许传递一个数组作为参数，数组的格式如下

```js
let map = new Map([['name', 'orange'], ['age', '18']]);
map; // Map(2) {"name" => "orange", "age" => "18"}
```

可以看出上面案例中的键值对以多维数组的形式作为参数。最外层的数组表示内含多少组键值对，内层数组的第一个元素组成 Map 实例的键名，第二个元素作为 Map 实例的键值

与传统对象不同的是：Map 实例可以使用 **任何数据类型** 作为 **键名**。

```js
let map = new Map([
  ['name', 'string'],
  [10, 'number'],
  [true, 'boolean'],
  [null, 'null'],
  [undefined, 'undefined'],
  [function() {}, 'function'],
  [{}, 'object'],
  [[], 'array'],
  [Symbol(), 'symbol'],
  [new Set(), 'set'],
  [new Map(), 'map'],
]);
```

如果参数中出现两个一样的键名，对应的值以最后的为准

```js
let map = new Map([['name', 'orange'], ['age', '18'], ['name', 'pear']]);
map; // Map(2) {"name" => "pear", "age" => "18"}
```

表面看起来相同的对象和数组在作为键名的时候，后面的值不会覆盖前面的值

```js
let map = new Map([
  [{}, 'object'],
  [{}, 'object'],
  [[], 'array'],
  [[], 'array'],
]);
map; // Map(2) {{} => "object", {} => "object", Array(0) => "array", Array(0) => "array"}
```

在处理 NaN 的问题上与 Set 保持一致，即：后面 NaN 的值会覆盖前面 NaN 的值

```js
let map = new Map([[NaN, 'NaN1'], [NaN, 'NaN2']]);
map; // Map(1) {NaN => "NaN2"}
```

## 属性

`size` 属性，可以返回 Map 实例有多少个键值对

```js
let map = new Map([['name', 'orange'], ['age', '18']]);
map.size; // 2
```

## 方法

### set()

`set()`方法用于往 Map 实例中添加新的键值对，并且返回 Map 实例本身，因此可以链式调用，在添加键值对的时候，同样遵循“相同键名时，后添加的值覆盖先添加的值”的规则。

```js
let map = new Map();
map.set('name', 'orange').set('age', '18');
map
  .set('name', 'orange')
  .set('age', '18')
  .set('name', 'pear');

map; // Map(2) {"name" => "pear", "age" => "18"}
map.size; // 2
```

### get()

`get()`方法用来获取指定键名的值

```js
let map = new Map([['name', 'orange'], ['age', '18']]);
map.get('name'); // "orange"
```

复杂的数据类型作为键名的时候，就没那么简单了

```js
let map = new Map([[{}, 'orange']]);
map.get({}); // undefined
```

上面的案例中，由于`new Map()`参数中的`{}`和`get()`中的参数`{}`并不是同一个键名，导致使用 get 方法的时候，获取不到正确的值。因此这个时候，就需要把`{}`赋值给一个变量，通过变量来获取到对应的值

```js
let obj = {};
let map = new Map([[obj, 'orange']]);
map.get(obj); // "orange"
```

### has()

`has()`方法用来判断是否存在某个 **键名**，存在则返回 true， 不存在返回 false

```js
let map = new Map({})
map.has({}); // false


let obj = {};
let map2 = new Map(obj);
map2.has(obj); /true
```

### delete()

`delete()`方法，用于删除指定的键值对，删除成功返回 true，删除失败返回 false(比如参数传入一个并不存在的键名)

```js
let obj = {};
let map = new Map([
  ['name', 'orange'],
  [18, '18'],
  [{}, 'object'],
  [obj, 'obj'],
]);
map.size; // 4

map.delete('name'); // true
map.size; // 3

map.delete({}); // false  这里的{}与生成参数中的{}并不是同一个值
map.delete(obj); // true
map.size; // 2
```

### clear()

`clear()`方法，用于清空 Map 实例的所有属性，返回 undefined

```js
let map = new Map([['name', 'orange'], ['age', '18']]);
map.size; // 2

map.clear();
map.size; // 0
```

### keys()、values()、entries()方法

Map 实例也有自己的`keys()、values()、entries()`方法

1.`keys()`返回一个遍历器对象，遍历后可以得到 Map 实例的所有键名

```js
let map = new Map([['name', 'orange'], ['age', '18']]);
[...map.keys()]; // ["name", "age"]
```

2.`values()`返回一个遍历器接口，便利后可以得到 Map 实例的所有键值

```js
let map = new Map([['name', 'orange'], ['age', '18']]);
[...map.values()]; // ["orange", "18"]
```

2.`entries()`返回一个遍历器接口，便利后可以得到 Map 实例的所有的键值对

```js
let map = new Map([['name', 'orange'], ['age', '18']]);
[...map.entries()]; // [["name", "orange"], ["age", "18"]]
```

### 遍历

Map 实例本身也部署了`[Symbol.iterator]`属性，因此也可以使用扩展运算符`...`和`for...of...`遍历 Map 实例。这两种方式实际上执行了 Map 实例的`entries()`方法

```js
let map = new Map([['name', 'orange'], ['age', '18']]);
[...map]; // // [["name", "orange"], ["age", "18"]]

for (let item of map) {
  console.log(item);
}
// ["name", "orange"]
// ["age", "18"]

// 也可以写作：
for (let [key, value] of map) {
  console.log([key, value]);
}
// ["name", "orange"]
// ["age", "18"]
```

`forEach(fn, context)` 方法也可以用来遍历 Map 实例，与扩展和运算符和`for..of...`不同的是： forEach 遍历的对象实际上是`values()`方法的值

```js
let map = new Map([['name', 'orange'], ['age', '18']]);

map.forEach(x => {
  console.log(x);
});
// "orange"
// "18"
```

参数中的 context 可以用来绑定 fn 函数中的 this。用法与数组的 map 函数相同。

## WeakMap

WeakMap 也是 ES6 推出的新型数据结构，大体与 Map 保持一致，同样使用`new`关键字生成实例

```js
let weakMap = new WeakMap();
```

### WeakMap 与 Map 的不同之处在于以下两点

1.WeakMap 不允添加键名为 **原始数据类型**的属性，以下键名都会抛出错误`TypeError: Invalid value used as weak map key`

```js
let weakMap = new WeakMap();
weakMap.set('string', 'string');
weakMap.set(10, 'number');
weakMap.set(true, 'boolean');
weakMap.set(null, 'null');
weakMap.set(undefined, 'undefined');
weakMap.set(Symbol(), 'symbol');
```

也就是说只允许添加 **非原始数据类型**

```js
let weakMap = new WeakMap();
weakMap.set({}, 'object');
weakMap.set([], 'array');
weakMap.set(function() {}, 'function');
weakMap.set(new Set(), 'Set');
weakMap.set(new Map(), 'Map');
// ...等等
```

2.WeakMap 的键名属于弱引用，与 WeakSet 一样不会计入垃圾回收机制

垃圾回收机制可以参考[es6-set](../es6-set)中的 WeakSet 部分。

因此，WeakMap 实例没有`size`属性以及`clear(),keys(),values(),entries(),forEach()`方法

```js
let weakMap = new WeakMap();

weakMap.size; //undefined
weakMap.clear; //undefined
weakMap.keys; //undefined
weakMap.values; //undefined
weakMap.entries; //undefined
weakMap.forEach; //undefined
```

只能使用`set(), get(), has(), delete()`方法

```js
let obj = {};
let weakMap = new WeakMap();

weakMap.set(obj, 'obj');
weakMap.get({}); // undefined
weakMap.get(obj); // "obj"
weakMap.has({}); // false
weakMap.has(obj); // true
weakMap.delete({}); // false
weakMap.delete(obj); // true
```
