const boxes = document.querySelectorAll('.box') as NodeListOf<HTMLElement>;
boxes.forEach((box) => {
  box.addEventListener('click', () => {
    const spinningImage = document.querySelector('.spinning') as HTMLElement;
    spinningImage.classList.remove('spinning');
  });
});
