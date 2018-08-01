<!-- Date: 2016-06-01 02:07:20 -->

# angular 初探

> angular2+版本与第一个版本有了很大的的差别，所用到的语法以及各种指令的声明方式都和老版本完全不同，这里记述一下基本的用法

## 新建组件

```js
import { Component } from '@angular/core';
@Component({
  selector: 'app-root', //  要扩展的元素
  template: '', //    html内容
})
export class AppComponent {} // 组件的方法以及属性
```

新建组件的时候不要忘记在`app.modules.ts`文件的`@ngModel.declarations`中声明，否则对应的元素会扩展失败

```js
import { AppComponent } from "./组件路径";
@ngModule({
    declarations: [AppComponent]
})
```

命名要求：

* 组件的文件名以`name.service.ts`或者`test-name.service.ts`为例，
* export 的组件名称使用大写驼峰命名

## 数据双向绑定

```js
<input [(ngModel)]="modelname">
```

数据双向绑定的时候，需要额外引入 angular 中的 FormsModule 组件,并在`app.modules.ts`文件的`@ngModel.imports`中声明

```js
import { FormsModule } from "@angular/core";
@ngModule({
    import: [FormsModule]
})
```

## 事件绑定

```js
<div (click) ="eventName()" ></div>
```

类名赋值

```html
<div [class.className] = "expression"></div>
```

例子:

```html
<div [class.show] = "true"></div>
```

例子中会为 div 添加一个名为"show"的 class

## 组件传值

组件传值的时候，不要忘记在子组件中先引入`Input`类

```html
<component [prop]="expression"></component>
```

```js
import { Component, Input } from '@anglar/core';
export class AppComonent {
  @Input() prop;
}
```

例子:

如果 prop 这是一个单词，用法如下

```html
<component [name]="expression"></component>
```

```js
import { Component, Input } from '@anglar/core';
export class AppComonent {
  @Input() name;
}
```

如果 prop 是复杂字符串，可以用如下方式获取

```html
<component [test-name]="expression"></component>
```

```js
import { Component, Input } from '@anglar/core';
export class AppComonent {
  @Input('test-name') name;
}
```

## 流程控制指令

if 指令:

```html
<div *ngIf="true"></div>
```

for 循环指令:

```html
<ul>
    <li *ngFor="let item in list">{{item}}</li>
</ul>
```

* 流程控制指令前面不要忘记添加`*`号
* 第二个单词首字母要大写

## 注册服务

注册全局的服务需要用到 angular 中的`Injectable`类

```js
import { Injectable } from '@angular/core';

@Injectable()
export class TestService {
  add() {}
}
```

* export 前面千万要记得使用 Injectable 装饰器
* Injectabe 装饰器是一个方法，不要忘记他后面的括号

注册的服务必须在`app.module.ts`文件的`@ngModule.providers`中注册，才能在组件中使用

```js
import { TestService } from "./test.service";

@ngModule({
    providers: [TestService]
})
```

命名要求：

* 服务的文件名以`name.service.ts`或者`test-name.service.ts`为例，
* export 的服务名称使用大写驼峰命名

在组件中，通常只需要在`构造器函数中`定义就可以使用

```js
import { TestService } from "./test.service";
export class AppComponent {
    constructor(private testServer:TestServer){

    }
}
```
