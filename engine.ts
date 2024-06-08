document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('tetrisCanvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("Canvas 2D context not found!");
        return;
    }

    const cols = 10;
    const rows = 20;
    const cellSize = canvas.width / cols;
    const tetrominoColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
    let grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
    let currentTetromino: Tetromino;
    let lastTime = 0;
    let dropCounter = 0;
    let dropInterval = 1000;

    const particles: Particle[] = [];

    type Tetromino = {
        shape: number[][];
        color: string;
        x: number;
        y: number;
    };

    type Particle = {
        x: number;
        y: number;
        color: string;
        radius: number;
        dx: number;
        dy: number;
        life: number;
    };

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (grid[row][col] !== 0) {
                    ctx.fillStyle = tetrominoColors[grid[row][col] - 1];
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                    ctx.strokeStyle = '#333';
                    ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
                } else {
                    ctx.strokeStyle = '#333';
                    ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }
            }
        }
        drawTetromino(currentTetromino); // Draw current Tetromino
        drawParticles();
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

    function getRandomTetromino(): Tetromino {
        const tetrominoes = [
            [[1, 1, 1, 1]], // I
            [[1, 1, 1], [0, 1, 0]], // T
            [[1, 1, 1], [1, 0, 0]], // L
            [[1, 1, 1], [0, 0, 1]], // J
            [[1, 1], [1, 1]], // O
            [[1, 1, 0], [0, 1, 1]], // Z
            [[0, 1, 1], [1, 1, 0]]  // S
        ];
        const shape = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
        return {
            shape: shape,
            color: tetrominoColors[Math.floor(Math.random() * tetrominoColors.length)],
            x: Math.floor(cols / 2) - Math.floor(shape[0].length / 2),
            y: 0
        };
    }

    function checkCollision(tetromino: Tetromino): boolean {
        return tetromino.shape.some((row, i) => {
            return row.some((cell, j) => {
                return cell !== 0 && (tetromino.y + i >= rows || tetromino.x + j < 0 || tetromino.x + j >= cols || grid[tetromino.y + i][tetromino.x + j] !== 0);
            });
        });
    }

    function mergeTetromino(tetromino: Tetromino) {
        tetromino.shape.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell !== 0) {
                    grid[tetromino.y + i][tetromino.x + j] = tetrominoColors.indexOf(tetromino.color) + 1;
                    createParticles(tetromino.x + j, tetromino.y + i, tetromino.color);
                }
            });
        });
    }

    function clearRows(): number {
        let rowsCleared = 0;
        for (let row = rows - 1; row >= 0; row--) {
            if (grid[row].every(cell => cell !== 0)) {
                grid.splice(row, 1);
                grid.unshift(Array(cols).fill(0));
                rowsCleared++;
            }
        }
        return rowsCleared;
    }

    function createParticles(x: number, y: number, color: string) {
        for (let i = 0; i < 10; i++) {
            particles.push({
                x: x * cellSize + cellSize / 2,
                y: y * cellSize + cellSize / 2,
                color: color,
                radius: Math.random() * 2 + 1,
                dx: (Math.random() - 0.5) * 2,
                dy: (Math.random() - 0.5) * 2,
                life: 100
            });
        }
    }

    function drawParticles() {
        particles.forEach((particle, index) => {
            if (particle.life > 0) {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                particle.x += particle.dx;
                particle.y += particle.dy;
                particle.life -= 2;
            } else {
                particles.splice(index, 1);
            }
        });
    }

    function update(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;

        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            dropTetromino();
            dropCounter = 0;
        }

        drawGrid();
        requestAnimationFrame(update);
    }

    function dropTetromino() {
        currentTetromino.y++;
        if (checkCollision(currentTetromino)) {
            currentTetromino.y--;
            mergeTetromino(currentTetromino);
            const rowsCleared = clearRows();
            if (rowsCleared > 0) console.log(`${rowsCleared} rows cleared!`);
            currentTetromino = getRandomTetromino();
            if (checkCollision(currentTetromino)) {
                console.log('Game over!');
                return;
            }
        }
    }

    function moveTetrominoLeft() {
        currentTetromino.x--;
        if (checkCollision(currentTetromino)) currentTetromino.x++;
    }

    function moveTetrominoRight() {
        currentTetromino.x++;
        if (checkCollision(currentTetromino)) currentTetromino.x--;
    }

    function rotateTetromino() {
        const originalShape = currentTetromino.shape;
        const rotatedShape: number[][] = [];
        for (let i = 0; i < originalShape[0].length; i++) {
            let newRow: number[] = [];
            for (let j = originalShape.length - 1; j >= 0; j--) {
                newRow.push(originalShape[j][i]);
            }
            rotatedShape.push(newRow);
        }
        currentTetromino.shape = rotatedShape;
        if (checkCollision(currentTetromino)) currentTetromino.shape = originalShape;
    }

    function startGame() {
        grid = Array.from({ length: rows }, () => Array(cols).fill(0));
        currentTetromino = getRandomTetromino();
        requestAnimationFrame(update);
    }

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                moveTetrominoLeft();
                break;
            case 'ArrowRight':
                moveTetrominoRight();
                break;
            case 'ArrowDown':
                dropTetromino();
                break;
            case 'ArrowUp':
                rotateTetromino();
                break;
        }
    });

    startGame();
});
