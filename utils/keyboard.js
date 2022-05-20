export class Keyboard {
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