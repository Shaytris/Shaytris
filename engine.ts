// Written by Chlove for Shaytris under the MIT licence.
document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('tetrisCanvas') as HTMLCanvasElement;
    const holdCanvas = document.getElementById('holdCanvas') as HTMLCanvasElement;
    const nextCanvas = document.getElementById('nextCanvas') as HTMLCanvasElement;
    const resetBarContainer = document.querySelector('.reset-bar-container') as HTMLDivElement;
    const resetBar = document.getElementById('resetBar') as HTMLDivElement;
    const resetBarText = document.getElementById('resetBarText') as HTMLDivElement;

    if (!canvas || !holdCanvas || !nextCanvas || !resetBarContainer || !resetBar || !resetBarText) {
        console.error("Canvas element not found!");
        return;
    }

    const ctx = canvas.getContext('2d');
    const holdCtx = holdCanvas.getContext('2d');
    const nextCtx = nextCanvas.getContext('2d');
    const cols = 10;
    const rows = 20;
    const cellSize = canvas.width / cols;
    const tetrominoColors: string[] = ['#00FFFF', '#FFFF00', '#800080', '#00FF00', '#FF0000', '#0000FF', '#FFA500'];
    const tetrominoShapes: number[][][] = [
        [[1, 1, 1, 1]], // I (cyan)
        [[1, 1], [1, 1]], // O (yellow)
        [[0, 1, 0], [1, 1, 1]], // T (purple)
        [[0, 1, 1], [1, 1, 0]], // S (green)
        [[1, 1, 0], [0, 1, 1]], // Z (red)
        [[1, 1, 1], [0, 0, 1]], // J (blue)
        [[1, 1, 1], [1, 0, 0]] // L (orange)
    ];
    let grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
    let currentTetromino: Tetromino;
    let heldTetromino: Tetromino | null = null;
    let nextTetrominoes: Tetromino[] = [];
    let canHold = true;
    let lastTime = 0;
    let dropCounter = 0;
    let dropInterval = 1000;
    const particles: Particle[] = [];
    let bag: number[] = [];
    let resetTimer: NodeJS.Timeout | null = null;
    let resetStartTime: number | null = null;
    const resetDuration = 3000; // 3 seconds

    interface Tetromino {
        shape: number[][];
        color: string;
        x: number;
        y: number;
    }

    interface Particle {
        x: number;
        y: number;
        size: number;
        dx: number;
        dy: number;
        color: string;
    }

    function initBag() {
        bag = shuffle([0, 1, 2, 3, 4, 5, 6]);  // Initial shuffled bag
    }

    function getNextTetromino(): Tetromino {
        if (bag.length === 0) {
            initBag();
        }
        const index = bag.pop()!;
        return {
            shape: tetrominoShapes[index],
            color: tetrominoColors[index],
            x: Math.floor(cols / 2) - Math.floor(tetrominoShapes[index][0].length / 2),
            y: 0
        };
    }

    function shuffle(array: number[]): number[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function drawGrid() {
        if (!ctx) return;
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
        drawGhostPiece();
        drawTetromino(currentTetromino);
        drawParticles();
        drawHold();
        drawNext();
    }

    function drawTetromino(tetromino: Tetromino) {
        if (!ctx) return;
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

    function drawSmallTetromino(ctx: CanvasRenderingContext2D, tetromino: Tetromino, xOffset: number, yOffset: number, cellSize: number) {
        tetromino.shape.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell !== 0) {
                    ctx.fillStyle = tetromino.color;
                    ctx.fillRect(xOffset + j * cellSize, yOffset + i * cellSize, cellSize, cellSize);
                    ctx.strokeStyle = '#333';
                    ctx.strokeRect(xOffset + j * cellSize, yOffset + i * cellSize, cellSize, cellSize);
                }
            });
        });
    }

    function drawHold() {
        if (!holdCtx) return;
        holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
        if (heldTetromino) {
            drawSmallTetromino(holdCtx, heldTetromino, 0, 0, holdCanvas.width / 4);
        }
    }

    function drawNext() {
        if (!nextCtx) return;
        nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
        nextTetrominoes.forEach((tetromino, index) => {
            drawSmallTetromino(nextCtx, tetromino, 0, index * 100, nextCanvas.width / 4);
        });
    }

    function drawGhostPiece() {
        if (!ctx || !currentTetromino) return;
        const ghost = {
            shape: currentTetromino.shape,
            color: currentTetromino.color,
            x: currentTetromino.x,
            y: currentTetromino.y
        };
        while (!checkCollision(ghost)) {
            ghost.y++;
        }
        ghost.y--; // Move back up to the last valid position

        ghost.shape.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell !== 0) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fillRect((ghost.x + j) * cellSize, (ghost.y + i) * cellSize, cellSize, cellSize);
                    ctx.strokeStyle = '#333';
                    ctx.strokeRect((ghost.x + j) * cellSize, (ghost.y + i) * cellSize, cellSize, cellSize);
                }
            });
        });
    }

    function dropTetromino() {
        if (!currentTetromino) return;
        currentTetromino.y++;
        if (checkCollision(currentTetromino)) {
            currentTetromino.y--;
            if (isTSpin()) {
                console.log("T-Spin detected!");
            }
            merge(currentTetromino);
            resetTetromino();
            clearRows();
        }
        dropCounter = 0;
    }

    function hardDrop() {
        if (!currentTetromino) return;
        while (!checkCollision(currentTetromino)) {
            currentTetromino.y++;
        }
        currentTetromino.y--; // Move back up to the last valid position
        if (isTSpin()) {
            console.log("T-Spin detected!");
        }
        merge(currentTetromino);
        resetTetromino();
        clearRows();
    }

    function checkCollision(tetromino: Tetromino): boolean {
        for (let i = 0; i < tetromino.shape.length; i++) {
            for (let j = 0; j < tetromino.shape[i].length; j++) {
                if (tetromino.shape[i][j] !== 0) {
                    const x = tetromino.x + j;
                    const y = tetromino.y + i;
                    if (x < 0 || x >= cols || y >= rows || (y >= 0 && grid[y][x] !== 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function isTSpin(): boolean {
        if (!currentTetromino || currentTetromino.shape !== tetrominoShapes[2]) return false; // Only check for T-tetromino
        const corners = [
            { x: currentTetromino.x, y: currentTetromino.y },
            { x: currentTetromino.x + 2, y: currentTetromino.y },
            { x: currentTetromino.x, y: currentTetromino.y + 2 },
            { x: currentTetromino.x + 2, y: currentTetromino.y + 2 }
        ];
        let occupiedCorners = 0;
        for (const corner of corners) {
            if (corner.y >= 0 && corner.y < rows && corner.x >= 0 && corner.x < cols && grid[corner.y][corner.x] !== 0) {
                occupiedCorners++;
            }
        }
        return occupiedCorners >= 3;
    }

    function merge(tetromino: Tetromino) {
        tetromino.shape.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell !== 0) {
                    grid[tetromino.y + i][tetromino.x + j] = tetrominoColors.indexOf(tetromino.color) + 1;
                }
            });
        });
    }

    function resetTetromino() {
        currentTetromino = getNextTetromino();
        if (checkCollision(currentTetromino)) {
            resetGame();
        }
        canHold = true;
    }

    function drawParticles() {
        if (!ctx) return;
        particles.forEach((particle, index) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            ctx.closePath();
            
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.size *= 0.96; // Shrink over time
            
            if (particle.size < 0.2) {
                particles.splice(index, 1);
            }
        });
    }

    function clearRows() {
        outer: for (let row = rows - 1; row >= 0; row--) {
            for (let col = 0; col < cols; col++) {
                if (grid[row][col] === 0) {
                    continue outer;
                }
            }
            grid.splice(row, 1);
            grid.unshift(Array(cols).fill(0));
            generateParticles(row);
        }
    }

    function generateParticles(row: number) {
        for (let col = 0; col < cols; col++) {
            for (let i = 0; i < 10; i++) {
                particles.push({
                    x: col * cellSize + cellSize / 2,
                    y: row * cellSize + cellSize / 2,
                    size: Math.random() * 5 + 2,
                    dx: (Math.random() - 0.5) * 2,
                    dy: (Math.random() - 0.5) * 2,
                    color: tetrominoColors[grid[row][col] - 1]
                });
            }
        }
    }

    function update(deltaTime: number) {
        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            dropTetromino();
        }
        drawGrid();
    }

    function loop(timestamp: number) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        update(deltaTime);
        requestAnimationFrame(loop);
    }

    function handleKeydown(event: KeyboardEvent) {
        switch(event.code) {
            case 'ArrowLeft':
                moveTetromino(-1);
                break;
            case 'ArrowRight':
                moveTetromino(1);
                break;
            case 'ArrowDown':
                dropTetromino();
                break;
            case 'ArrowUp':
                rotateTetromino();
                break;
            case 'Space':
                hardDrop();
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                holdTetromino();
                break;
            case 'KeyR':
                if (resetTimer === null) {
                    resetStartTime = Date.now();
                    resetBarContainer.style.display = 'block';
                    resetTimer = setInterval(updateResetBar, 100);
                }
                break;
        }
    }

    function handleKeyup(event: KeyboardEvent) {
        if (event.code === 'KeyR') {
            if (resetTimer !== null) {
                clearInterval(resetTimer);
                resetTimer = null;
                resetBarContainer.style.display = 'none';
                resetBar.style.width = '0';
                resetBarText.textContent = '';
            }
        }
    }

    function moveTetromino(direction: number) {
        if (!currentTetromino) return;
        currentTetromino.x += direction;
        if (checkCollision(currentTetromino)) {
            currentTetromino.x -= direction;
        }
        drawGrid();
    }

    function rotateTetromino() {
        if (!currentTetromino) return;
        const originalShape = currentTetromino.shape;
        currentTetromino.shape = rotateMatrix(currentTetromino.shape);
        if (checkCollision(currentTetromino)) {
            currentTetromino.shape = originalShape;
        }
        drawGrid();
    }

    function rotateMatrix(matrix: number[][]): number[][] {
        return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
    }

    function holdTetromino() {
        if (!canHold) return;
        if (heldTetromino) {
            [heldTetromino, currentTetromino] = [currentTetromino, heldTetromino];
            currentTetromino.x = Math.floor(cols / 2) - Math.floor(currentTetromino.shape[0].length / 2);
            currentTetromino.y = 0;
        } else {
            heldTetromino = currentTetromino;
            currentTetromino = getNextTetromino();
        }
        canHold = false;
        drawGrid();
    }

    function updateResetBar() {
        const elapsed = Date.now() - resetStartTime!;
        const remaining = Math.max(0, resetDuration - elapsed);
        const percentage = (remaining / resetDuration) * 100;
        resetBar.style.width = `${percentage}%`;
        resetBarText.textContent = `${Math.ceil(remaining / 1000)}s`;

        if (remaining <= 0) {
            clearInterval(resetTimer!);
            resetTimer = null;
            resetBarContainer.style.display = 'none';
            resetBar.style.width = '0';
            resetBarText.textContent = '';
            resetGame();
        }
    }

    function resetGame() {
        grid = Array.from({ length: rows }, () => Array(cols).fill(0));
        particles.length = 0;
        nextTetrominoes = [getNextTetromino(), getNextTetromino(), getNextTetromino(), getNextTetromino(), getNextTetromino()];
        resetTetromino();
        drawGrid();
    }

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    // Initialize game
    initBag();
    nextTetrominoes = [getNextTetromino(), getNextTetromino(), getNextTetromino(), getNextTetromino(), getNextTetromino()];
    resetTetromino();
    requestAnimationFrame(loop);
});
