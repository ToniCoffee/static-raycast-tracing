const wrapper = document.getElementById('wrapper');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function getStyle(e, prop) {
  return parseFloat(getComputedStyle(e).getPropertyValue(prop))
}

canvas.width = wrapper.clientWidth - getStyle(wrapper, 'padding-left') * 2;
canvas.height = wrapper.clientHeight - 100;