import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import Parent from './Parent';

class App extends Component {
  static childContextTypes = {
    title: PropTypes.string,
  };
  getChildContext() {
    return {
      title: 'zhangsan',
    };
  }
  render() {
    console.log(this);
    return (
      <div className="App">
        <Parent />
      </div>
    );
  }
}

export default App;
