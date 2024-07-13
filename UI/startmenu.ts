window.addEventListener('mousemove', (e: MouseEvent) => {
    const image = document.querySelector('.center-image') as HTMLElement;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const offsetX = (mouseX / windowWidth - 0.5) * 20; // Adjust 20 to change the sensitivity
    const offsetY = (mouseY / windowHeight - 0.5) * 20; // Adjust 20 to change the sensitivity

    image.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`;
});

document.addEventListener('visibilitychange', () => {
    const background = document.querySelector('.background') as HTMLElement;
    if (document.hidden) {
        background.style.filter = 'blur(20px)'; // Adjust the blur value as needed
    } else {
        background.style.filter = 'blur(0)';
    }
});

window.addEventListener('resize', () => {
    const image = document.querySelector('.center-image') as HTMLElement;
    const windowWidth = window.innerWidth;

    if (windowWidth < 600) {
        image.style.width = '60%'; // Adjust size for small screens
    } else if (windowWidth < 900) {
        image.style.width = '50%'; // Adjust size for medium screens
    } else {
        image.style.width = '40%'; // Default size for large screens
    }
});

// Trigger resize event to set the initial size
window.dispatchEvent(new Event('resize'));
