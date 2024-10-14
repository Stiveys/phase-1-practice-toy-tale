// The code below ensures that students who are using CodeGrade will get credit
// for the code-along in Canvas; you can disregard it.

document.addEventListener('DOMContentLoaded', () => {
  fetchToys();
  document.getElementById('new-toy-btn').addEventListener('click', toggleToyForm);
  document.getElementById('add-toy-form').addEventListener('submit', addNewToy);
});

// Fetch toys from the API
function fetchToys() {
  fetch('http://localhost:3000/toys')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(toys => {
          const toyCollection = document.getElementById('toy-collection');
          toyCollection.innerHTML = ''; // Clear existing toys
          toys.forEach(renderToy);
      })
      .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
      });
}

// Render a single toy card
function renderToy(toy) {
  const toyCollection = document.getElementById('toy-collection');

  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  card.querySelector('.like-btn').addEventListener('click', () => increaseLikes(toy));
  toyCollection.appendChild(card);
}

// Toggle the new toy form
function toggleToyForm() {
  const form = document.querySelector('.add-toy-form');
  form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
}

// Add a new toy
function addNewToy(event) {
  event.preventDefault();

  const name = document.getElementById('toy-name').value;
  const image = document.getElementById('toy-image').value;

  const newToy = {
      name: name,
      image: image,
      likes: 0
  };

  fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
      },
      body: JSON.stringify(newToy)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(renderToy)
  .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
  });

  document.getElementById('add-toy-form').reset(); // Reset the form
  toggleToyForm(); // Hide the form
}

// Increase the likes of a toy
function increaseLikes(toy) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(updatedToy => {
      // Update the toy card in the DOM
      const card = document.querySelector(`.like-btn[id="${toy.id}"]`).parentElement;
      card.querySelector('p').innerText = `${updatedToy.likes} Likes`;
  })
  .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
  });
}