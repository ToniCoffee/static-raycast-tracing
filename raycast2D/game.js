import { degreesToRadians } from '../../utils/utils.js';
import { Keyboard } from '../../utils/keyboard.js';
import { Canvas, Context } from '../../utils/canvas.js';
import { Level } from '../../utils/level.js';
import { Ray } from '../../raycast2D/ray.js';
import { Entity } from '../../raycast2D/entity.js';

export class Game {
  #canvas   = null;
  #ctx      = null;
  #level    = null;
  #keyboard = null;
  #player   = null;
  #ray   = null;
  #rays  = [];

  constructor(level, canvasWidth, canvasHeight) {
    this.#canvas    = new Canvas(canvasWidth, canvasHeight);
    this.#ctx       = new Context(this.#canvas);
    this.#level     = new Level(this.#canvas, this.#ctx, level);
    this.#keyboard  = new Keyboard(this.#canvas.canvas);
    this.#player    = new Entity(this.#ctx, this.#level, 100, 100, 'dodgerblue');
    // this.#ray       = new Ray(this.#ctx, this.#level, this.#player.x, this.#player.y, this.#player.angle, 'orange');

    let numberOfRays = 500;
    let angleIncrement = degreesToRadians(this.#player.fov / numberOfRays);
    let initialAngle = degreesToRadians(30 - this.#player.fov);

    for(let i = 0; i < numberOfRays; i++) {
      this.#rays[i] = new Ray(this.#ctx, this.#level, this.#player.x, this.#player.y, initialAngle, angleIncrement, 'orange');
      initialAngle += angleIncrement;
    }

    // this.#rays[0] = new Ray(this.#ctx, this.#level, this.#player.x, this.#player.y, initialAngle, angleIncrement, 'orange');
    // this.#rays[1] = new Ray(this.#ctx, this.#level, this.#player.x, this.#player.y, this.#player.angle, angleIncrement, 'orange');
    // this.#rays[2] = new Ray(this.#ctx, this.#level, this.#player.x, this.#player.y, -initialAngle, angleIncrement, 'orange');
  }

  get canvasWidth()   { return this.#canvas.canvasWidth; }
  get canvasHeight()  { return this.#canvas.canvasHeight; }
  get levelWidth()    { return this.#level.levelWidth; }
  get levelHeight()   { return this.#level.levelHeight; }
  get tileWidth()     { return this.#level.tileWidth; }
  get tileHeight()    { return this.#level.tileHeight; }
  get key()           { return this.#keyboard.keyMap; }

  update() {
    this.#player.update(this.key);
    // this.#ray.update(this.#player);
    this.#rays.forEach(ray => ray.update(this.#player));
  }

  display() {
    // this.#level.display();
    this.#player.display();
    // this.#ray.display();
    // this.#rays.forEach(ray => ray.display());
  }

  render() {
    this.#level.render();
    this.#player.render();
    // this.#ray.render();
    this.#rays.forEach(ray => ray.render());
  }

  showInfo(text, x, y, color) { this.#canvas.showInfo(text, x, y, color); }

  run() {
    this.#ctx.clear();
    this.update();
    this.render();
    this.display();
    requestAnimationFrame(() => this.run());
  }
}