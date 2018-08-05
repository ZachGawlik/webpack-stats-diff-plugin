import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';

import(/* webpackChunkName: "page2" */ './AnotherAsyncComponent').then(
  doNothing => {
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
    console.log('eeee');
  },
);

function component() {
  var element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'zach'], ' ');
  return element;
}

document.body.appendChild(component());
