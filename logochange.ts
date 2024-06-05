// Function to move the spinning image to the left when clicked
document.getElementById('spinningImage')?.addEventListener('click', function(this: HTMLElement) {
  // Move the image to the left
  this.classList.add('moving'); // Add class to start the moving animation
});
