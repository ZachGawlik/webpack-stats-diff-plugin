import _ from 'lodash';
import './styles.css';
import './hero1.jpg';
import './background.png';

function crazyMathFunction() {
  return 1 + 2 + 3;
}

function component() {
  var element = document.createElement('div');
  element.innerHTML = crazyMathFunction();
  return element;
}

document.body.appendChild(component());
