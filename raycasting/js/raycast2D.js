let canvas = null;
let ctx = null;
let level = null;
let player = null;
const FPS = 50; 
const canvasWidth = 500;
const canvasHeight = 500;
const levelMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
const wallColor = '#000000';
const floorColor = '#666666';
const playerColor = '#FFFFFF';

function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }
function normalizeAngle(angle) {
  angle = angle % (Math.PI * 2);
  if(angle < 0) angle = Math.PI * 2 + angle;
  return angle;
}
function distanceBetweenTwoPoints(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
}
function degreesToRadians(angle) {
  return (angle * Math.PI) / 180;
}

document.addEventListener('keydown', function(e) {
  switch(e.code) {
    case 'KeyW':
      player.up();
      break;
    case 'KeyS':
      player.down();
      break;
    case 'KeyA':
      player.left();
      break;
    case 'KeyD':
      player.right();
      break;
  }
});

document.addEventListener('keyup', function(e) {
  switch(e.code) {
    case 'KeyW':
      player.stopMove();
      break;
    case 'KeyS':
      player.stopMove();
      break;
    case 'KeyA':
      player.stopTurn();
      break;
    case 'KeyD':
      player.stopTurn();
      break;
  }
});

class Level {
  constructor(canvas, context, arrayLevel) {
    this.canvas = canvas;
    this.ctx = context;
    this.level = arrayLevel;
    this.width = this.level[0].length;
    this.height = this.level.length;
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.tileWidth = this.canvasWidth / this.width;
    this.tileHeight = this.canvasHeight / this.height;
  }

  collision(x, y) { return this.level[y][x]; }

  display() {
    for(let row = 0; row < this.height; row++) {
      for(let column = 0; column < this.width; column++) {
        if(this.level[row][column]) {
          this.ctx.beginPath();
          this.ctx.fillStyle = wallColor;
          this.ctx.fillRect(column * this.tileWidth, row * this.tileHeight, this.tileWidth, this.tileHeight);
          this.ctx.closePath();
        } else {
          this.ctx.beginPath();
          this.ctx.strokeStyle = wallColor;
          this.ctx.strokeRect(column * this.tileWidth, row * this.tileHeight, this.tileWidth, this.tileHeight);
          this.ctx.closePath();
        }
      }
    }
  }

  render() {
    let color = 0;

    for(let row = 0; row < this.height; row++) {
      for(let column = 0; column < this.width; column++) {
        if(this.level[row][column]) color = wallColor;
        else color = floorColor;

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.fillRect(column * this.tileWidth, row * this.tileHeight, this.tileWidth, this.tileHeight);
        this.ctx.closePath();
      }
    }
  }
}

class Player {
  constructor(context, level, x, y) {
    this.ctx = context;
    this.level = level;
    this.x = x;
    this.y = y;
    this.forward = 0;
    this.turn = 0;
    this.rotationAngle = 0; // -(Math.PI / 4);
    this.movementSpeed = 3;                 // PIXELS
    this.turnSpeed = 3 * (Math.PI / 180);   // DEGREES
    // this.ray = new Ray(this.ctx, this.level, this.x, this.y, this.rotationAngle, 0, 0);
    this.fov = 60;
    this.rays = [];

    let initAngle = degreesToRadians(this.rotationAngle - 30);
    let angleIncrement = degreesToRadians(this.fov / canvasWidth);

    for(let i = 0; i < canvasWidth; i++) {
      this.rays[i] = new Ray(this.ctx, this.level, this.x, this.y, initAngle, 0, i);
      initAngle += angleIncrement;
    }
  }

  up()        { this.forward = 1;  }
  down()      { this.forward = -1; }
  left()      { this.turn = -1;    }
  right()     { this.turn = 1;     }
  stopMove()  { this.forward = 0;  }
  stopTurn()  { this.turn = 0;     }

  collision(x, y) {
    let _x = Math.floor(x / this.level.tileWidth);
    let _y = Math.floor(y / this.level.tileHeight);
    return this.level.collision(_x, _y);
  }

  update() {
    this.rotationAngle += this.turnSpeed * this.turn;
    this.rotationAngle = normalizeAngle(this.rotationAngle);
    // this.ray.setAngle(this.rotationAngle);

    let x = this.x + Math.cos(this.rotationAngle) * this.movementSpeed * this.forward;
    let y = this.y + Math.sin(this.rotationAngle) * this.movementSpeed * this.forward;

    if(!this.collision(x, y)) {
      this.x = x;
      this.y = y;
      // this.ray.setPosition(this.x, this.y);
    }
  }

  showRotationAngle() {
    this.ctx.beginPath();
    this.ctx.fillText(`${this.rotationAngle}`, 300, 100);
    this.ctx.closePath();
  }

  display() {
    // this.showRotationAngle();

    let factor = this.level.tileWidth;
    let cosine = Math.cos(this.rotationAngle);
    let sine = Math.sin(this.rotationAngle);

    let x = this.x + cosine * factor;
    let y = this.y + sine * factor;
    
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#FF0000aa';
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(x, this.y);
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#00FF00aa';
    this.ctx.moveTo(x, this.y);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#0000FFaa';
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  render() {
    this.ctx.beginPath();
    this.ctx.fillStyle = playerColor;
    this.ctx.fillRect(this.x - 3, this.y - 3, 6, 6);
    this.ctx.closePath();
  }
}

class Ray {
  #horizonalTileHit = {};
  #verticalTileHit = {};
  #wallHitX = 0;
  #wallHitY = 0;

  constructor(context, level, x, y, anglePlayer, angleIncrement, column) {
    this.ctx = context;
    this.level = level;
    this.x = x;
    this.y = y;
    this.angle = anglePlayer;
    this.angleIncrement = angleIncrement;
    this.column = column;
    this.#horizonalTileHit = {x: 0, y: 0};
    this.#verticalTileHit = {x: 0, y: 0};
    this.#wallHitX = 0;
    this.#wallHitY = 0;
  }

  setAngle(value) { this.angle = value; }
  setPosition(x, y) { this.x = x; this.y = y; }

  rayCastWithTileHorizontal() {
    let cosine = Math.cos(this.angle);
    let sine = Math.sin(this.angle);
    let m = sine / cosine;
    let newOrdinate = 0;
    let newAdyacent = 0;
    let desiredX = 0;
    let desiredY = 0;
    let downDirection = 1; // downDirection

    // let tileX = Math.floor(this.x / this.level.tileWidth);
    let tileY = Math.floor(this.y / this.level.tileHeight);

    if(sine > 0) downDirection = 1; // downDirection

    if(sine < 0) {
      downDirection = -1; // upDirection
      desiredY += this.level.tileHeight + downDirection;
    }

    desiredY += (this.level.tileHeight * downDirection) /* + downDirection */;

    desiredY = desiredY + tileY * this.level.tileHeight;
    newOrdinate = this.y - desiredY;
    newAdyacent = newOrdinate / m;
    desiredX = this.x - newAdyacent;

    let rayTileX = Math.floor(desiredX / this.level.tileWidth);
    let rayTileY = Math.floor(desiredY / this.level.tileHeight);

    let hit = false;

    while(hit === false) {
      if(rayTileX > 9) rayTileX = 9;
      if(rayTileX < 0) rayTileX = 0;
      if(rayTileY > 9) rayTileY = 9;
      if(rayTileY < 0) rayTileY = 0;
      if(!this.level.collision(rayTileX, rayTileY)) {
        desiredY += this.level.tileHeight * downDirection;
        newOrdinate = this.y - desiredY;
        newAdyacent = newOrdinate / m;
        desiredX = this.x - newAdyacent;
        rayTileX = Math.floor(desiredX / this.level.tileWidth);
        rayTileY = Math.floor(desiredY / this.level.tileHeight);
      } else {
        hit = true;
        this.#horizonalTileHit.x = desiredX;
        this.#horizonalTileHit.y = desiredY;
      }
    }

    /* this.ctx.beginPath();
    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillText(`tileX: ${tileX}`, 310, 60);
    this.ctx.fillText(`tileY: ${tileY}`, 310, 80);
    this.ctx.fillText(`Y1: ${newOrdinate}`, 310, 100);
    this.ctx.fillText(`X1: ${newAdyacent}`, 310, 120);
    this.ctx.fillText(`X: ${desiredX}`, 310, 140);
    this.ctx.fillText(`Y: ${desiredY}`, 310, 160);
    this.ctx.fillText(`cosine: ${cosine}`, 310, 180);
    this.ctx.fillText(`sine: ${sine}`, 310, 200);
    this.ctx.fillText(`rayTileX: ${rayTileX}`, 310, 220);
    this.ctx.fillText(`rayTileY: ${rayTileY}`, 310, 240);
    this.ctx.closePath(); */
  }

  rayCastWithTileVertical() {
    let cosine = Math.cos(this.angle);
    let sine = Math.sin(this.angle);
    let m = sine / cosine;
    let newOrdinate = 0;
    let newAdyacent = 0;
    let desiredX = 0;
    let desiredY = 0;
    let multiplier = 1; // downDirection

    let tileX = Math.floor(this.x / this.level.tileWidth);
    // let tileY = Math.floor(this.y / this.level.tileHeight);

    if(cosine > 0) multiplier = 1; // downDirection

    if(cosine < 0) {
      multiplier = -1; // upDirection
      desiredX += this.level.tileWidth + multiplier;
    }

    desiredX += (this.level.tileWidth * multiplier) /* + multiplier */;

    desiredX = desiredX + tileX * this.level.tileWidth;
    newAdyacent = this.x - desiredX;
    newOrdinate = newAdyacent * m;
    desiredY = this.y - newOrdinate;

    let rayTileX = Math.floor(desiredX / this.level.tileWidth);
    let rayTileY = Math.floor(desiredY / this.level.tileHeight);

    let hit = false;

    while(hit === false) {
      if(rayTileX > 9) rayTileX = 9;
      if(rayTileX < 0) rayTileX = 0;
      if(rayTileY > 9) rayTileY = 9;
      if(rayTileY < 0) rayTileY = 0;
      if(!this.level.collision(rayTileX, rayTileY)) {
        desiredX += this.level.tileWidth * multiplier;
        newAdyacent = this.x - desiredX;
        newOrdinate = newAdyacent * m;
        desiredY = this.y - newOrdinate;
        rayTileX = Math.floor(desiredX / this.level.tileWidth);
        rayTileY = Math.floor(desiredY / this.level.tileHeight);
      } else {
        hit = true;
        this.#verticalTileHit.x = desiredX;
        this.#verticalTileHit.y = desiredY;
      }
    }

    /* this.ctx.beginPath();
    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillText(`tileX: ${tileX}`, 310, 60);
    this.ctx.fillText(`tileY: ${tileY}`, 310, 80);
    this.ctx.fillText(`Y1: ${newOrdinate}`, 310, 100);
    this.ctx.fillText(`X1: ${newAdyacent}`, 310, 120);
    this.ctx.fillText(`X: ${desiredX}`, 310, 140);
    this.ctx.fillText(`Y: ${desiredY}`, 310, 160);
    this.ctx.fillText(`cosine: ${cosine}`, 310, 180);
    this.ctx.fillText(`sine: ${sine}`, 310, 200);
    this.ctx.fillText(`rayTileX: ${rayTileX}`, 310, 220);
    this.ctx.fillText(`rayTileY: ${rayTileY}`, 310, 240);
    this.ctx.closePath();*/
  }

  rayCast() {
    this.rayCastWithTileHorizontal();
    this.rayCastWithTileVertical();

    let distanceX = 9999999999;
    let distanceY = 9999999999;

    distanceX = distanceBetweenTwoPoints(this.x, this.y, this.#horizonalTileHit.x, this.#horizonalTileHit.y);
    distanceY = distanceBetweenTwoPoints(this.x, this.y, this.#verticalTileHit.x, this.#verticalTileHit.y);

    if(distanceX < distanceY) {
      this.#wallHitX = this.#horizonalTileHit.x;
      this.#wallHitY = this.#horizonalTileHit.y;
    } else {
      this.#wallHitX = this.#verticalTileHit.x;
      this.#wallHitY = this.#verticalTileHit.y;
    }
  }

  update(player) {
    this.setAngle(this.angle + player.turnSpeed * player.turn);
    this.setPosition(player.x, player.y);
    this.rayCast();
  }

  displayRayCastWithTileHorizontal() {
    // New Adyacent Line From Ray
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#000000';
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.#horizonalTileHit.x, this.y);
    this.ctx.stroke();
    this.ctx.closePath();

    // New Ordinate Line From Ray
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#000000';
    this.ctx.moveTo(this.#horizonalTileHit.x, this.y);
    this.ctx.lineTo(this.#horizonalTileHit.x, this.#horizonalTileHit.y);
    this.ctx.stroke();
    this.ctx.closePath();

    // Red Point In New Adyacent Line From Ray
    this.ctx.beginPath();
    this.ctx.fillStyle = '#ff0000';
    this.ctx.arc(this.#horizonalTileHit.x, this.y, 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();

    // Green Point In New Ordinate Line From Ray
    this.ctx.beginPath();
    this.ctx.fillStyle = '#00ff00';
    this.ctx.arc(this.#horizonalTileHit.x, this.#horizonalTileHit.y, 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }

  displayRayCastWithTileVertical() {
    // New Adyacent Line From Ray
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#000000';
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.#verticalTileHit.x, this.y);
    this.ctx.stroke();
    this.ctx.closePath();

    // New Ordinate Line From Ray
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#000000';
    this.ctx.moveTo(this.#verticalTileHit.x, this.y);
    this.ctx.lineTo(this.#verticalTileHit.x, this.#verticalTileHit.y);
    this.ctx.stroke();
    this.ctx.closePath();

    // Red Point In New Adyacent Line From Ray
    this.ctx.beginPath();
    this.ctx.fillStyle = '#ff0000';
    this.ctx.arc(this.#verticalTileHit.x, this.y, 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();

    // Green Point In New Ordinate Line From Ray
    this.ctx.beginPath();
    this.ctx.fillStyle = '#00ff00';
    this.ctx.arc(this.#verticalTileHit.x, this.#verticalTileHit.y, 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }

  display() {
    this.displayRayCastWithTileHorizontal();
    this.displayRayCastWithTileVertical();
  }

  render() {
    // Ray
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#ff0000';
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.#wallHitX, this.#wallHitY);
    this.ctx.stroke();
    this.ctx.closePath();
  }
}

function inicializa() { 
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  level = new Level(canvas, ctx, levelMap);
  // player = new Player(ctx, level, 175, 125);
  player = new Player(ctx, level, 125, 125);
}

function main() {
  clearCanvas();
  player.update();
  level.render();
  player.render();

  for(let i = 0; i < player.rays.length; i++) {
    player.rays[i].update(player);
    player.rays[i].render();
  }
  level.display();
  player.display();
  requestAnimationFrame(main);
}

inicializa();
requestAnimationFrame(main);