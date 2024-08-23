import { Tetromino, Particle, getNextTetromino, initBag } from './tetromino';
import { drawGrid } from './drawing';
import { resetGame, resetTetromino } from './reset';

const canvas = document.getElementById('tetrisCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
let currentTetromino: Tetromino;
let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

export function initGame() {
    if (!canvas || !ctx) {
        console.error("Canvas element not found!");
        return;
    }
    initBag();
    resetTetromino();
    requestAnimationFrame(loop);
}

function update(deltaTime: number) {
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        dropTetromino();
    }
    drawGrid(currentTetromino);
}

function loop(timestamp: number) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    update(deltaTime);
    requestAnimationFrame(loop);
}

// Export current game state for other modules if needed
export { currentTetromino };