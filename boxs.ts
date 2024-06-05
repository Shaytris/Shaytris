// Create and append four boxes
const container = document.createElement('div');
container.classList.add('container');
for (let i = 0; i < 4; i++) {
  const box = document.createElement('div');
  box.classList.add('box');
  box.setAttribute('data-index', i.toString()); // Set a unique identifier for each box
  const image = document.createElement('img');
  image.src = 'https://via.placeholder.com/80'; // Placeholder image URL
  box.appendChild(image);
  const text = document.createElement('div');
  text.innerText = boxTexts[i]; // Assign text from the array
  box.appendChild(text);
  container.appendChild(box);
}
document.body.appendChild(container);
