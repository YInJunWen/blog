import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Parent extends Component {

  static contextTypes = {
    title: PropTypes.string,
  };
  handlerChild(){}
  render() {
    console.log(this);
    return <div>Child</div>;
  }
}
