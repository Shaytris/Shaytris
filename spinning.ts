// Function to start spinning every 4 seconds after a delay of 7 seconds
function startSpinning() {
  const spinningImage = document.getElementById('spinningImage') as HTMLElement;
  setTimeout(() => {
    spinningImage.classList.add('spinning'); // Add spinning class
    setInterval(() => {
      spinningImage.classList.toggle('spinning'); // Toggle spinning class every 4 seconds
    }, 4000); // Spin every 4 seconds
  }, 7000); // Start spinning 7 seconds after page load
}

// Initial call to start spinning
startSpinning();
