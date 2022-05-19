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

function normilizeAngle(angle) {
                angle = angle % (Math.PI * 2);
  if(angle < 0) angle = (Math.PI * 2) + angle;
  return angle;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt( (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) );
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function canvasReScale(canvas) {
  canvas.style.width = '800px';
  canvas.style.height = '800px';
}

function createBitMap(ctx, imgRawData, imageWidth, imageHeight) {
  let image = ctx.createImageData(imageWidth, imageHeight); // only do this once per page

    try {
      for(let i = 0; i < imageWidth; i++) {
        for(let j = 0; j < imageHeight; j++) {
          // d[i * 50 * 4 + j * 4]      = 255 // r;
          // d[i * 50 * 4 + j * 4 + 1]  = 0   // g;
          // d[i * 50 * 4 + j * 4 + 2]  = 0   // b;
          // d[i * 50 * 4 + j * 4 + 3]  = 255 // a;

          image.data[i * imageWidth * 4 + j * 4]      = imgRawData[i * imageWidth * 4 + j * 4]
          image.data[i * imageWidth * 4 + j * 4 + 1]  = imgRawData[i * imageWidth * 4 + j * 4 + 1]
          image.data[i * imageWidth * 4 + j * 4 + 2]  = imgRawData[i * imageWidth * 4 + j * 4 + 2]
          image.data[i * imageWidth * 4 + j * 4 + 3]  = imgRawData[i * imageWidth * 4 + j * 4 + 3]
        }
      }

      return createImageBitmap(image, 0, 0, imageWidth, imageHeight);
    } catch(e) {
      console.log(e.message);
    }
}

function renderSprites(_sprites) {
  _sprites.sort(function(obj1, obj2) {
    // Ascending: obj1.distance - obj2.distance;
    // Descending: obj2.distance - obj1.distance;
    return obj2.distance - obj1.distance;
  });
}

class Keyboard {
  constructor(element) {
    this.keyMap = {};

    element.addEventListener('keydown', (e) => {
      this.keyMap[e.code] = true;
    });
    element.addEventListener('keyup', (e) => {
      this.keyMap[e.code] = false;
    });
  }
}

class Canvas {
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

class Context {
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

class Level {
  #canvas = null;
  #ctx    = null;
  #level  = null;

  constructor(canvas, context, level) {
    this.#canvas      = canvas;
    this.#ctx         = context;
    this.#level       = level;
    this.levelWidth   = this.#level[0].length;
    this.levelHeight  = this.#level.length;
    this.tileWidth    = this.#canvas.width / this.levelWidth;
    this.tileHeight   = this.#canvas.height / this.levelHeight;
  }

  collision(x, y) { return this.#level[x][y]; }

  display() {
    for(let x = 0; x < this.levelWidth; x++) {
      for(let y = 0; y < this.levelHeight; y++) {
        this.#ctx.strokeRect(
          x * this.tileWidth, 
          y * this.tileHeight,
          this.tileWidth, 
          this.tileHeight,
          '#000000'
        );
      }
    }
  }

  render() {
    let color = '#666666';

    for(let x = 0; x < this.levelWidth; x++) {
      for(let y = 0; y < this.levelHeight; y++) {
        if(this.#level[x][y] === 1) color = '#000000';
        else                        color = '#666666';

        this.#ctx.fillRect(
          x * this.tileWidth, 
          y * this.tileHeight,
          this.tileWidth, 
          this.tileHeight,
          color
        );
      }
    }
  }
}

class Ray {
  #ctx                        = null;
  #level                      = null;
  #horizontalRayPosX          = null;
  #horizontalRayPosY          = null;
  #horizontalOrdinate         = null;
  #horizontalAdyacent         = null;
  #verticalRayPosX            = null;
  #verticalRayPosY            = null;
  #verticalOrdinate           = null;
  #verticalAdyacent           = null;
  #rayHTileX                  = null;
  #rayHTileY                  = null;
  #rayVTileX                  = null;
  #rayVTileY                  = null;
  #wallHitHorizontal          = null;
  #wallHitVertical            = null;
  #wallHit                    = null;

  constructor(context, level, x, y, angle, angleIncrement, column, color) {
    this.x                    = x;
    this.y                    = y;
    this.angle                = angle;
    this.angleIncrement       = angleIncrement;
    this.column               = column;
    this.#ctx                 = context;
    this.#level               = level;
    this.color                = color;
    this.#horizontalRayPosX   = 0;
    this.#horizontalRayPosY   = 0;
    this.#horizontalOrdinate  = 0;
    this.#horizontalAdyacent  = 0;
    this.#verticalRayPosX     = 0;
    this.#verticalRayPosY     = 0;
    this.#verticalOrdinate    = 0;
    this.#verticalAdyacent    = 0;
    this.#rayHTileX           = 0;
    this.#rayHTileY           = 0;
    this.#rayVTileX           = 0;
    this.#rayVTileY           = 0;
    this.#wallHitHorizontal   = { x: 0, y: 0 };
    this.#wallHitVertical     = { x: 0, y: 0 };
    this.#wallHit             = { x: 0, y: 0 };
    this.distance             = 0;
    this.pixelHit             = 0;
  }

  cast(obj) {
    let cosine                = Math.cos(this.angle);
    let sine                  = Math.sin(this.angle);
    let tan                   = sine / cosine;

    // Cast Ray Collision With Tile Horizontal Side
    let tileIndexX            = Math.floor(this.x / this.#level.tileWidth);
    let tileIndexY            = Math.floor(this.y / this.#level.tileHeight);

    if(cosine > 0)            tileIndexX++;
    if(sine > 0)              tileIndexY++;

    this.#horizontalRayPosY   = tileIndexY * this.#level.tileHeight;
    // this.#horizontalOrdinate  = Math.abs(this.y - this.#horizontalRayPosY) * upDirection;
    this.#horizontalOrdinate  = this.y - this.#horizontalRayPosY;
    this.#horizontalAdyacent  = this.#horizontalOrdinate / -tan;
    this.#horizontalRayPosX   = this.x + this.#horizontalAdyacent;

    if(this.#horizontalRayPosX < 0)   this.#horizontalRayPosX = 0;
    if(this.#horizontalRayPosX > 500) this.#horizontalRayPosX = 500;

    this.#wallHitHorizontal.x = this.#horizontalRayPosX;
    this.#wallHitHorizontal.y = this.#horizontalRayPosY;

    this.#verticalRayPosX     = tileIndexX * this.#level.tileWidth;
    // this.#verticalAdyacent  = Math.abs(this.x - this.#verticalRayPosX) * rightDirection;
    this.#verticalAdyacent    = this.x - this.#verticalRayPosX;
    this.#verticalOrdinate    = -tan * this.#verticalAdyacent;
    this.#verticalRayPosY     = this.y + this.#verticalOrdinate;

    if(this.#verticalRayPosY < 0)   this.#verticalRayPosY = 0;
    if(this.#verticalRayPosY > 500) this.#verticalRayPosY = 500;

    this.#wallHitVertical.x   = this.#verticalRayPosX;
    this.#wallHitVertical.y   = this.#verticalRayPosY;

    this.#rayHTileX = Math.floor(this.#horizontalRayPosX / this.#level.tileWidth);
    this.#rayHTileY = Math.floor(this.#horizontalRayPosY / this.#level.tileHeight);

    this.#rayVTileX = Math.floor(this.#verticalRayPosX / this.#level.tileWidth);
    this.#rayVTileY = Math.floor(this.#verticalRayPosY / this.#level.tileHeight);

    if(cosine < 0)  this.#rayVTileX--;
    if(sine < 0)    this.#rayHTileY--;

    let hitHorizontal = false;

    if(this.#rayHTileX) {
      while(!hitHorizontal) {
        if(this.#rayHTileX > 9) this.#rayHTileX = 9;
        if(this.#rayHTileX < 0) this.#rayHTileX = 0;
        if(this.#rayHTileY > 9) this.#rayHTileY = 9;
        if(this.#rayHTileY < 0) this.#rayHTileY = 0;

        if(!this.#level.collision(this.#rayHTileX, this.#rayHTileY)) {
          if(sine > 0)  tileIndexY++;
          else          tileIndexY--;

          this.#horizontalRayPosY   = tileIndexY * this.#level.tileHeight;
          // this.#horizontalOrdinate  = Math.abs(this.y - this.#horizontalRayPosY) * upDirection;
          this.#horizontalOrdinate  = this.y - this.#horizontalRayPosY;
          this.#horizontalAdyacent  = this.#horizontalOrdinate / -tan;
          this.#horizontalRayPosX   = this.x + this.#horizontalAdyacent;

          if(this.#horizontalRayPosX < 0)   this.#horizontalRayPosX = 0;
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
          if(cosine > 0)  tileIndexX++;
          else            tileIndexX--;

          this.#verticalRayPosX   = tileIndexX * this.#level.tileWidth;
          // this.#verticalAdyacent  = Math.abs(this.x - this.#verticalRayPosX) * rightDirection;
          this.#verticalAdyacent  = this.x - this.#verticalRayPosX;
          this.#verticalOrdinate  = -tan * this.#verticalAdyacent;
          this.#verticalRayPosY   = this.y + this.#verticalOrdinate;

          if(this.#verticalRayPosY < 0)   this.#verticalRayPosY = 0;
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

    let horizontalDistance  = Number.MAX_VALUE;
    let verticalDistance    = Number.MAX_VALUE;

    horizontalDistance  = distance(this.x, this.y, this.#horizontalRayPosX, this.#horizontalRayPosY);
    verticalDistance    = distance(this.x, this.y, this.#verticalRayPosX, this.#verticalRayPosY);

    if(horizontalDistance < verticalDistance) {
      this.#wallHit.x = this.#horizontalRayPosX;
      this.#wallHit.y = this.#horizontalRayPosY;
      this.distance   = horizontalDistance;

      let tileHit   = parseInt(this.#wallHit.x / this.#level.tileWidth);
      this.pixelHit = parseInt(this.#wallHit.x - (tileHit * this.#level.tileWidth));
    } else {
      this.#wallHit.x = this.#verticalRayPosX;
      this.#wallHit.y = this.#verticalRayPosY;
      this.distance   = verticalDistance;

      let tileHit   = parseInt(this.#wallHit.y / this.#level.tileHeight);
      this.pixelHit = parseInt(this.#wallHit.y - (tileHit * this.#level.tileHeight));
    }

    // ESTO ES PARA CORREGIR/ELIMINAR EL EFECTO OJO DE PEZ AL ACERCARSE A UNA PARED/MURO
    this.distance = this.distance * Math.cos(obj.angle - this.angle);

    zBuffer[this.column] = this.distance;
  }

  renderLevel() { 
    // let adyacentToProyectionPlane = (canvasWidth / 2) / Math.tan(halfFov); // distanceToProyectionPlane
    let adyacentToProyectionPlane = (250) / Math.tan(30); // distanceToProyectionPlane
    // a / b = c / d;   a = (c / d) * b;  --->  ordinateToProyectionPlane / adyacentToProyectionPlane = ordinateToWall(500px) / adyacentToWall
    // a = ? (Altura del muro en el juego)
    // b = distanceToProyectionPlane
    // c = canvasHeight (Esto seria la altura real del muro, es decir 500 pixeles que es lo que mide en alto el canvas).
    // d = distanceToWallHit

    // let ordinateToProyectionPlane = (canvasHeight / this.distanceToWallHit) * adyacentToProyectionPlane;
    let ordinateToProyectionPlane = (500 / this.distance) * adyacentToProyectionPlane;

    // CALCULAMOS DONDE EMPIEZA Y ACABA LA LINEA VERTICAL DEL MURO
    // let skyLineHeight = parseInt(canvasHeight / 2); // Altura en pixeles a la que se encuentra la linea del horizonte.
    let skyLineHeight     = parseInt(250); // Altura en pixeles a la que se encuentra la linea del horizonte.
    let initialWallHeight = skyLineHeight - parseInt(ordinateToProyectionPlane / 2);
    let endWallHeight     = parseInt(initialWallHeight + ordinateToProyectionPlane);
    let wallPositionX     = this.column;

    // DIBUJAMOS LA COLUMNA (LINEA DEL MURO);
    //this.#ctx.line(wallPositionX, initialWallHeight, wallPositionX, endWallHeight, '#666666');

    // for(let i = endWallHeight; i < initialWallHeight; i++) 
    //   ctx.putImageData( id, wallPositionX, i);

    let textureHeight = 50;
    let imageHeight   = initialWallHeight - endWallHeight;

    this.#ctx.context.imageSmoothingEnabled = false;

    bitMap.then((img) => {
      this.#ctx.context.drawImage(
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

  update(obj) {
    this.x      = obj.x;
    this.y      = obj.y;
    this.angle += obj.turnSpeed * obj.turn;
    this.angle  = normilizeAngle(this.angle);
    this.cast(obj);
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

var sprites = [];
var zBuffer = [];

class Sprite {
  #ctx = null;

  constructor(context, x, y, bitmap/* image */) {
    this.#ctx = context;
    this.x = x;
    this.y = y;
    // this.image = image;
    this.bitmap = bitmap;
    this.distance = 0;
    this.angle = 0;
    this.visible = false;
    this.angleDifference = 0;
  }

  calculateAngle(obj) {
    let newX = this.x - obj.x;
    let newY = this.y - obj.y;
    let angleBetweenThisSpriteAndObj = Math.atan2(newY, newX);
    // angleBetweenThisSpriteAndObj = normilizeAngle(angleBetweenThisSpriteAndObj);
    this.angleDifference = obj.angle - angleBetweenThisSpriteAndObj;

    if(this.angleDifference < -Math.PI) this.angleDifference += 2 * Math.PI;
    if(this.angleDifference > Math.PI) this.angleDifference -= 2 * Math.PI;

    this.angleDifference = Math.abs(this.angleDifference);
    let a = degreesToRadians(30);

    if(this.angleDifference < a ) this.visible = true;
    else this.visible = false;
  }

  update(obj) {
    this.calculateAngle(obj);
    this.distance = distance(obj.x, obj.y, this.x, this.y);
  }

  render(obj) {
    if(this.visible === true) {
      // let adyacentToProyectionPlane = (canvasWidth / 2) / Math.tan(halfFov); // distanceToProyectionPlane
      let adyacentToProyectionPlane = (250) / Math.tan(30); // distanceToProyectionPlane
      // a / b = c / d;   a = (c / d) * b;  --->  ordinateToProyectionPlane / adyacentToProyectionPlane = ordinateToWall(500px) / adyacentToWall
      // a = ? (Altura del muro en el juego)
      // b = distanceToProyectionPlane
      // c = canvasHeight (Esto seria la altura real del muro, es decir 500 pixeles que es lo que mide en alto el canvas).
      // d = distanceToWallHit

      // let ordinateToProyectionPlane = (canvasHeight / this.distanceToWallHit) * adyacentToProyectionPlane;
      let ordinateToProyectionPlane = (500 / this.distance) * adyacentToProyectionPlane;

      // CALCULAMOS DONDE EMPIEZA Y ACABA LA LINEA VERTICAL DEL MURO
      // let skyLineHeight = parseInt(canvasHeight / 2); // Altura en pixeles a la que se encuentra la linea del horizonte.
      let skyLineHeight     = parseInt(250); // Altura en pixeles a la que se encuentra la linea del horizonte.
      let initialWallHeight = skyLineHeight - parseInt(ordinateToProyectionPlane / 2);
      let endWallHeight     = parseInt(initialWallHeight + ordinateToProyectionPlane);
      let wallPositionX     = this.column;

      // DIBUJAMOS LA COLUMNA (LINEA DEL MURO);
      //this.#ctx.line(wallPositionX, initialWallHeight, wallPositionX, endWallHeight, '#666666');

      // for(let i = endWallHeight; i < initialWallHeight; i++) 
      //   ctx.putImageData( id, wallPositionX, i);

      let textureWidth = 50;
      let textureHeight = 50;
      let imageHeight   = initialWallHeight - endWallHeight;
      let imageWidth    = imageHeight;

      let viewDistance = 500;
      let dx = obj.x - this.x;
      let dy = obj.y - this.y;
      let spriteAngle = Math.atan2(dy, dx) - obj.angle;

      let x0 = Math.tan(spriteAngle) * viewDistance;
      let x = 250 + x0 - (imageWidth / 2);

      this.#ctx.context.imageSmoothingEnabled = false;

      let columnWidth = imageHeight / textureHeight;

      for(let i = 0; i < textureWidth; i++) {
        for(let j = 0; j < columnWidth; j++) {
          let x1 = parseInt(x + ((i - 1) * columnWidth) + j);

          if(zBuffer[x1] > this.distance) {
            this.bitmap.then((img) => {
              this.#ctx.context.drawImage(
                img, 
                i, 
                0, 
                1, 
                textureHeight - 1, 
                x1, 
                endWallHeight, 
                1, 
                imageHeight
              );
            });
          }
        }
      }
    }
  }
}

class Entity {
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

var image = null;
var bitMap = null;

class Game {
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

    bitMap = createBitMap(this.#ctx.context, imgRaw, 50, 50);
    let coin = createBitMap(this.#ctx.context, coinSprite, 50, 50);

    sprites[0] = new Sprite(this.#ctx, 300, 125, coin); 
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
    this.#rays.forEach(ray => ray.update(this.#player));
    sprites[0].update(this.#player);
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
      ray.renderLevel();
    });

    sprites[0].render(this.#player);
    renderSprites(sprites);
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

const game = new Game(levelMap, 500, 500);
// game.showInfo('canvasWidth: ', game.canvasWidth, 100, 200, 'red');
// game.showInfo('canvasHeight: ', game.canvasHeight, 100, 220, 'red');
// game.showInfo('levelWidth: ', game.levelWidth, 100, 240, 'red');
// game.showInfo('levelHeight: ', game.levelHeight, 100, 260, 'red');
// game.showInfo('tileWidth: ', game.tileWidth, 100, 280, 'red');
// game.showInfo('tileHeight: ', game.tileHeight, 100, 300, 'red');
game.run();