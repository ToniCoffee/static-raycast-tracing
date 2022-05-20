import { levelMap } from './level.js';

const GAME_CONTEXT = {
	A: 'raycast2D',
	B: 'raycast3D'
};

async function loadModule(path) {
	const { Game } = await import(`./${path}/game.js`);
	return Game;
};

async function run() {
	const Game = await loadModule(GAME_CONTEXT.B);
	const game = new Game(levelMap, 500, 500);
	// game.showInfo('canvasWidth: ', game.canvasWidth, 100, 200, 'red');
	// game.showInfo('canvasHeight: ', game.canvasHeight, 100, 220, 'red');
	// game.showInfo('levelWidth: ', game.levelWidth, 100, 240, 'red');
	// game.showInfo('levelHeight: ', game.levelHeight, 100, 260, 'red');
	// game.showInfo('tileWidth: ', game.tileWidth, 100, 280, 'red');
	// game.showInfo('tileHeight: ', game.tileHeight, 100, 300, 'red');
	game.run();
}

run();