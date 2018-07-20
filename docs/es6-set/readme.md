# es6-set 新的数据结构 Set 与 WeakSet

ES6 中加入了一种新的数据结构：Set，Set 本身是一个构造函数，需要使用`new`关键字来生成一个实例

```js
let set = new Set();
```

`new Set()`生成一个类似数组的数据结构，方法本身可以加入一个数组作为参数

```js
let set = new Set([1, 2, 3, 3, 4, 5]);
```

实际上，`new Set()`方法的参数也可以是一个类数组，或者说 `”只要是参数本身部署了[Symbol.iterator]属性“`，就可以作为`new Set()`的参数

```js
let obj = {length: 3}
obj[Symbol.iterator] = function* (){yield 1;yield 2;yield 3;}
let set = new Set(obj
set; // Set(3) {1, 2, 3}
```

与数组不同之处在于，在生成实例的过程中，会自动去除掉相同的元素

```js
let set = new Set([1, 2, 3, 3, 4, 5]);
set; // Set(5) {1,2,3,4,5}
```

由于 Set 数据结构采用了与`===`不同的算法，所以在 Set 数据结构中 NaN 和 NaN 是同一个值，只能保留一个:

```js
NaN === NaN; // false
let set = new Set([NaN, NaN]);
set; // Set(1) {NaN}
```

对于复杂的数据结构，在 Set 中也是不同的，比如两个表面看起来相同的空对象或者空数组：

```js
let set = new Set([{}, {}, [], []]);
set; // Set(4) {{}, {}, [], []}
```

在给 Set 添加元素的过程中，不会发生类型转换，因此在 Set 中数字`1`和字符串`'1'`是完全不同的

```js
let set = new Set([1, "1"]);
set; // Set(2) {1, '1']}
```

利用 Set 中”不能存在两个相同的值“这个特性，我们可以巧妙地用来去除数组中重复的元素

```js
let arr = [1, 2, 3, 3, 4, 5];
let set = new Set(arr);
[...set]; // [1,2,3,4,5]
```

Set 实例中可以添加任何类型的数据结构

```js
let set = new Set([
  "string",
  10,
  true,
  null,
  undefined,
  [],
  {},
  Symbol(),
  function() {},
]);

set.size; // 9
```

## 属性

size 属性。可以返回 Set 实例内部元素的个数

```js
let arr = [1, 2, 3, 3, 4, 5];
let set = new Set(arr);
set.size; // 5
```

## 方法

1.add()

`add()`方法用于往 Set 实例中添加新的元素，并且返回 Set 实例本身，因此可以链式调用该方法

```js
let set = new Set();
set
  .add("string")
  .add(10)
  .add(true)
  .add(null)
  .add(undefined)
  .add({})
  .add([])
  .add(function() {})
  .add(Symbol());

set.size; // 9
```

使用 add 方法为 Set 实例添加元素，如果添加了前面已经存在的元素，同样只保留一个

```js
let set = new Set();
set
  .add("orange")
  .add("pear")
  .add("orange");

set.size; // 2
```

2.delete()

`delete()`方法用于删除 Set 实例中的元素，但是要注意，方法中的参数是元素的 `值`， 删除成功返回 true，失败返回 false

```js
let set = new Set(["orange", "pear"]);
set.delete("orange"); // true
set.size; // 1
```

删除失败是个什么意思呢？ 比如删除一个 Set 实例中并不存在的值，就会返回 false

```js
let set = new Set(["orange", "pear"]);
set.delete("vegetables"); // false
set.size; // 2
```

3.clear()

`clear()`方法用于一次性清空 Set 实例中的所有元素,方法执行后返回 undefined

```js
let set = new Set(["orange", "pear"]);
set.size; // 2
set.clear(); // undefined
set.size; // 0
```

4.has()

`has()`方法用于判断 Set 实例中是否包含某个值,如果包含返回 true， 不包含返回 false

```js
let set = new Set(["orange", "pear"]);
set.has("orange"); // true
set.has("vegetables"); // false
```

## 遍历

在上面去除数组中重复元素的例子中，我对 Set 数据类型使用了扩展运算符，说明 Set 数据类型本身也部署了`[Symbol.iterator]`接口，那么同样的也可以使用`for...of...`循环

```js
let set = new Set(["orange", "pear"]);
for (let item of set) {
  console.log(item);
}
// "orange"
// "pear"
```

### keys()、values()、entries()方法

首先，和Array 的`keys()、values()、entries()`方法一样，Set 实例的这三个方法同样返回一个遍历器对象

由于 Set 实例没有键名，或者说它的键名和键值是相同的，所以`keys()`和`values()`方法返回内容 `遍历输出** 后看起来都是一样的，都是元素的 value 值,而`entries()`返回的内容 **遍历输出` 后，key 和 value 也是一样的。

```js
let set = new Set(["orange", "pear"]);
[...set.keys()]; // ["orange", "pear"]
[...set.values()]; // ["orange", "pear"]
[...set.entries()]; // [["orange", "orange"] ,["pear", "pear"]]
```

### forEach()

Set 实例，同样可以使用 forEach 来循环遍历内部的元素

```js
let set = new Set(["orange", "pear"]);
set.forEach(x => {
  console.log(x);
});
// orange
// pear
```

## 如何简单快速把 Set 实例转为真正的数组

上面已经与一个案例中使用了扩展运算符来把 Set 实例转成真正的数组了

```js
let set = new Set(["orange", "pear"]);
let arr = [...set];
arr; // ["orange", "pear"]
```

除了扩展运算符，还可以使用 ES6 中`Array.from()`方法：

```js
let set = new Set(["orange", "pear"]);
let arr = Array.from(set);
arr; // ["orange", "pear"]
```

## 应用

利用”Set 实例转换成真正数组“的性质可以完成更多的功能：

1.使用数组的 map 方法

```js
let set = new Set(["orange", "pear"]);
let arr = [...set].map(x => "fruit: " + x);
let newSet = new Set(arr);

newSet; // Set(2) {"fruit: orange", "fruit: pear"}
```

2.使用数组的 filter 方法

```js
let set = new Set(["orange", "pear"]);
let arr = [...set].filter(x => x === "pear");
let newSet = new Set(arr);

newSet; // Set(1) {"pear"}
```

其他数组的方法这里不再一一举例

## WeakSet

WeakSet 与 Set 类似，也是 ES6 新增的数据结构,新建一个 WeakSet 实例的方法也是通过`new`命令

```js
let weakSet1 = new WeakSet();
let weakSet2 = new WeakSet([]);
```

### WeakSet 实例与 Set 实例不同之处在于以下两点：

1.WeakSet 的元素不允许添加 `原始类型数据`，以下类型都会抛出错误`TypeError: Invalid value used in weak set`

```js
let set = new WeakSet();
set.add("string");
set.add(1);
set.add(true);
set.add(null);
set.add(undefined);
set.add(Symbol());
```

也就是说只允许添加 `非原始数据类型`

```js
let set = new WeakSet();
set.add({});
set.add([]);
set.add(function() {});
set.add(new Set());
set.add(new Map());
// ...等等
```

2.WeakSet 中元素的引用类型是弱类型，垃圾回收机制不会考虑 WeakSet 中元素的引用

所有的浏览器内核总都有一种垃圾回事机制，在垃圾回收机制中有一种特殊的计算方法，叫做“引用计数”。

```js
var obj = { name: "zhangsan" }; // 引用次数: 0+1=1
var egg = obj; // 引用次数: 1+1=2

obj = null; //引用次数: 2-1=1
egg = null; //引用次数: 1-1=0
```

“引用计数”一般计算的是“一个值”的使用次数，如果一个 `值` 的引用次数不为 0，垃圾回收机制就不会释放这块内存。

上面例子中数据`{name: 'zhangsan'}`被引用了 2 次，如果在某个时刻手动把两个变量都重新赋值了比如赋值为 null，`{name: 'zhangsan'}`的引用次数就会归零，在垃圾回收机制运行的时候，这个值机会被从内存中清理掉，从而避免 `内存泄露`。

由于不知道 WeakSet 中的值会在什么时候就被垃圾回收机制清理掉，无法保证成员在遍历的时候是否仍然存在，导致了 WeakSet 实例没有`size`属性以及`clear(),keys(),values(),entries(),forEach()`方法

```js
let weakSet = new WeakSet();

weakSet.size; //undefined
weakSet.clear; //undefined
weakSet.keys; //undefined
weakSet.values; //undefined
weakSet.entries; //undefined
weakSet.forEach; //undefined
```

只能使用`add(),delete(),has()`方法，没有`clear()`方法

```js
let obj = {};
let arr = [];
let none = {};
let weakSet = new WeakSet();

weakSet.add(obj).add(arr);
weakSet; // WeakSet(2) {{}, []}

weakSet.has(obj); // true
weakSet.has(none); // false

weakSet.delete(obj); // true
weakSet.delete(none); // false
```
