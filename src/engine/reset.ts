import { resetGame, updateResetBar } from './game';

let resetTimer: NodeJS.Timeout | null = null;
let resetStartTime: number | null = null;
const resetDuration = 3000; // 3 seconds
const resetBarContainer = document.querySelector('.reset-bar-container') as HTMLDivElement;
const resetBar = document.getElementById('resetBar') as HTMLDivElement;
const resetBarText = document.getElementById('resetBarText') as HTMLDivElement;

export function startReset() {
    if (resetTimer === null) {
        resetStartTime = Date.now();
        resetBarContainer.style.display = 'block';
        resetTimer = setInterval(updateResetBar, 100);
    }
}

export function stopReset() {
    if (resetTimer !== null) {
        clearInterval(resetTimer);
        resetTimer = null;
        resetBarContainer.style.display = 'none';
        resetBar.style.width = '0';
        resetBarText.textContent = '';
    }
}
