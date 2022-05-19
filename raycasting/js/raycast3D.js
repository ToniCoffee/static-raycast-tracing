// Sobre como dibujar pixeles individuales
// https://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas

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
const levelMap1 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
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

    try {
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
    } catch(e) {
      console.log(e.message);
    }
  }
}

const fov = 60;
const halfFov = fov / 2;

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
    this.rays = [];

    let initAngle = degreesToRadians(this.rotationAngle - 30);
    let angleIncrement = degreesToRadians(fov / canvasWidth);

    for(let i = 0; i < canvasWidth; i++) {
      this.rays[i] = new Ray(this.ctx, this.level, this.x, this.y, initAngle, angleIncrement, i);
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
    this.distanceToWallHit = 0;
    this.pixelHit = 0;
  }

  renderLevel() { 
    let adyacentToProyectionPlane = (canvasWidth / 2) / Math.tan(halfFov); // distanceToProyectionPlane
    // a / b = c / d;   a = (c / d) * b;  --->  ordinateToProyectionPlane / adyacentToProyectionPlane = ordinateToWall(500px) / adyacentToWall
    // a = ? (Altura del muro en el juego)
    // b = distanceToProyectionPlane
    // c = canvasHeight (Esto seria la altura real del muro, es decir 500 pixeles que es lo que mide en alto el canvas).
    // d = distanceToWallHit

    let ordinateToProyectionPlane = (canvasHeight / this.distanceToWallHit) * adyacentToProyectionPlane;

    // CALCULAMOS DONDE EMPIEZA Y ACABA LA LINEA VERTICAL DEL MURO
    let skyLineHeight = parseInt(canvasHeight / 2); // Altura en pixeles a la que se encuentra la linea del horizonte.
    let initialWallHeight = skyLineHeight - parseInt(ordinateToProyectionPlane / 2);
    let endWallHeight = parseInt(initialWallHeight + ordinateToProyectionPlane);
    let wallPositionX = this.column;

    // DIBUJAMOS LA COLUMNA (LINEA DEL MURO);
    // this.ctx.beginPath();
    // this.ctx.strokeStyle = '#666666';
    // this.ctx.moveTo(wallPositionX, initialWallHeight);
    // this.ctx.lineTo(wallPositionX, endWallHeight);
    // this.ctx.stroke(); 
    // this.ctx.closePath();

    // for(let i = endWallHeight; i < initialWallHeight; i++) 
    //   ctx.putImageData( id, wallPositionX, i);

    let textureHeight = 50;
    let imageHeight = initialWallHeight - endWallHeight;

    ctx.imageSmoothingEnabled = false;

    bitMap.then((img) => {
      ctx.drawImage(
        img, 
        this.pixelHit, 
        0, 
        1, 
        textureHeight, 
        this.column, 
        endWallHeight, 
        1, 
        imageHeight
      );
    });
  }

  setAngle(value) { this.angle = value; }
  // setAngle(angle) { this.angle = normalizeAngle(angle + this.angleIncrement); }
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

    // desiredY += (this.level.tileHeight * downDirection) /* + downDirection */;
    desiredY += (this.level.tileHeight * downDirection);

    desiredY = desiredY + tileY * this.level.tileHeight;
    newOrdinate = this.y - desiredY;
    newAdyacent = newOrdinate / m;
    desiredX = this.x - newAdyacent;

    let rayTileX = Math.floor(desiredX / this.level.tileWidth);
    let rayTileY = Math.floor(desiredY / this.level.tileHeight);

    let hit = false;

    while(hit === false) {
      if(rayTileX > this.level.height - 1) rayTileX = this.level.height - 1;
      if(rayTileX < 0) rayTileX = 0;
      if(rayTileY > this.level.height - 1) rayTileY = this.level.height - 1;
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

    // this.ctx.beginPath();
    // this.ctx.fillStyle = '#ff0000';
    // this.ctx.fillText(`tileX: ${tileX}`, 310, 60);
    // this.ctx.fillText(`tileY: ${tileY}`, 310, 80);
    // this.ctx.fillText(`Y1: ${newOrdinate}`, 310, 100);
    // this.ctx.fillText(`X1: ${newAdyacent}`, 310, 120);
    // this.ctx.fillText(`X: ${desiredX}`, 310, 140);
    // this.ctx.fillText(`Y: ${desiredY}`, 310, 160);
    // this.ctx.fillText(`cosine: ${cosine}`, 310, 180);
    // this.ctx.fillText(`sine: ${sine}`, 310, 200);
    // this.ctx.fillText(`rayTileX: ${rayTileX}`, 310, 220);
    // this.ctx.fillText(`rayTileY: ${rayTileY}`, 310, 240);
    // this.ctx.closePath();
  }

  rayCastWithTileVertical() {
    let cosine = Math.cos(this.angle);
    let sine = Math.sin(this.angle);
    let m = sine / cosine;
    let newOrdinate = 0;
    let newAdyacent = 0;
    let desiredX = 0;
    let desiredY = 0;
    let multiplier = 1; // rightDirection

    let tileX = Math.floor(this.x / this.level.tileWidth);
    // let tileY = Math.floor(this.y / this.level.tileHeight);

    if(cosine > 0) multiplier = 1; // rightDirection

    if(cosine < 0) {
      multiplier = -1; // leftDirection
      desiredX += this.level.tileWidth + multiplier;
    }

    // desiredX += (this.level.tileWidth * multiplier) /* + multiplier */;
    desiredX += (this.level.tileWidth * multiplier);

    desiredX = desiredX + tileX * this.level.tileWidth;
    newAdyacent = this.x - desiredX;
    newOrdinate = newAdyacent * m;
    desiredY = this.y - newOrdinate;

    let rayTileX = Math.floor(desiredX / this.level.tileWidth);
    let rayTileY = Math.floor(desiredY / this.level.tileHeight);

    let hit = false;

    while(hit === false) {
      if(rayTileX > this.level.width - 1) rayTileX = this.level.width - 1;
      if(rayTileX < 0) rayTileX = 0;
      if(rayTileY > this.level.width - 1) rayTileY = this.level.width - 1;
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

    // this.ctx.beginPath();
    // this.ctx.fillStyle = '#ff0000';
    // this.ctx.fillText(`tileX: ${tileX}`, 310, 60);
    // this.ctx.fillText(`tileY: ${tileY}`, 310, 80);
    // this.ctx.fillText(`Y1: ${newOrdinate}`, 310, 100);
    // this.ctx.fillText(`X1: ${newAdyacent}`, 310, 120);
    // this.ctx.fillText(`X: ${desiredX}`, 310, 140);
    // this.ctx.fillText(`Y: ${desiredY}`, 310, 160);
    // this.ctx.fillText(`cosine: ${cosine}`, 310, 180);
    // this.ctx.fillText(`sine: ${sine}`, 310, 200);
    // this.ctx.fillText(`rayTileX: ${rayTileX}`, 310, 220);
    // this.ctx.fillText(`rayTileY: ${rayTileY}`, 310, 240);
    // this.ctx.closePath();
  }

  rayCast(player) {
    this.rayCastWithTileHorizontal();
    this.rayCastWithTileVertical();

    let distanceX = 9999999999;
    let distanceY = 9999999999;
    // let distanceX = Infinity;
    // let distanceY = Infinity;

    distanceX = distanceBetweenTwoPoints(this.x, this.y, this.#horizonalTileHit.x, this.#horizonalTileHit.y);
    distanceY = distanceBetweenTwoPoints(this.x, this.y, this.#verticalTileHit.x, this.#verticalTileHit.y);

    if(distanceX < distanceY) {
      this.#wallHitX = this.#horizonalTileHit.x;
      this.#wallHitY = this.#horizonalTileHit.y;
      this.distanceToWallHit = distanceX;
      
      let tileHit = parseInt(this.#wallHitX / this.level.tileWidth);
      this.pixelHit =  this.#wallHitX - (tileHit * this.level.tileWidth);
    } else {
      this.#wallHitX = this.#verticalTileHit.x;
      this.#wallHitY = this.#verticalTileHit.y;
      this.distanceToWallHit = distanceY;

      let tileHit = parseInt(this.#wallHitY / this.level.tileHeight);
      this.pixelHit =  this.#wallHitY - (tileHit * this.level.tileHeight);
    }

    // ESTO ES PARA CORREGIR/ELIMINAR EL EFECTO OJO DE PEZ AL ACERCARSE A UNA PARED/MURO
    this.distanceToWallHit = this.distanceToWallHit * Math.cos(player.rotationAngle - this.angle);
  }

  update(player) {
    this.setAngle(this.angle + player.turnSpeed * player.turn);
    // this.setAngle(player.rotationAngle);
    this.setPosition(player.x, player.y);
    this.rayCast(player);
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

var image = null;
var bitMap = null;

function inicializa() { 
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  level = new Level(canvas, ctx, levelMap);
  // player = new Player(ctx, level, 175, 125);
  player = new Player(ctx, level, 125, 125);

  image = ctx.createImageData(50,50); // only do this once per page

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
  }
}

function main() {
  clearCanvas();
  player.update();
  // level.render();
  player.render();

  for(let i = 0; i < player.rays.length; i++) {
    player.rays[i].update(player);
    // player.rays[i].render();
    player.rays[i].renderLevel();
  }
  // level.display();
  player.display();
  requestAnimationFrame(main);
}

inicializa();
requestAnimationFrame(main);


// var id = ctx.createImageData(1,1); // only do this once per page
// var d  = id.data;                        // only do this once per page
// d[0]   = 255 // r;
// d[1]   = 0 // g;
// d[2]   = 255 // b;
// d[3]   = 255 // a;
// ctx.putImageData( id, 100, 100 );

// 'wallTest', 50x50px
