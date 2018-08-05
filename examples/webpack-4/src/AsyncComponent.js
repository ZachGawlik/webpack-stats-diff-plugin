import React from 'react';
import ReactDOM from 'react-dom';
import './thumbnail.jpg';
import './async-styles.css';

function component() {
  var element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
