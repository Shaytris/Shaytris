export interface Tetromino {
    shape: number[][];
    color: string;
    x: number;
    y: number;
}

let bag: number[] = [];

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

export function initBag() {
    bag = shuffle([0, 1, 2, 3, 4, 5, 6]);
}

export function getNextTetromino(): Tetromino {
    if (bag.length === 0) {
        initBag();
    }
    const index = bag.pop()!;
    return {
        shape: tetrominoShapes[index],
        color: tetrominoColors[index],
        x: 4, // Centered at the top of the grid
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
