        document.addEventListener("DOMContentLoaded", function() {
            const canvas = document.getElementById('tetrisCanvas');
            if (!canvas) {
                console.error("Canvas element not found!");
                return;
            }
            const ctx = canvas.getContext('2d');
            const cols = 10;
            const rows = 20;
            const cellSize = canvas.width / cols;
            const tetrominoColors = ['#00FFFF', '#FFFF00', '#800080', '#00FF00', '#FF0000', '#0000FF', '#FFA500']; // Updated colors
            const tetrominoShapes = [
                [[1, 1, 1, 1]], // I (cyan)
                [[1, 1], [1, 1]], // O (yellow)
                [[0, 1, 0], [1, 1, 1]], // T (purple)
                [[0, 1, 1], [1, 1, 0]], // S (green)
                [[1, 1, 0], [0, 1, 1]], // Z (red)
                [[1, 1, 1], [0, 0, 1]], // J (blue)
                [[1, 1, 1], [1, 0, 0]] // L (orange)
            ];
            let grid = Array.from({ length: rows }, () => Array(cols).fill(0));
            let currentTetromino;
            let heldTetromino = null;
            let canHold = true;
            let lastTime = 0;
            let dropCounter = 0;
            let dropInterval = 1000;

            const particles = [];
            let bag = [];

            function initBag() {
                bag = shuffle([0, 1, 2, 3, 4, 5, 6]);  // Initial shuffled bag
            }

            function getNextTetromino() {
                if (bag.length === 0) {
                    initBag();
                }
                const index = bag.pop();
                return {
                    shape: tetrominoShapes[index],
                    color: tetrominoColors[index],
                    x: Math.floor(cols / 2) - Math.floor(tetrominoShapes[index][0].length / 2),
                    y: 0
                };
            }

            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

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
                drawTetromino(currentTetromino);
                drawParticles();
            }

            function drawTetromino(tetromino) {
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

            function checkCollision(tetromino) {
                return tetromino.shape.some((row, i) => {
                    return row.some((cell, j) => {
                        return cell !== 0 && (tetromino.y + i >= rows || tetromino.x + j < 0 || tetromino.x + j >= cols || grid[tetromino.y + i][tetromino.x + j] !== 0);
                    });
                });
            }

            function mergeTetromino(tetromino) {
                tetromino.shape.forEach((row, i) => {
                    row.forEach((cell, j) => {
                        if (cell !== 0) {
                            grid[tetromino.y + i][tetromino.x + j] = tetrominoColors.indexOf(tetromino.color) + 1;
                            createParticles((tetromino.x + j) * cellSize + cellSize / 2, (tetromino.y + i) * cellSize + cellSize / 2, tetromino.color);
                        }
                    });
                });
            }

            function clearRows() {
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

            function createParticles(x, y, color) {
                for (let i = 0; i < 10; i++) {
                    particles.push({
                        x: x,
                        y: y,
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
                    currentTetromino = getNextTetromino();
                    canHold = true;
                    if (checkCollision(currentTetromino)) {
                        console.log('Game over!');
                        return;
                    }
                }
            }

            function hardDropTetromino() {
                while (!checkCollision(currentTetromino)) {
                    currentTetromino.y++;
                }
                currentTetromino.y--;
                mergeTetromino(currentTetromino);
                const rowsCleared = clearRows();
                if (rowsCleared > 0) console.log(`${rowsCleared} rows cleared!`);
                currentTetromino = getNextTetromino();
                canHold = true;
                if (checkCollision(currentTetromino)) {
                    console.log('Game over!');
                    return;
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
                const rotatedShape = [];
                for (let i = 0; i < originalShape[0].length; i++) {
                    let newRow = [];
                    for (let j = originalShape.length - 1; j >=
                    0; j--) {
                        newRow.push(originalShape[j][i]);
                    }
                    rotatedShape.push(newRow);
                }
                currentTetromino.shape = rotatedShape;
                if (checkCollision(currentTetromino)) {
                    currentTetromino.shape = originalShape;
                }
            }

            function holdTetromino() {
                if (canHold) {
                    canHold = false;
                    if (heldTetromino === null) {
                        heldTetromino = currentTetromino;
                        currentTetromino = getNextTetromino();
                    } else {
                        const temp = heldTetromino;
                        heldTetromino = currentTetromino;
                        currentTetromino = temp;
                        currentTetromino.x = Math.floor(cols / 2) - Math.floor(currentTetromino.shape[0].length / 2);
                        currentTetromino.y = 0;
                    }
                }
            }

            document.addEventListener('keydown', event => {
                switch (event.key) {
                    case 'ArrowLeft':
                        moveTetrominoLeft();
                        break;
                    case 'ArrowRight':
                        moveTetrominoRight();
                        break;
                    case 'ArrowUp':
                        rotateTetromino();
                        break;
                    case 'ArrowDown':
                        dropTetromino();
                        break;
                    case ' ':
                        hardDropTetromino();
                        break;
                    case 'c':
                        holdTetromino();
                        break;
                }
            });

            initBag();
            currentTetromino = getNextTetromino();
            update();
        });
