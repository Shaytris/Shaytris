import { Tetromino } from './tetromino';

const canvas = document.getElementById('tetrisCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const cellSize = canvas.width / 10;

export function drawGrid(tetromino: Tetromino) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTetromino(tetromino);
    // Other drawing functions like drawParticles(), drawHold(), etc.
}

function drawTetromino(tetromino: Tetromino) {
    tetromino.shape.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell !== 0) {
                ctx.fillStyle = tetromino.color;
                ctx.fillRect((tetromino.x + j) * cellSize, (tetromino.y + i) * cellSize, cellSize, cellSize);
                ctx.strokeStyle = '#333';
                ctx.strokeRect((tetromino.x + j) * cellSize, (tetromino.y + i) * cellSize, cellSize, cellSize);
            }
        });
    });
}
