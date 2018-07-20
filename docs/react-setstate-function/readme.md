# react 注意的地方

## setState 的连续调用

多次使用 setState 方法更新 state 的时候，不能传入传统的对象参数，要使用`返回对象的函数`作为参数，

```js
increment(){
    this.setState({count: this.state.count+1})
    this.setState({count: this.state.count+1})
}
```

上面的案例中可以看出来，我们本来的目标是为了让 count 的最终结果为 2，但实际上代码的执行结果是 1，这是因为 `react` 会将多个连续 `this.setState` 产生的修改放在一个队列中，攒在一起，差不多的时候再引发一次更新过程，具体的可以参考[进击的 React](https://zhuanlan.zhihu.com/p/25954470)

那么该如何实现我们的目标呢，`react` 中有一个巨大的彩蛋，那就是 `setState` 可以传递一个函数作为参数，这个函数可以返回一个我们想要的 `state` 对象，函数接受两个参数，分别是上一次更新之后的 `state` 状态，和 `props` 模型，上面的例子我们就可以写成

```js
increment(){
    this.setState((state,prop) => {
        return {
            count: state.count+1
        }
    })
    this.setState((state,prop) => {
        return {
            count: state.count+1
        }
    })
}
```

表面看起来和直接传递一个对象的方法没什么区别，实际上，当传递一个函数进去的时候，会`主动触发`一次 state 更新过程，这个方式和我们经常通过 `DOM.offsetLeft` 方法强制浏览器进行 `reflow+repain` 是一个道理,具体可以参考[setState 事件](https://doc.react-china.org/docs/react-component.html#setstate)

## setState 在什么时候同步更新 state

前面说过 setState 是一个异步方法，如果连续调用的话会把结果积攒起来，在某一个时间点统一执行一次更新，那么 setState 能不能同步跟你新年 state 呢？也就是说让 setState 执行的时候，直接触发一次 state 更新。答案是可以的。有两种特殊情况会触发同步更新:`setTimeout`和`addEventListener`

```js
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  clickEvent() {
    this.setState({
      count: this.state.count + 1
    });
    console.log(this.state);
  }
  clickEventLater() {
    setTimeout(() => {
      this.clickEvent();
    });
  }
  componentDidMount() {
    document.querySelector("#test").addEventListener("click", () => {
      this.clickEvent();
    });
  }
  render() {
    console.log("render");
    return (
      <div className="App">
        {this.state.count}
        <button onClick={this.clickEvent.bind(this)}>increment</button>
        <button id="test"> addevent</button>
        <button onClick={this.clickEventLater.bind(this)}> later</button>
      </div>
    );
  }
}
```

这个案例中,浏览器控制台的输出结果如下

```
// 页面初始化的render事件
render          App.js:17

// 点击第一个按钮
{count: 0}      App.js:30
render          App.js:30

// 点击第二个按钮
render          App.js:17
{count: 2}      App.js:30

// 点击第三个按钮
render          App.js:17
{count: 3}      App.js:30
```

在控制台的输出内容中，可以看出，addEventListener 和 setTimeout 中执行的 setState 方法，先执行了 render 方法，后输出了 state 内容，虽然在页面的 UI 结果和我们预期的一样，但这两种强制同步更新 state 的方式，会增大 react 的性能开销

## 事件处理中的 this

react 在处理事件的时候，类中定义的方法不会主动绑定 this，因此在绑定事件的时候一定要处理好这里的 this，这里有四种方法，但是为了方便传递 event 和其他参数，推荐使用`方法二** 和 **方法四`：

`方法一`

```js
class App extends Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }
  clickHandler() {
    console.log("click event");
  }
  render() {
    return <button onClick={this.clickHandler} />;
  }
}
```

`方法二`

```js
class App extends Component {
  constructor(props) {
    super(props);
  }
  clickHandler() {
    console.log("click event");
  }
  render() {
    return <button onClick={this.clickHandler.bind(this)} />;
  }
}
```

`方法三`

```js
class App extends Component {
  constructor(props) {
    super(props);
  }
  clickHandle = () => {
    console.log("click event");
  };
  render() {
    return <button onClick={this.clickHandler} />;
  }
}
```

`方法四`

```js
class App extends Component {
  constructor(props) {
    super(props);
  }
  clickHandle() {
    console.log("click event");
  }
  render() {
    return <button onClick={() => this.clickHandler()} />;
  }
}
```

## 事件处理中的 event

react 事件处理中的 event 属性遵循两个原则

* 通过 bind 绑定的方法，event 在所有的参数之后获取
* 通过箭头函数绑定的方法，event 可以自行设置

`通过bind绑定this`

```js
class App extends Component {
  constructor(props) {
    super(props);
  }
  clickHandler(arg1, arg2, event) {
    console.log(arg1, arg2, event);
  }
  render() {
    return <button onClick={this.clickHandler.bind(this, 1, 2)} />;
  }
}
```

`通过箭头函数绑定this`

```js
class App extends Component {
  constructor(props) {
    super(props);
  }
  clickHandle(event, arg1, arg2) {
    console.log(arg1, arg2, event);
  }
  render() {
    return <button onClick={e => this.clickHandler(e, 1, 2)} />;
  }
}
```

在 JSX 中使用三元表达式和
