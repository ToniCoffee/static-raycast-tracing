import { imgRaw } from '../raycasting/js/rawImageData.js';
import { coinSprite } from '../raycasting/js/rawSprite.js';
import { degreesToRadians, createBitMap, renderSprites } from '../utils/utils.js';
import { Keyboard } from '../utils/keyboard.js';
import { Canvas, Context } from '../utils/canvas.js';
import { Level } from '../utils/level.js';
import { Ray } from './ray.js';
import { Sprite } from './sprite.js';
import { Entity } from './entity.js';

export class Game {
  #canvas   = null;
  #ctx      = null;
  #level    = null;
  #keyboard = null;
  #player   = null;
  // #ray   = null;
  #rays  = [];
	#zBuffer = [];
	#bitMap = null;
	#sprites = [];

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
      this.#rays[i] = new Ray(this.#ctx, this.#level, this.#player.x, this.#player.y, initialAngle, angleIncrement, i, 'orange');
      initialAngle += angleIncrement;
    }

    // this.#rays[0] = new Ray(this.#ctx, this.#level, this.#player.x, this.#player.y, initialAngle, angleIncrement, 'orange');
    // this.#rays[1] = new Ray(this.#ctx, this.#level, this.#player.x, this.#player.y, this.#player.angle, angleIncrement, 'orange');
    // this.#rays[2] = new Ray(this.#ctx, this.#level, this.#player.x, this.#player.y, -initialAngle, angleIncrement, 'orange');

    /* image = this.#ctx.context.createImageData(50,50); // only do this once per page

    try {
      for(let i = 0; i < 50; i++) {
        for(let j = 0; j < 50; j++) {
          // d[i * 50 * 4 + j * 4]      = 255 // r;
          // d[i * 50 * 4 + j * 4 + 1]  = 0   // g;
          // d[i * 50 * 4 + j * 4 + 2]  = 0   // b;
          // d[i * 50 * 4 + j * 4 + 3]  = 255 // a;

          image.data[i * 50 * 4 + j * 4]      = imgRaw[i * 50 * 4 + j * 4]
          image.data[i * 50 * 4 + j * 4 + 1]  = imgRaw[i * 50 * 4 + j * 4 + 1]
          image.data[i * 50 * 4 + j * 4 + 2]  = imgRaw[i * 50 * 4 + j * 4 + 2]
          image.data[i * 50 * 4 + j * 4 + 3]  = imgRaw[i * 50 * 4 + j * 4 + 3]
        }
      }

      bitMap = createImageBitmap(image, 0, 0, 50, 50);
    } catch(e) {
      console.log(e.message);
    } */

    this.#bitMap = createBitMap(this.#ctx.context, imgRaw, 50, 50);
    let coin = createBitMap(this.#ctx.context, coinSprite, 50, 50);

    this.#sprites[0] = new Sprite(this.#ctx, 300, 125, coin); 
    // sprites[1] = new Sprite(this.#ctx, 300, 225, null);
    // sprites[2] = new Sprite(this.#ctx, 300, 325, null);
    // sprites[3] = new Sprite(this.#ctx, 300, 425, null);
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
    this.#rays.forEach(ray => ray.update(this.#player, this.#zBuffer));
    this.#sprites[0].update(this.#player);
    // sprites[1].update(this.#player);
    // sprites[2].update(this.#player);
    // sprites[3].update(this.#player);
  }

  display() {
    // this.#level.display();
    this.#player.display();
    // this.#ray.display();
    // this.#rays.forEach(ray => ray.display());
  }

  render() {
    // this.#level.render();
    this.#player.render();
    // this.#ray.render();

    // Render Floor And Sky
    this.#ctx.fillRect(0, 250, 500, 500, '#723d00');
    this.#ctx.fillRect(0, 0, 500, 250, '#1976b4');

    this.#rays.forEach(ray => {
      // ray.render();
      ray.renderLevel(this.#bitMap);
    });

    this.#sprites[0].render(this.#player, this.#zBuffer);
    renderSprites(this.#sprites);
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