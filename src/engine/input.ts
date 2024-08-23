import { moveTetromino, rotateTetromino, hardDrop, holdTetromino } from './movement';
import { startReset, stopReset } from './reset';

export function handleKeydown(event: KeyboardEvent) {
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
            startReset();
            break;
    }
}

export function handleKeyup(event: KeyboardEvent) {
    if (event.code === 'KeyR') {
        stopReset();
    }
}
