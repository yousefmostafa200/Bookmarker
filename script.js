'use strict';

// Selecting Elements
const nameInput = document.querySelector('#name');
const url = document.querySelector('#url');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('.btn-close-modal');
const createBtn = document.querySelector('#submit');

//  Function to open and close modal
function openModal() {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}

let bookmarks = [];
if (localStorage.bookmarks) {
  bookmarks = JSON.parse(localStorage.bookmarks);
}

// create bookmark function
function createMark() {
  let bookmark = {
    name: nameInput.value,
    url: url.value,
  };

  const nameRegex = /^[A-Za-z\s\-']{2,30}$/;
  const urlRegex =
    /^(?:(http|https):\/\/)?(?:www\.)?([^\s\/?\.@]+)\.(?:[a-z]{2,})\/?$/i;

  if (urlRegex.test(url.value) && nameRegex.test(nameInput.value)) {
    // that handle if the user enter a relative url so we add https to the url
    if (!/^https?:\/\//i.test(url.value)) {
      bookmark.url = 'http://' + url.value;
    } else {
      bookmark.url = url.value;
    }
    bookmarks.push(bookmark);

    // Clear inputs
    clear();

    // Save data
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // Disply Bookmarks
    displayBookmark();
  } else {
    openModal();
  }
}

// add createMark function to createbtn
createBtn.addEventListener('click', createMark);

// Display Bookmarks
function displayBookmark() {
  let html = '';
  bookmarks.forEach((bookmark, i) => {
    html += ` <tr>
              <td>${i + 1}</td>
              <td>${bookmark.name}</td>
              <td><button target='_blank' class='btn-visit btn' data-url=${
                bookmark.url
              }  id="visit"><i class="fa-solid fa-eye "></i> Visit
              </button></td>
              <td><button class='btn-delete btn' data-index=${i} id="delete"><i class="fa-solid fa-trash-can"></i> Delete
              </button></td>
            </tr>
        `;
  });
  document.querySelector('#tbody').innerHTML = html;

  let btnDelete = document.getElementById('deleteAllContainer');
  if (bookmarks.length) {
    btnDelete.innerHTML = `<button class="btn" id='deleteAll'>Delete All (${bookmarks.length})</button>`;
  } else {
    btnDelete.innerHTML = '';
  }
}
displayBookmark();

// Clear inputs
function clear() {
  nameInput.value = '';
  url.value = '';
}

// delete bookmark using(Event Delegation)
document.addEventListener('click', function (e) {
  const deleteButton = e.target.closest('#delete');
  if (deleteButton) {
    const index = deleteButton.dataset.index;
    bookmarks.splice(index, 1);
    localStorage.bookmarks = JSON.stringify(bookmarks);
    displayBookmark();
  }
});

// delete all bookmarks using(Event Delegation)
document.addEventListener('click', function (e) {
  const deleteAllBtn = e.target.closest('#deleteAll');
  if (deleteAllBtn) {
    bookmarks.splice(0);
    localStorage.clear();
    displayBookmark();
  }
});

// visit websit
document.addEventListener('click', function (e) {
  const visitButton = e.target.closest('#visit');
  if (visitButton) {
    const url = visitButton.dataset.url;
    window.open(url, '_blank');
  }
});

// Close Modal (first method)
closeModalBtn.addEventListener('click', closeModal);

// Close Modal (second method when you click the overlay)
overlay.addEventListener('click', closeModal);

// Close Modal (second method when you press the ESC)
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
