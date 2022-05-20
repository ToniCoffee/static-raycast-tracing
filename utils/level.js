export class Level {
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