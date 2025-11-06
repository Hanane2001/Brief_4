let cardsData = [];
const cardsPerPage = 9;
let currentPage = 1;
let currentPageFav = 1;
let currentPageDeck = 1;

const cardContainer = document.getElementById("card-container");
const favContainer = document.getElementById("favorite-card-container");
const deckContainer = document.getElementById("card-container-order");
const cardCategory = document.getElementById('category');
const paginationContainer = document.getElementById("pagination");
const paginationFavContainer = document.getElementById("pagination-fav");
const paginationDeckContainer = document.getElementById("pagination-deck");

// Chargement des données pour la page market
if (cardContainer) {
  fetch('js/pokemondata1.json')
    .then(response => {
      if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
      return response.json();
    })
    .then(data => {
      cardsData = data;
      renderCard(cardsData, currentPage);
    })
    .catch(error => console.error('Error while loading cards :', error));
}

// Fonction principale pour afficher les cartes
function renderCard(data, page = 1) {
  if (!cardContainer) return;

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const paginatedData = data.slice(start, end);

  cardContainer.innerHTML = "";
  paginatedData.forEach(card => {
    cardContainer.innerHTML += `
      <div>
        <div class="border-7 rounded-lg border-[var(--btn-color)] w-61 relative" id="id${card.id}">
          <div class="flex">
            <img class="w-50 h-50" src="${card.image}" alt="${card.name}">
            <h1 class="absolute top-0 right-0 w-8 h-8 bg-[#374151] rounded-full text-[var(--bg-color)] font-bold text-center">${card.number}</h1>
          </div>
          <div class="flex flex-col bg-gray-100 pl-[15px] pt-[15px] pb-[15px]">
            <div class="flex gap-10">
              <h1 class="text-[var(--btn-color)] font-extrabold">${card.name}</h1>
              <h2 class="bg-[#374151] w-20 h-7 rounded-full text-[var(--bg-color)] font-bold text-center">
                ${card.types ? card.types[0] : ''}
              </h2>
            </div>
            <p class="text-gray-500">${card.classification || ''}</p>
            <div class="grid grid-cols-3">
              <p class="font-light">HP <span class="text-gray-700 font-bold">${card.maxHP || ''}</span></p>
              <p class="font-light">CP <span class="text-gray-700 font-bold">${card.maxCP || ''}</span></p>
              <p class="font-light">W <span class="text-gray-700 font-bold">${card.fleeRate || ''}</span></p>
              <p class="flex"><img src="img/shield.png" alt="shield"><span class="text-gray-700 font-bold">${card.resistant ? card.resistant[0] : ''}</span></p>
              <p class="flex"><img src="img/shield.png" alt="shield"><span class="text-gray-700 font-bold">${card.resistant ? card.resistant[1] : ''}</span></p>
              <p class="flex"><img src="img/trending_down.png" alt="trending_down"><span class="text-gray-700 font-bold">${card.weaknesses ? card.weaknesses[0] : ''}</span></p>
            </div>
          </div>
        </div>
        <div class="text-center font-bold">
          <p>Rare: ${card.Rare || ''}</p>
          <p>${card.Descreption || ''}</p>
          <p>${card.prix}$</p>
        </div>
        <div class="flex justify-between">
          <button class="favourite-button bg-[var(--btn-color)] text-[var(--bg-color)] rounded-sm p-2 hover:bg-[var(--color-text)]" value="${card.id}">Favoris</button>
          <button class="panier-button bg-[var(--color-text)] text-[var(--bg-color)] rounded-sm p-2 hover:bg-[var(--btn-color)]" value="${card.id}">Add To Cart</button>
        </div>
      </div>
    `;
  });

  attachCardEvents(data);
  renderPagination(data.length, page, paginationContainer, currentPage, (newPage) => {
    currentPage = newPage;
    renderCard(data, newPage);
  });
}

// Fonction pour afficher les favoris avec pagination
function renderFavoriteCards(page = 1) {
  if (!favContainer) return;

  const favCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];
  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const paginatedData = favCards.slice(start, end);

  if (paginatedData.length === 0) {
    favContainer.innerHTML = `<p class="text-center text-gray-500 text-lg">No card in your favorites</p>`;
    if (paginationFavContainer) paginationFavContainer.innerHTML = '';
    return;
  }

  favContainer.innerHTML = '';
  paginatedData.forEach((card, index) => {
    const actualIndex = start + index;
    favContainer.innerHTML += `
      <div>
        <div class="border-7 rounded-lg border-[var(--btn-color)] w-61 relative" id="id${card.id}">
          <div class="flex">
            <img class="w-50 h-50" src="${card.image}" alt="Card-image">
            <h1 class="absolute top-0 right-0 w-8 h-8 bg-[#374151] rounded-full text-[var(--bg-color)] font-bold text-center">
              ${card.number || ''}
            </h1>
          </div>
          <div class="flex flex-col bg-gray-100 pl-[15px] pt-[15px] pb-[15px]">
            <div class="flex gap-10">
              <h1 class="text-[var(--btn-color)] font-extrabold">${card.name}</h1>
              <h2 class="bg-[#374151] w-20 h-7 rounded-full text-[var(--bg-color)] font-bold text-center">
                ${card.types ? card.types[0] : ''}
              </h2>
            </div>
            <p class="text-gray-500">${card.classification || ''}</p>
            <div class="grid grid-cols-3">
              <p class="font-light">HP<span class="text-gray-700 font-bold">${card.maxHP || ''}</span></p>
              <p class="font-light">CP<span class="text-gray-700 font-bold">${card.maxCP || ''}</span></p>
              <p class="font-light">W<span class="text-gray-700 font-bold">${card.fleeRate || ''}</span></p>
            </div>
          </div>
        </div>
        <div class="text-center font-bold">
          <p>Rare: ${card.Rare || ''}</p>
          <p>${card.Descreption || ''}</p>
          <p>${card.prix || 0}$</p>
        </div>
        <div class="flex justify-between">
          <button class="remove-favourite bg-[var(--btn-color)] text-[var(--bg-color)] rounded-sm p-2 hover:bg-[var(--color-text)]" data-index="${actualIndex}">Remove</button>
          <button class="panier-button bg-[var(--color-text)] text-[var(--bg-color)] rounded-sm p-2 hover:bg-[var(--btn-color)]" value="${card.id}">Add To Cart</button>
        </div>
      </div>
    `;
  });

  // Événements pour les favoris
  document.querySelectorAll('.remove-favourite').forEach(btn => {
    btn.addEventListener('click', () => {
      const favCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];
      const index = parseInt(btn.getAttribute('data-index'));
      favCards.splice(index, 1);
      localStorage.setItem("userFavouriteCards", JSON.stringify(favCards));
      renderFavoriteCards(currentPageFav);
    });
  });

  document.querySelectorAll('.panier-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const favCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];
      const userCards = JSON.parse(localStorage.getItem("usercards")) || [];
      const card = favCards.find(c => c.id == btn.value);
      if (!card) return;
      if (userCards.some(c => c.id == card.id)) return alert("This card is already in your cart");
      const cardForCart = { ...card, currentQty: 1, prix: card.prix || 10 };
      userCards.push(cardForCart);
      localStorage.setItem("usercards", JSON.stringify(userCards));
      alert(`"${card.name}" has been added to your cart`);
      if (typeof renderMyCard === "function") renderMyCard();
    });
  });

  // Pagination pour les favoris
  if (paginationFavContainer) {
    renderPagination(favCards.length, page, paginationFavContainer, currentPageFav, (newPage) => {
      currentPageFav = newPage;
      renderFavoriteCards(newPage);
    });
  }
}

// Fonction pour afficher le deck avec pagination
function renderDeckCards(page = 1) {
  if (!deckContainer) return;

  const userCards = JSON.parse(localStorage.getItem("usercards")) || [];
  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const paginatedData = userCards.slice(start, end);

  if (paginatedData.length === 0) {
    deckContainer.innerHTML = `<p class="text-center text-gray-500 text-xl font-semibold mt-10">You haven't bought any cards yet</p>`;
    if (paginationDeckContainer) paginationDeckContainer.innerHTML = '';
    return;
  }

  deckContainer.innerHTML = '';
  paginatedData.forEach((card, index) => {
    const actualIndex = start + index;
    deckContainer.innerHTML += `
      <div>
        <div class="border-7 rounded-lg border-[var(--btn-color)] w-61 relative" id="id${card.id}">
          <div class="flex">
            <img class="w-50 h-50" src="${card.image}" alt="Card-image">
            <h1 class="absolute top-0 right-0 w-8 h-8 bg-[#374151] rounded-full text-[var(--bg-color)] font-bold text-center">
              ${card.number || ''}
            </h1>
          </div>
          <div class="flex flex-col bg-gray-100 pl-[15px] pt-[15px] pb-[15px]">
            <div class="flex gap-10">
              <h1 class="text-[var(--btn-color)] font-extrabold">${card.name}</h1>
              <h2 class="bg-[#374151] w-20 h-7 rounded-full text-[var(--bg-color)] font-bold text-center">
                ${card.types ? card.types[0] : ''}
              </h2>
            </div>
            <p class="text-gray-500">${card.classification || ''}</p>
            <div class="grid grid-cols-3">
              <p class="font-light">HP<span class="text-gray-700 font-bold">${card.maxHP || ''}</span></p>
              <p class="font-light">CP<span class="text-gray-700 font-bold">${card.maxCP || ''}</span></p>
              <p class="font-light">W<span class="text-gray-700 font-bold">${card.fleeRate || ''}</span></p>
              <p class="flex"><img src="img/shield.png" alt="shield"><span class="text-gray-700 font-bold">${card.resistant ? card.resistant[0] : ''}</span></p>
              <p class="flex"><img src="img/shield.png" alt="shield"><span class="text-gray-700 font-bold">${card.resistant ? card.resistant[1] : ''}</span></p>
              <p class="flex"><img src="img/trending_down.png" alt="trending_down"><span class="text-gray-700 font-bold">${card.weaknesses ? card.weaknesses[0] : ''}</span></p>
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-[5%]">
          <button class="sell-button bg-[var(--btn-color)] text-[var(--bg-color)] rounded-sm p-2 hover:bg-[var(--color-text)]" data-index="${actualIndex}">Sell</button>
          <button class="fav-button bg-[var(--color-text)] text-[var(--bg-color)] rounded-sm p-2 hover:bg-[var(--btn-color)]" data-id="${card.id}">Favorite</button>
        </div>
      </div>
    `;
  });

  // Événements pour le deck
  document.querySelectorAll(".sell-button").forEach(button => {
    button.addEventListener("click", e => {
      const index = parseInt(e.target.dataset.index);
      const userCards = JSON.parse(localStorage.getItem("usercards")) || [];
      const soldCard = userCards[index];
      alert(`You sold the card "${soldCard.name}"`);
      userCards.splice(index, 1);
      localStorage.setItem("usercards", JSON.stringify(userCards));
      renderDeckCards(currentPageDeck);
    });
  });

  document.querySelectorAll(".fav-button").forEach(button => {
    button.addEventListener("click", e => {
      const id = e.target.dataset.id;
      const userCards = JSON.parse(localStorage.getItem("usercards")) || [];
      const card = userCards.find(c => c.id == id);
      if (!card) return;
      let favCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];
      if (!favCards.some(fav => fav.id == card.id)) {
        favCards.push(card);
        localStorage.setItem("userFavouriteCards", JSON.stringify(favCards));
        alert(`"${card.name}" has been added to your favorites`);
      } else alert(`"${card.name}" is already in your favorites!`);
    });
  });

  // Pagination pour le deck
  if (paginationDeckContainer) {
    renderPagination(userCards.length, page, paginationDeckContainer, currentPageDeck, (newPage) => {
      currentPageDeck = newPage;
      renderDeckCards(newPage);
    });
  }
}

// Fonction générique de pagination
function renderPagination(totalCards, page, container, currentPage, onPageChange) {
  if (!container) return;

  const totalPages = Math.ceil(totalCards / cardsPerPage);
  let html = '';

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  html += `
    <button id="prev-page" class="w-40 h-15 p-2 bg-white rounded-sm shadow-lg flex items-center justify-center self-center hover:bg-gray-100 transition cursor-pointer max-md:w-[15%] max-md:h-10" ${page === 1 ? 'disabled' : ''}>
      <img class="w-10 h-10" src="img/icons8-left-arrow-50.png" alt="left-arrow">
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn w-[15%] h-15 p-2 bg-[var(--btn-color)] text-[var(--bg-color)] rounded-full shadow-lg flex items-center justify-center self-center hover:bg-gray-100 hover:text-[var(--btn-color)] cursor-pointer max-md:w-[10%] max-md:h-10 ${i === page ? 'border-2 border-[var(--color-text)]' : ''}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  html += `
    <button id="next-page" class="w-40 h-15 p-2 bg-white rounded-sm shadow-lg flex items-center justify-center self-center hover:bg-gray-100 transition cursor-pointer max-md:w-[15%] max-md:h-10" ${page === totalPages ? 'disabled' : ''}>
      <img class="w-10 h-10" src="img/icons8-right-arrow-50.png" alt="right-arrow">
    </button>
  `;

  container.innerHTML = html;

  document.querySelectorAll(".page-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedPage = parseInt(btn.getAttribute("data-page"));
      onPageChange(selectedPage);
    });
  });

  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (page > 1) {
        onPageChange(page - 1);
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (page < totalPages) {
        onPageChange(page + 1);
      }
    });
  }
}

function attachCardEvents(data) {
  const payButtons = document.querySelectorAll('.panier-button');
  const favButtons = document.querySelectorAll('.favourite-button');

  payButtons.forEach(button => {
    button.addEventListener('click', () => {
      let userCards = JSON.parse(localStorage.getItem("usercards")) || [];
      let card = data.find(c => c.id == button.value);
      if (!card) return;

      if (card.quantity <= 0) return alert("This card is out of stock!");
      if (userCards.some(c => c.id == card.id)) return alert("You can't add the same card twice!");

      userCards.push(card);
      localStorage.setItem("usercards", JSON.stringify(userCards));
      alert("Card added to your panier!");
      if (typeof renderMyCard === "function") renderMyCard();
    });
  });

  favButtons.forEach(button => {
    button.addEventListener('click', () => {
      let favCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];
      let card = data.find(c => c.id == button.value);
      if (!card) return;
      if (favCards.some(c => c.id == card.id)) return alert("You already added this card to favourites!");
      favCards.push(card);
      localStorage.setItem("userFavouriteCards", JSON.stringify(favCards));
      alert("Card added to your favourites!");
    });
  });
}

if (cardCategory) {
  cardCategory.addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
      const type = e.target.value;
      if (type === "all") renderCard(cardsData);
      else {
        const filtrageData = cardsData.filter(card => card.MRarty === type);
        renderCard(filtrageData);
      }
    }
  });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser les favoris si on est sur la page favoris
  if (favContainer) {
    renderFavoriteCards(currentPageFav);
  }

  // Initialiser le deck si on est sur la page deck
  if (deckContainer) {
    renderDeckCards(currentPageDeck);
  }
});

// Gestion du panier
const popup = document.getElementById('panier-popup');
const panierButton = document.getElementById('card-button');

if (popup && panierButton) {
  panierButton.addEventListener('click', () => {
    popup.classList.toggle('hidden');
    if (typeof renderMyCard === "function") renderMyCard();
  });
}

function renderMyCard() {
  if (!popup) return;
  let myCards = JSON.parse(localStorage.getItem('usercards')) || [];
  if (myCards.length === 0) {
    popup.innerHTML = `<h2 class="text-center font-bold text-xl mb-4">My Cart</h2><p class="text-center text-gray-500">Your Cart is Empty</p>`;
    return;
  }

  myCards = myCards.map(card => ({ ...card, currentQty: card.currentQty || 1 }));

  function calculateTotal() {
    return myCards.reduce((sum, card) => sum + card.prix * card.currentQty, 0);
  }

  function refreshPopup() {
    let total = calculateTotal();
    let cardsHTML = '';

    myCards.forEach((card, index) => {
      cardsHTML += `
        <div class="flex items-center bg-[var(--bg-color)] rounded-xl p-3 gap-3 max-md:w-70 max-md:mx-auto max-md:justify-center">
          <img src="${card.image}" alt="${card.name}" class="w-20 h-24 object-cover rounded-lg max-md:w-15 max-md:h-15">
          <div class="flex flex-col flex-1 max-md:w-[70%]">
            <h3 class="font-semibold">${card.name}</h3>
            <div class="flex items-center gap-2 mt-1">
              <p class="font-bold">Quantity:</p>
              <button data-index="${index}" class="qty-plus rounded-full bg-[var(--btn-color)] text-[var(--bg-color)] w-7 h-7 flex items-center justify-center hover:bg-[var(--color-text)] transition">+</button>
              <span class="font-semibold quantity-value">${card.currentQty}</span>
              <button data-index="${index}" class="qty-minus rounded-full bg-[var(--btn-color)] text-[var(--bg-color)] w-7 h-7 flex items-center justify-center hover:bg-[var(--color-text)] transition">-</button>
            </div>
            <p class="font-semibold mt-2">Price: <span class="text-[var(--btn-color)]">${card.prix}$</span></p>
            <div class="flex justify-end mt-2">
              <button data-index="${index}" class="remove-card bg-[var(--btn-color)] text-[var(--bg-color)] px-4 py-1 rounded-lg hover:bg-[var(--color-text)] transition">Remove</button>
            </div>
          </div>
        </div>`;
    });

    popup.innerHTML = `
      <button id="close-popup" class="absolute top-3 right-3 text-xl font-bold hover:text-[var(--btn-color)]">×</button>
      <h2 class="text-center font-bold text-xl mb-4">Mon Panier</h2>
      <div class="flex flex-col gap-4">${cardsHTML}</div>
      <div class="flex justify-between items-center font-bold text-lg mt-6 max-md:w-full max-md:justify-around">
        <span>Total</span>
        <span>${total}$</span>
      </div>
      <div class="flex justify-between mt-4 max-md:w-full max-md:justify-around">
        <button id="clear-panier" class="bg-[var(--color-text)] text-[var(--bg-color)] px-5 py-2 rounded-lg hover:bg-[var(--btn-color)] transition">Clear</button>
        <button id="order-panier" class="bg-[var(--btn-color)] text-[var(--bg-color)] px-5 py-2 rounded-lg hover:bg-[var(--color-text)] transition">Order</button>
      </div>`;

    // Événement pour fermer le popup
    document.getElementById('close-popup').addEventListener('click', () => {
      popup.classList.add('hidden');
    });

    // Événement pour vider le panier
    document.getElementById('clear-panier').addEventListener('click', () => {
      localStorage.removeItem('usercards');
      renderMyCard(); // Réinitialiser l'affichage
      // Re-render deck si on est sur la page deck
      if (deckContainer) renderDeckCards(currentPageDeck);
    });

    // Événement pour commander
    document.getElementById('order-panier').addEventListener('click', () => {
      alert('Order placed successfully!');
      localStorage.removeItem('usercards');
      renderMyCard(); // Réinitialiser l'affichage
      if (deckContainer) renderDeckCards(currentPageDeck);
    });

    // Événements pour supprimer une carte
    document.querySelectorAll('.remove-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        myCards.splice(index, 1);
        localStorage.setItem('usercards', JSON.stringify(myCards));
        renderMyCard(); // Regénérer l'affichage
        // Re-render deck si on est sur la page deck
        if (deckContainer) renderDeckCards(currentPageDeck);
      });
    });

    // Événements pour augmenter la quantité
    document.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêcher la propagation
        const index = parseInt(e.target.getAttribute('data-index'));
        myCards[index].currentQty++;
        localStorage.setItem('usercards', JSON.stringify(myCards));
        renderMyCard(); // Regénérer l'affichage
      });
    });

    // Événements pour diminuer la quantité
    document.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêcher la propagation
        const index = parseInt(e.target.getAttribute('data-index'));
        if (myCards[index].currentQty > 1) {
          myCards[index].currentQty--;
          localStorage.setItem('usercards', JSON.stringify(myCards));
          renderMyCard(); // Regénérer l'affichage
        }
      });
    });
  }

  refreshPopup();
}