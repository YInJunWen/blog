# es6-module ES6 中的 module

## module 的使用条件

> ES6 中的 module 如果用在浏览器中，需要先使用 babel 编译，因为浏览器环境可能没有部署对于 module 相关的语句和方法,本文所有代码都在 babel-node 中执行

## 安装以及使用 babel-node

```
npm i babel-cli babel-cli---save
npm i babel-cli babel-preset-env ---save
```

babel-cli 包里面内置了 babel-node 命令，添加 babel-node 的配置文件： .babelrc

```js
{
  presets: ["env"];
}
```

并在 package.json 做如下配置

```js
{
    "script":{
        "start" :"npx babel-node 文件名"
    }
}
```

> 注意配置文件中使用的 npx 命令，他会按照以下方式查找项目内的 npm 包，

- 在项目内查找是否安装对应的 npm 包
- 在全局的 node_modules 中查找是否安装对应的 npm 包
- 如果都找不到，则会临时在项目中安装 npm 包，自动执行后，删除安装包

> 本文中的案例代码，下载后直接通过`npm install`安装 npm 包后。通过`npm run 文件名`来执行对应的脚本

## 为什么要有 module

最初的 JS 只是作为运行在浏览器中的脚本存在，所有的代码都在一个文件中，也没有模块的概念。在 NodeJS 出现之后，出现了 CommonJS 规范，用来补充没有模块化开发这一部分的缺陷。在 NodeJS 中可以把代码写在多个文件中，在需要用的时候，通过引入模块来使用模块内部的方法或属性。

CommonJs 设计之初是为了在 Server 端运行的，因为 Server 端只需要在本地内存上读取文件就可以，速度很快，不会影响后续代码的执行。

但在浏览器上不能这么执行，因为浏览器加载文件的速度取决于很多因素，比如网速等。因此，又出现了 AMD 规范，主要用于客户端的运行。

ES6 的 module 在 CommonJS 规范的基础上，又做了优化.

不管是 CommonJS 还是 AMD 规范实现的模块，都是在运行的时候，才能确定模块之间的依赖关系，

而 ES6 中的 module 则在编译的过程中，就可以确定需要引入哪些模块。

## export

export 关键字主要用于创建模块的时候，对外暴露对象，函数或者原始值，便于其他模块使用 import 导入。这些暴露出去的都可以被称为“接口”。

```js
export const name = "fruit";
export const fruitCount = {
  pear: 1,
  orange: 2,
};
export function add() {}
```

上面的代码中就可以通过 export 暴露了一个值为字符串的常量，一个值为对象的常量以及一个函数。

如果要 export 一个变量，export 后不能直接跟随一个"值"，或者跟随一个函数/类的名称
export 不能直接跟随一个 `值` ，只能跟随一下两种类型

1.  export 后跟一个声明语句
2.  export 后跟一个对象

以下 export 的方式都是错误的

```js
export "zhangsan"; // 错误

const name = "zhangsan";
export name; // 错误

class Egg{}
export Egg;

const add = function(){}
export add; // 错误
```

正确的应该这么写：

```js
export const name = "zhangsan";
export function(){}; // 正确

const name = "zhangsan";
export {name} // 正确

class Egg{}
export {Egg};// 正确

const add = function(){}
export {add}; // 正确
```

通常我们会把 export 放在模块的最后面，便于一眼看出模块暴露了那些属性/方法。

```js
export const name = "zhangsan";

const name = "zhangsan";

class Egg{}

const add = function(){}
export {name, Egg, add}; // 正确
```

## export 必须位于顶级作用域

ES6 中的模块，初衷是为了静态编译，所以 export 必须处于代码的顶层位置，任何处于 `块级作用域** 的 export 语句都是 **不被允许` 的，比如

```js
if(true){
    export const name="zhangsan"
}

function add(){
    export const name="zhjangsan"
}
add()
```

## 设置默认的接口

很多人在开发的时候，不太喜欢去看一个模块的文档，不喜欢去了解一下模块中都有哪些接口，ES6 提供了一种设置一个默认接口的模式

```js
export default function add() {}
```

上面代码中就是默认暴露出去的接口，再使用 import 导入的时候，如果没有指定导入其他的接口，会自动导入模块中定义的默认接口。 每个模块中 `只允许设置一个` 默认的接口。

## 接口重命名

在暴露接口的过程中，也可以对要暴露的对象重命名，使用`as`关键字：

```js
function add() {}
function foo() {}
export { add as Add, foo as Foo };
```

甚至可以把同一个对象暴露到两个接口中:

```js
functiona add(){}
export {
    add as Add1,
    add as Add2
}
```

## import

import 语句被用来导入其他模块中的属性/方法，主要有以下几种方式

假设我们已有一个模块`_contant.js`

```js
export default function remove() {
  console.log("print in export default fn.remove");
}
function insert() {
  console.log("print in fn.insert");
}
const fruit = {
  name: "pear",
};
function update() {
  console.log("print in fn.update");
}
const fruits = ["orange", "pear", "juice"];
export { insert, update, fruit, fruits };
```

## 只导入默认接口

只引入默认的属性/方法，引入时的名称 `可以不` 与模块中的默认接口名称相同,[完整案例代码](./demo/src/index1.js)：

```js
import Constant from "./_constant";
Constant(); // 'print in export default fn.remove'
```

## 导入全部接口

可以使用`*`引入所有的接口，在引入的时候需要使用`as`关键字把所有的接口放到一个指定的变量中去。使用的时候，可以按照以下方式：[完整案例代码](./demo/src/index2.js)

```js
import * as Cons from "./_constant";

Cons.insert(); // 'print in fn.insert'
Cons.update(); // 'print in fn.insert'
Cons.remove(); // Cons.remove is not a function
```

注意： 模块默认的接口,在导入的时候，会被统一修改为`default`。所以上面变量 Cons 中并没有名为`remove`的函数，只有一个名为`default`的函数

```js
import * as Cons from "./_constant";

Cons.default(); // 'print in export default fn.remove'
```

## 只导入部分接口

module 中可以使用`{}`导入模块内的接口，引入时的名称 `必须与` 模块中 export 的名称相同[完整案例代码](./demo/src/index3.js)

```js
import { insert, update } from "./_constant";

insert(); // 'print in fn.insert'
update(); // 'print in fn.update'
```

import 在导入接口的术后，同样是使用 `as` 关键字重命名：[完整案例代码](./demo/src/index4.js)

```js
import { insert as insertData, update as updateDara } from "./_constant";

insertData(); // 'print in fn.insert'
updateDara(); // 'print in fn.update'
```

默认接口也可以使用`{default}`来获取到，只是由于 `default` 是 JavaScript 的保留字，需要使用 `as` 重新定义另一个名称[完整案例代码](./demo/src/index5.js):

```js
import { default as def, insert, update } from "./_constant";

insert(); // 'print in fn.insert'
update(); // 'print in fn.update'
def(); // 'print in export default fn.remove'
```

也可以把默认接口和其他接口分别导入进来：[完整案例代码](./demo/src/index6.js)

```js
import def, { insert } from "./_constant";

def(); // 'print in export default fn.remove'
insert(); // 'print in fn.insert'
```

## 修改接口的内容

export 暴露的接口，接口的值如果不是六种基本数据类型或者函数，就可以修改接口的值的内容[完整案例代码](./demo/src/index7.js)

```js
import { fruits, fruit, update } from "./_constant";

console.log(fruit.name); // "pear"
fruit.name = "orange";
console.log(fruit.name); // "orange"

// fruit = { name: 'juice' }; // SyntaxError: "fruit" is read-only

console.log(fruits);

fruits[0] = "apple";
console.log(fruits);
```

## 使用 import 导入并直接执行一个模块

import 也可以用来导入并直接执行一个模块，方法就是 import 后直接跟随一个文件地址，可以是绝对路径也可以是相对路径[完整案例代码](./demo/src/index8.js)

```js
// export.js
console.log(`print in function.js; it will execute after 'import' syntax `);

// import.js
import "export.js"; // "print in function.js; it will execute after 'import' syntax"
```

## 动态导入模块

与 export 一样，import 也不允许动态引入，因为这违背了 ES6 中 module 的初衷,所有在块级作用域中的 import 都是不被允许的

```js
if (true) {
  import { fruit } from "constant.js"; // 不被允许的
}
function get() {
  import { fruit } from "constant.js"; // 不被允许的
}
```

更不允许在 import 中使用表达式

```js
const name = "dele" + "te"; // "update"
import name from "constant.js"; // 不被允许的
```

在最新的提案中，有人提出了新曾一个`import()`方法来动态导入模块，并且返回一个 promise 对象,模块会作为一个对象，当做 then 方法的参数

> 这个特性需要安装`"syntax-dynamic-import","dynamic-import-node"`两个 babel 的插件才能在 babel-node 中使用.[完整案例代码](./demo/src/index9.js)

```js
if (true) {
  import("constant.js").then(res => {
    console.log(res); // 这里的res 包含了模块中所有的接口(包括默认接口)
  });
}
/*
{
    default: Function(){},
    insert: Function(){},
    update: Function(){},
    remove: Function(){},
    fruit: {name: 'pear'}
}
*/
```

在上面的代码中，默认传入的参数 res 是一个对象， 内含模块中 `所有的接口(包括默认接口)`，模块的默认接口被赋值给名为“default”的属性。

可以使用解构赋值的方式获取到所有的接口[完整案例代码](./demo/src/index10.js)

```js
if (true) {
  import("./_constant.js").then(({ insert, update }) => {
    insert(); // "print in fn.insert"
    update(); // "print in fn.update"
  });
}
```

在获取默认接口的时候，同样需要把 default 接口重新命名[完整案例代码](./demo/src/index11.js)：

```js
if (true) {
  import("./_constant.js").then(
    ({ default: removeData, insert: insertData, update: updateData }) => {
      removeData(); // "print in export default fn.remove"
      insertData(); // "print in fn.insert"
      updateData(); // "print in fn.update"
    },
  );
}
```

如果需要按需引入多个文件可以使用`Promise.all()`来实现

```js
if (true) {
    Promise.all([
        import 'a.js',
        import 'b.js',
        import 'c.js',
    ]).then(([moduleA, moduleB, moduleC])=>{
        // ..code
    })
}
```

和在顶层代码的 import 不同，按需引入 import 方法的参数支持表达式、函数返回值等方式,这里不再举例。

```js
const name = "./a.js";
import(name).then(module => {
  // ...code
});
```

## 混合使用 export 和 import

export 是可以继承的，便于将代码分化到更小的模块中[完整案例代码](./demo/src/index12.js)

`base1.js`:

```js
export function insert() {
  console.log("print in base1.insert");
}
```

`base1.js`:

```js
export function remove() {
  console.log("print in base1.remove");
}
```

`base.js`:

```js
export * from './base1';
export * from './base2';

// 等同于：
import * as Base1 from './base1'
import * as Base2 from './base2'

export {
    ...Base1,
    ...Base2
}
```

`index.js`

```js
import * as Base from "./base";
console.log(Base); // { insert: [Getter], remove: [Getter] }
Base.insert(); // print in base1.insert
```

## 与 CommonJS 的不同之处

ES6 的 module 与 CommonJS 最大的不同之处在于。CommonJS 导入模块的时候，使用的是模块的一个 `副本** ，而 ES6 用的是模块的一个 **引用` ，也就是说无论在哪个文件中引入一个模块，他们都共享了这个模块中的数据[完整案例代码](./demo/src/quote1.js)。

`quote3.js`

```js
var obj = {
  name: "pear",
};
export { obj };
```

`quote2.js`

```js
import { obj } from "./quote3";

function editName() {
  obj.name = "orange";
}
export { editName };
```

`quote1.js`

```js
import { editName } from "./quote2";
import { obj } from "./quote3";

console.log(obj); // { name: 'pear' }
editName();
console.log(obj); // { name: 'orange' }
```

在上面的案例中,quote2 模块中修改了 `quote3` 中 `obj` 的 `name` 属性，导致 `quote1` 中输出的结果也发生了变化。

利用这个特性，我们可以在日常开发中，可以把全局的变量专门放到一个模块中，便于在所有引用了该模块的代码中共享它的所有接口，这里就不再详细举例了
