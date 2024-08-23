import { initGame } from './game';
import { handleKeydown, handleKeyup } from './input';

document.addEventListener("DOMContentLoaded", () => {
    initGame();
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);
});
