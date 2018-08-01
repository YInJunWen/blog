<!-- Date: 2017-08-24 08:42:55 -->

# antd-mobile 通过其他组件触发 Picker 组件的弹窗

antd-mobile 组件库，有一个 Picker 组件，在点击组件的时候，会显示一个多选选择弹窗，在一个工作需求中，PD 希望点击页面右上角的导航键，来显示弹窗， 然而 Picker 组件并没有提供一个明显的接口事件，因此我们使用了“釜底抽薪”办法来实现

`Picker` 组件里，正常情况下都会包含一个 `List.Item` 组件，通执行这个组件上的 onClick，达到触发 Picker 弹窗的目的

[源码](./demo/)

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Button, List, Picker } from 'antd-mobile';

const data = [
  {
    label: '2013',
    value: '2013',
  },
  {
    label: '2014',
    value: '2014',
  },
];
class App extends Component {
  constructor(props) {
    super(props);
  }
  showPicker() {
    console.log(this.refs.pickerEle);
    this.refs.pickerEle.onClick();
  }
  render() {
    return (
      <div>
        <Button
          onClick={() => {
            this.showPicker();
          }}
        >
          点击按钮触发Picker
        </Button>
        <List>
          <Picker data={data}>
            <List.Item ref="pickerEle">test</List.Item>
          </Picker>
        </List>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('root'));
```
