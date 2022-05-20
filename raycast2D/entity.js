import { normilizeAngle } from '../../utils/utils.js';

export class Entity {
  #ctx    = null;
  #level  = null;

  constructor(context, level, x, y, color) {
    this.#ctx       = context;
    this.#level     = level
    this.x          = x;
    this.y          = y;
    this.angle      = 0;
    this.moveSpeed  = 3;
    this.turnSpeed  = (Math.PI / 180) * 3;
    this.forward    = 0;
    this.turn       = 0;
    this.color      = color;
    this.fov        = 60;
  }

  collision(x, y) {
    let tileX = Math.floor(x / this.#level.tileWidth);
    let tileY = Math.floor(y / this.#level.tileHeight);
    return this.#level.collision(tileX, tileY);
  }

  update(key) {
    let cosine = Math.cos(this.angle);
    let sine = Math.sin(this.angle);
    // let tan = sine / cosine;
    
    if(key.KeyD) this.turn = 1;
    if(key.KeyA) this.turn = -1;
    if(key.KeyS) this.forward = -1;
    if(key.KeyW) this.forward = 1;
    if(!key.KeyD && !key.KeyA) this.turn = 0;
    if(!key.KeyS && !key.KeyW) this.forward = 0;

    this.angle += this.turnSpeed * this.turn;
    this.angle = normilizeAngle(this.angle);

    let newX = this.x + cosine * this.moveSpeed * this.forward;
    let newY = this.y + sine * this.moveSpeed * this.forward;

    if(!this.collision(newX, newY)) {
      this.x = newX;
      this.y = newY;
    } /* else {
      this.x -= 3;
      this.y -= 3;
    } */
  }

  showInfo(cosine, sine, tan, h, angle, x, y, tilePosX, tilePosY) {
    this.#ctx.fillText('Cosine: ', cosine, 300, 60, 'yellow', 'white');
    this.#ctx.fillText('Sine: ', sine, 300, 80, 'yellow', 'white');
    this.#ctx.fillText('Tan: ', tan, 300, 100, 'yellow', 'white');
    this.#ctx.fillText('H: ', h, 300, 120, 'yellow', 'white');
    this.#ctx.fillText('Angle: ', angle, 300, 140, 'yellow', 'white');
    this.#ctx.fillText('posX: ', x, 300, 160, 'yellow', 'white');
    this.#ctx.fillText('posY: ', y, 300, 180, 'yellow', 'white');
    this.#ctx.fillText('tilePosX: ', tilePosX, 300, 200, 'yellow', 'white');
    this.#ctx.fillText('tilePosY: ', tilePosY, 300, 220, 'yellow', 'white');
  }

  display() {
    let factor = 50;
    let cosine = Math.cos(this.angle);
    let sine = Math.sin(this.angle);
    let tan = sine / cosine;
    let h = Math.round(Math.sqrt(cosine**2 + sine**2));

    let newX = this.x + cosine * factor;
    let newY = this.y + sine * factor;

    this.#ctx.line(this.x, this.y, newX, this.y, 'red');
    this.#ctx.line(newX, this.y, newX, newY, 'green');
    this.#ctx.line(this.x, this.y, newX * h, newY * h, 'blue');

    let tilePosX = Math.floor(this.x / this.#level.tileWidth);
    let tilePosY = Math.floor(this.y / this.#level.tileHeight);

    // this.showInfo(
    //   cosine, sine, tan, h, this.angle, 
    //   this.x, this.y, tilePosX, tilePosY
    // );
  }

  render() {
    this.#ctx.fillRect(this.x - 3, this.y - 3, 6, 6, this.color);
  }
}