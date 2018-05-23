import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'antd-mobile';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Button>按钮</Button>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('root'));
