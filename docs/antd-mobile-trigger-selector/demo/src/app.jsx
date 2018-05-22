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
