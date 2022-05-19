const test = cyclone.Vector3.zero();

class Wall {
  constructor(x, y, z, w, h) {
    this.position = new cyclone.Vector3(x, y, z);
    this.w = w;
    this.h = h;
  }

  render() {
    ctx.beginPath();
    ctx.rect(this.position.x, this.position.y, this.w, this.h);
    ctx.fill();
    ctx.closePath();
    return this;
  }
}

class Player {
  constructor(x, y, z) {
    this.position = new cyclone.Vector3(x, y, z);
  }

  render() {
    return this;
  }
}

canvas.addEventListener('keydown', function(e) {
  if(e.code === 'KeyW') {
    player.position.z += 5;
  }

  if(e.code === 'KeyS') {
    player.position.z -= 5;
  }
});

const wall = new Wall(100, 100, 100, 100, 100).render();
const player = new Player(0, 0, 0).render();