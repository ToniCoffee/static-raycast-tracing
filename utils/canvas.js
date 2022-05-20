import { canvasReScale } from '../../utils/utils.js';

export class Canvas {
  #canvas = null;
  #ctx    = null;

  constructor(canvasWidth, canvasHeight) {
    this.#canvas          = document.getElementById('canvas');
    this.#ctx             = this.#canvas.getContext('2d');
    this.canvasWidth      = canvasWidth;
    this.canvasHeight     = canvasHeight;
    this.#canvas.width    = this.canvasWidth;
    this.#canvas.height   = this.canvasHeight;
    
    canvasReScale(this.#canvas);
  }

  get canvas()  { return this.#canvas; }
  get width()   { return this.canvasWidth; }
  get height()  { return this.canvasHeight; }
  getContext()  { return this.#ctx; }
}

export class Context {
  #canvas = null;
  #ctx    = null;
  
  constructor(canvas) {
    this.#canvas  = canvas;
    this.#ctx     = this.#canvas.getContext('2d');
  }

  get context()  { return this.#ctx; }

  clear() { this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height); }

  fillRect(x, y, width, height, color) {
    this.#ctx.beginPath();
    this.#ctx.fillStyle = color;
    this.#ctx.fillRect(x, y, width, height);
    this.#ctx.fill();
    this.#ctx.fillStyle = '#000000';
    this.#ctx.closePath();
  }

  strokeRect(x, y, width, height, color) {
    this.#ctx.beginPath();
    this.#ctx.strokeStyle = color;
    this.#ctx.strokeRect(x, y, width, height);
    this.#ctx.fill();
    this.#ctx.strokeStyle = '#000000';
    this.#ctx.closePath();
  }

  line(x1, y1, x2, y2, color) {
    this.#ctx.beginPath();
    this.#ctx.strokeStyle = color;
    this.#ctx.moveTo(x1, y1);
    this.#ctx.lineTo(x2, y2);
    this.#ctx.stroke();
    this.#ctx.strokeStyle = '#000000';
    this.#ctx.closePath();
  }

  fillText(text, value, x, y, textColor, valueColor) {
    this.#ctx.beginPath();
    if(value || value === 0) {
      this.#ctx.fillStyle = textColor;
      this.#ctx.fillText(`${text}`, x, y);
      this.#ctx.fillStyle = valueColor;
      this.#ctx.fillText(`${value}`, x + text.length * 5, y);
    } else {
      this.#ctx.fillStyle = textColor;
      this.#ctx.fillText(text, x, y);
    }
    this.#ctx.fillStyle   = '#000000';
    this.#ctx.closePath();
  }

  strokeCircle(x, y, radius, color) {
    this.#ctx.beginPath();
    this.#ctx.strokeStyle = color;
    this.#ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.#ctx.stroke();
    this.#ctx.strokeStyle = '#000000';
    this.#ctx.closePath();
  }

  fillCircle(x, y, radius, color) {
    this.#ctx.beginPath();
    this.#ctx.fillStyle = color;
    this.#ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.#ctx.fill();
    this.#ctx.fillStyle = '#000000';
    this.#ctx.closePath();
  }
}