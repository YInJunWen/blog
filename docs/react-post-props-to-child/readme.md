# react 批量传递参数给子组件

如果需要把组件 props 或者 state 全部传递给子组件，可以使用 es6 种的扩展运算符，即：{...this.props}

```js
class A extends React.Component{
 constructor(){
  super();
  this.state = {
   name: 'zhangsan',
   age: 30
  }
 }
 render(){
  return (
   <B {...this.state}/>
  )
 }
}
class B extends React.Component{
 render(){
  console.log(this.props) //这里就会看到通过父组件传递过来的参数
  return (
   ...
  )
 }
}
```
