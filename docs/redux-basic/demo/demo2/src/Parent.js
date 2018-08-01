import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Child from './Child';

export default class Parent extends Component {

  static contextTypes = {
    title: PropTypes.string,
  };
  handlerParent(){}
  render() {
    console.log(this);
    return (
      <div>
        Parent
        <Child />
      </div>
    );
  }
}
