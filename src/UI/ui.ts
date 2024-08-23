window.addEventListener('mousemove', (e: MouseEvent) => {
    const image = document.querySelector<HTMLImageElement>('.center-image');
    if (!image) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const offsetX = (mouseX / windowWidth - 0.5) * 20; 
    const offsetY = (mouseY / windowHeight - 0.5) * 20;

    image.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`;
});

document.addEventListener('visibilitychange', () => {
    const background = document.querySelector<HTMLElement>('.background');
    if (!background) return; 

    if (document.hidden) {
        background.style.filter = 'blur(20px)';
    } else {
        background.style.filter = 'blur(0)';
    }
});

window.addEventListener('resize', () => {
    const image = document.querySelector<HTMLElement>('.center-image');
    if (!image) return;

    const windowWidth = window.innerWidth;
    
    if (windowWidth < 600) {
        image.style.width = '30%'; 
    } else if (windowWidth < 900) {
        image.style.width = '30%'; 
    } else {
        image.style.width = '30%'; 
    }
});

window.dispatchEvent(new Event('resize'));

function isElectron(): boolean {
    return navigator.userAgent.toLowerCase().includes('electron');
}

function updateButtonVisibility() {
    const fourthBox = document.querySelectorAll<HTMLElement>('.box')[3];
    if (!fourthBox) return; 

    if (isElectron()) {
        fourthBox.style.display = 'flex'; 
    } else {
        fourthBox.style.display = 'none'; 
    }
}

updateButtonVisibility();

document.getElementById('logo')?.addEventListener('click', () => {
    const logo = document.getElementById('logo');
    const boxContainer = document.getElementById('boxContainer');
    const extraButtons = document.getElementById('extraButtons');

    if (!logo || !boxContainer || !extraButtons) return;

    logo.classList.add('moved');

    boxContainer.style.left = 'calc(40% + 300px)';
    boxContainer.classList.add('show');

    extraButtons.style.display = 'block';
});
