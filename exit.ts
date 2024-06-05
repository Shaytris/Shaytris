// Event listener for the "Exit" box
const exitBox = document.querySelectorAll('.box')[3] as HTMLElement;
exitBox.addEventListener('click', () => {
  // Redirect to a blank page to effectively close the tab
  window.location.href = 'about:blank';
});
