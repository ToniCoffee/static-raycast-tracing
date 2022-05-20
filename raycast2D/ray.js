import { normilizeAngle, distance } from '../../utils/utils.js';

export class Ray {
  #ctx = null;
  #level = null;
  #horizontalRayPosX = null;
  #horizontalRayPosY = null;
  #horizontalOrdinate = null;
  #horizontalAdyacent = null;
  #verticalRayPosX = null;
  #verticalRayPosY = null;
  #verticalOrdinate = null;
  #verticalAdyacent = null;
  #rayHTileX = null;
  #rayHTileY = null;
  #rayVTileX = null;
  #rayVTileY = null;
  #wallHitHorizontal = null;
  #wallHitVertical = null;
  #wallHit = null;

  constructor(context, level, x, y, angle, angleIncrement, color) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.angleIncrement = angleIncrement;
    this.#ctx = context;
    this.#level = level;
    this.color = color;
    this.#horizontalRayPosX = 0;
    this.#horizontalRayPosY = 0;
    this.#horizontalOrdinate = 0;
    this.#horizontalAdyacent = 0;
    this.#verticalRayPosX = 0;
    this.#verticalRayPosY = 0;
    this.#verticalOrdinate = 0;
    this.#verticalAdyacent = 0;
    this.#rayHTileX = 0;
    this.#rayHTileY = 0;
    this.#rayVTileX = 0;
    this.#rayVTileY = 0;
    this.#wallHitHorizontal = { x: 0, y: 0 };
    this.#wallHitVertical = { x: 0, y: 0 };
    this.#wallHit = { x: 0, y: 0 };
  }

  cast() {
    let cosine          = Math.cos(this.angle);
    let sine            = Math.sin(this.angle);
    let tan             = sine / cosine;

    // Cast Ray Collision With Tile Horizontal Side
    let tileIndexX  = Math.floor(this.x / this.#level.tileWidth);
    let tileIndexY  = Math.floor(this.y / this.#level.tileHeight);

    if(cosine > 0) tileIndexX++;
    if(sine > 0) tileIndexY++;

    this.#horizontalRayPosY   = tileIndexY * this.#level.tileHeight;
    // this.#horizontalOrdinate  = Math.abs(this.y - this.#horizontalRayPosY) * upDirection;
    this.#horizontalOrdinate  = this.y - this.#horizontalRayPosY;
    this.#horizontalAdyacent  = this.#horizontalOrdinate / -tan;
    this.#horizontalRayPosX   = this.x + this.#horizontalAdyacent;

    if(this.#horizontalRayPosX < 0) this.#horizontalRayPosX = 0;
    if(this.#horizontalRayPosX > 500) this.#horizontalRayPosX = 500;

    this.#wallHitHorizontal.x = this.#horizontalRayPosX;
    this.#wallHitHorizontal.y = this.#horizontalRayPosY;

    this.#verticalRayPosX   = tileIndexX * this.#level.tileWidth;
    // this.#verticalAdyacent  = Math.abs(this.x - this.#verticalRayPosX) * rightDirection;
    this.#verticalAdyacent  = this.x - this.#verticalRayPosX;
    this.#verticalOrdinate  = -tan * this.#verticalAdyacent;
    this.#verticalRayPosY   = this.y + this.#verticalOrdinate;

    if(this.#verticalRayPosY < 0) this.#verticalRayPosY = 0;
    if(this.#verticalRayPosY > 500) this.#verticalRayPosY = 500;

    this.#wallHitVertical.x = this.#verticalRayPosX;
    this.#wallHitVertical.y = this.#verticalRayPosY;

    this.#rayHTileX = Math.floor(this.#horizontalRayPosX / this.#level.tileWidth);
    this.#rayHTileY = Math.floor(this.#horizontalRayPosY / this.#level.tileHeight);

    this.#rayVTileX = Math.floor(this.#verticalRayPosX / this.#level.tileWidth);
    this.#rayVTileY = Math.floor(this.#verticalRayPosY / this.#level.tileHeight);

    if(cosine < 0) this.#rayVTileX--;
    if(sine < 0) this.#rayHTileY--;

    let hitHorizontal = false;

    if(this.#rayHTileX) {
      while(!hitHorizontal) {
        if(this.#rayHTileX > 9) this.#rayHTileX = 9;
        if(this.#rayHTileX < 0) this.#rayHTileX = 0;
        if(this.#rayHTileY > 9) this.#rayHTileY = 9;
        if(this.#rayHTileY < 0) this.#rayHTileY = 0;

        if(!this.#level.collision(this.#rayHTileX, this.#rayHTileY)) {
          if(sine > 0) tileIndexY++;
          else tileIndexY--;

          this.#horizontalRayPosY   = tileIndexY * this.#level.tileHeight;
          // this.#horizontalOrdinate  = Math.abs(this.y - this.#horizontalRayPosY) * upDirection;
          this.#horizontalOrdinate  = this.y - this.#horizontalRayPosY;
          this.#horizontalAdyacent  = this.#horizontalOrdinate / -tan;
          this.#horizontalRayPosX   = this.x + this.#horizontalAdyacent;

          if(this.#horizontalRayPosX < 0) this.#horizontalRayPosX = 0;
          if(this.#horizontalRayPosX > 500) this.#horizontalRayPosX = 500;

          this.#rayHTileX = Math.floor(this.#horizontalRayPosX / this.#level.tileWidth);
          this.#rayHTileY = Math.floor(this.#horizontalRayPosY / this.#level.tileHeight);

          if(sine < 0) this.#rayHTileY--;
        } else {
          this.#wallHitHorizontal.x = this.#horizontalRayPosX;
          this.#wallHitHorizontal.y = this.#horizontalRayPosY;
          hitHorizontal = true;
        }
      } 
    }

    let hitVertical = false;

    if(this.#rayVTileY) {
      while(!hitVertical) {
        if(this.#rayVTileX > 9) this.#rayVTileX = 9;
        if(this.#rayVTileX < 0) this.#rayVTileX = 0;
        if(this.#rayVTileY > 9) this.#rayVTileY = 9;
        if(this.#rayVTileY < 0) this.#rayVTileY = 0;

        if(!this.#level.collision(this.#rayVTileX, this.#rayVTileY)) {
          if(cosine > 0) tileIndexX++;
          else tileIndexX--;

          this.#verticalRayPosX   = tileIndexX * this.#level.tileWidth;
          // this.#verticalAdyacent  = Math.abs(this.x - this.#verticalRayPosX) * rightDirection;
          this.#verticalAdyacent  = this.x - this.#verticalRayPosX;
          this.#verticalOrdinate  = -tan * this.#verticalAdyacent;
          this.#verticalRayPosY   = this.y + this.#verticalOrdinate;

          if(this.#verticalRayPosY < 0) this.#verticalRayPosY = 0;
          if(this.#verticalRayPosY > 500) this.#verticalRayPosY = 500;

          this.#rayVTileX = Math.floor(this.#verticalRayPosX / this.#level.tileWidth);
          this.#rayVTileY = Math.floor(this.#verticalRayPosY / this.#level.tileHeight);

          if(cosine < 0) this.#rayVTileX--;
        } else {
          this.#wallHitVertical.x = this.#verticalRayPosX;
          this.#wallHitVertical.y = this.#verticalRayPosY;
          hitVertical = true;
        }
      }
    }

    let horizontalDistance = distance(this.x, this.y, this.#horizontalRayPosX, this.#horizontalRayPosY);
    let verticalDistance = distance(this.x, this.y, this.#verticalRayPosX, this.#verticalRayPosY);

    if(horizontalDistance < verticalDistance) {
      this.#wallHit.x = this.#horizontalRayPosX;
      this.#wallHit.y = this.#horizontalRayPosY;
    } else {
      this.#wallHit.x = this.#verticalRayPosX;
      this.#wallHit.y = this.#verticalRayPosY;
    }
  }

  update(obj) {
    this.x = obj.x;
    this.y = obj.y;
    this.angle += obj.turnSpeed * obj.turn;
    this.angle = normilizeAngle(this.angle);
    this.cast();
  }

  displayRay(newX, newY) { this.#ctx.line(this.x, this.y, newX, newY, this.color); }

  displayRayCollisionWithTileHorizontal() {
    this.#ctx.fillCircle(this.#horizontalRayPosX, this.#horizontalRayPosY, 3, 'red');
    this.#ctx.line(this.#horizontalRayPosX, this.y, this.#horizontalRayPosX, this.#horizontalRayPosY, 'red');
    this.#ctx.line(this.x, this.y, this.#horizontalRayPosX, this.y, 'red');
  }

  displayRayCollisionWithTileVertical() {
    this.#ctx.fillCircle(this.#verticalRayPosX, this.#verticalRayPosY, 3, 'green');
    this.#ctx.line(this.x, this.y, this.#verticalRayPosX, this.y, 'green');
    this.#ctx.line(this.#verticalRayPosX, this.y, this.#verticalRayPosX, this.#verticalRayPosY, 'green');
  }

  showInfo() {
    // this.#ctx.fillText('rayHTileX: ', this.#rayHTileX, 300, 240, 'yellow', 'white');
    // this.#ctx.fillText('rayHTileY: ', this.#rayHTileY, 300, 260, 'yellow', 'white');
    // this.#ctx.fillText('rayVTileX: ', this.#rayVTileX, 300, 280, 'yellow', 'white');
    // this.#ctx.fillText('rayVTileY: ', this.#rayVTileY, 300, 300, 'yellow', 'white');
    // this.#ctx.fillText('wallHitHX: ', this.#wallHitHorizontal.x, 300, 320, 'yellow', 'white');
    // this.#ctx.fillText('wallHitHY: ', this.#wallHitHorizontal.y, 300, 340, 'yellow', 'white');
    // this.#ctx.fillText('wallHitVX: ', this.#wallHitVertical.x, 300, 360, 'yellow', 'white');
    // this.#ctx.fillText('wallHitVY: ', this.#wallHitVertical.y, 300, 380, 'yellow', 'white');
    // this.#ctx.fillText('angle: ', this.angle, 300, 400, 'yellow', 'white');
    // this.#ctx.fillCircle(this.#wallHit.x, this.#wallHit.y, 3, 'pink');
  }

  display() {
    // this.displayRay(this.#wallHit.x, this.#wallHit.y);
    // this.displayRayCollisionWithTileHorizontal();
    // this.displayRayCollisionWithTileVertical();
    // this.showInfo();
  }

  render() {
    this.displayRay(this.#wallHit.x, this.#wallHit.y);
  }
}