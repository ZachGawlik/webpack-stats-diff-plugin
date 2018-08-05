import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import './hero2.jpg';

import(/* webpackChunkName: "form" */ './AsyncComponent').then(doNothing => {
  console.log('done');
});

function component() {
  var element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
