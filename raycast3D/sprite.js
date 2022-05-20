import { distance, degreesToRadians } from '../utils/utils.js';

export class Sprite {
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

  render(obj, zBuffer) {
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