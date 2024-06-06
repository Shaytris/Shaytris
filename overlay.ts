// Event listener for the "Settings" box
document.querySelectorAll('.box')[2].addEventListener('click', () => {
    // Show the black overlay when "Settings" is clicked
    const overlay = document.getElementById('settingsOverlay') as HTMLElement;
    overlay.style.display = 'block'; // Show the overlay
});
