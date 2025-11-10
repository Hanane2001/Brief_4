let cardsData = [];
const cardsPerPage = 9;
let currentPage = 1;
let currentPageFav = 1;
let currentPageDeck = 1;

const cardContainer = document.getElementById("card-container");
const favContainer = document.getElementById("favorite-card-container");
const deckContainer = document.getElementById("card-container-order");
const cardCategory = document.getElementById('category');
const cardCategoryFav = document.getElementById('category-fav');
const cardCategoryDeck = document.getElementById('category-deck');
const paginationContainer = document.getElementById("pagination");
const paginationFavContainer = document.getElementById("pagination-fav");
const paginationDeckContainer = document.getElementById("pagination-deck");

let filteredCardsData = [];
let filteredFavData = [];
let filteredDeckData = [];

if (cardContainer) {
  fetch('js/pokemondata1.json')
    .then(response => {
      if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
      return response.json();
    })
    .then(data => {
      cardsData = data;
      filteredCardsData = [...cardsData];
      renderCard(filteredCardsData, currentPage);
    })
    .catch(error => console.error('Error while loading cards :', error));
}

function renderCard(data, page = 1) {
  if (!cardContainer) return;

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const paginatedData = data.slice(start, end);

  cardContainer.innerHTML = "";
  paginatedData.forEach(card => {
    cardContainer.innerHTML += `
      <div>
        <div class="border-7 rounded-lg border-(--btn-color) w-61 relative" id="id${card.id}">
          <div class="flex">
            <img class="w-50 h-50" src="${card.image}" alt="${card.name}">
            <h1 class="absolute top-0 right-0 w-8 h-8 bg-[#374151] rounded-full text-(--bg-color) font-bold text-center">${card.number}</h1>
          </div>
          <div class="flex flex-col bg-gray-100 pl-[15px] pt-[15px] pb-[15px]">
            <div class="flex gap-10">
              <h1 class="text-(--btn-color) font-extrabold">${card.name}</h1>
              <h2 class="bg-[#374151] w-20 h-7 rounded-full text-(--bg-color) font-bold text-center">
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
          <button class="favourite-button bg-(--btn-color) text-(--bg-color) rounded-sm p-2 hover:bg-(--color-text)" value="${card.id}">Favoris</button>
          <button class="panier-button bg-(--color-text) text-(--bg-color) rounded-sm p-2 hover:bg-(--btn-color)" value="${card.id}">Add To Cart</button>
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

function renderFavoriteCards(page = 1) {
  if (!favContainer) return;

  const favCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];

  const dataToRender = filteredFavData.length > 0 ? filteredFavData : favCards;

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const paginatedData = dataToRender.slice(start, end);

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
        <div class="border-7 rounded-lg border-(--btn-color) w-61 relative" id="id${card.id}">
          <div class="flex">
            <img class="w-50 h-50" src="${card.image}" alt="Card-image">
            <h1 class="absolute top-0 right-0 w-8 h-8 bg-[#374151] rounded-full text-(--bg-color) font-bold text-center">
              ${card.number || ''}
            </h1>
          </div>
          <div class="flex flex-col bg-gray-100 pl-[15px] pt-[15px] pb-[15px]">
            <div class="flex gap-10">
              <h1 class="text-(--btn-color) font-extrabold">${card.name}</h1>
              <h2 class="bg-[#374151] w-20 h-7 rounded-full text-(--bg-color) font-bold text-center">
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
          <button class="remove-favourite bg-(--btn-color) text-(--bg-color) rounded-sm p-2 hover:bg-(--color-text)" data-index="${actualIndex}">Remove</button>
          <button class="panier-button bg-(--color-text) text-(--bg-color) rounded-sm p-2 hover:bg-(--btn-color)" value="${card.id}">Add To Cart</button>
        </div>
      </div>
    `;
  });

  document.querySelectorAll('.remove-favourite').forEach(btn => {
    btn.addEventListener('click', () => {
      const favCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];
      const index = parseInt(btn.getAttribute('data-index'));
      favCards.splice(index, 1);
      localStorage.setItem("userFavouriteCards", JSON.stringify(favCards));
      filteredFavData = [];
      renderFavoriteCards(currentPageFav);
    });
  });

  document.querySelectorAll('.panier-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const favCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];
      const userCart = JSON.parse(localStorage.getItem("usercart")) || [];
      const card = favCards.find(c => c.id == btn.value);
      if (!card) return;
      if (userCart.some(c => c.id == card.id)) return alert("This card is already in your cart");
      const cardForCart = { ...card, currentQty: 1, prix: card.prix || 10 };
      userCart.push(cardForCart);
      localStorage.setItem("usercart", JSON.stringify(userCart));
      alert(`"${card.name}" has been added to your cart`);
      if (typeof renderMyCard === "function") renderMyCard();
    });
  });

  if (paginationFavContainer) {
    renderPagination(dataToRender.length, page, paginationFavContainer, currentPageFav, (newPage) => {
      currentPageFav = newPage;
      renderFavoriteCards(newPage);
    });
  }
}

function renderDeckCards(page = 1) {
  if (!deckContainer) return;
  const userDeck = JSON.parse(localStorage.getItem("userdeck")) || [];
  const dataToRender = filteredDeckData.length > 0 ? filteredDeckData : userDeck;

  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const paginatedData = dataToRender.slice(start, end);

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
        <div class="border-7 rounded-lg border-(--btn-color) w-61 relative" id="id${card.id}">
          <div class="flex">
            <img class="w-50 h-50" src="${card.image}" alt="Card-image">
            <h1 class="absolute top-0 right-0 w-8 h-8 bg-[#374151] rounded-full text-(--bg-color) font-bold text-center">
              ${card.number || ''}
            </h1>
          </div>
          <div class="flex flex-col bg-gray-100 pl-[15px] pt-[15px] pb-[15px]">
            <div class="flex gap-10">
              <h1 class="text-(--btn-color) font-extrabold">${card.name}</h1>
              <h2 class="bg-[#374151] w-20 h-7 rounded-full text-(--bg-color) font-bold text-center">
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
          <button class="sell-button bg-(--btn-color) text-(--bg-color) rounded-sm p-2 hover:bg-(--color-text)" data-index="${actualIndex}">Sell</button>
          <button class="fav-button bg-(--color-text) text-(--bg-color) rounded-sm p-2 hover:bg-(--btn-color)" data-id="${card.id}">Favorite</button>
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".sell-button").forEach(button => {
    button.addEventListener("click", e => {
      const index = parseInt(e.target.dataset.index);
      const userDeck = JSON.parse(localStorage.getItem("userdeck")) || [];
      const soldCard = userDeck[index];
      alert(`You sold the card "${soldCard.name}"`);
      userDeck.splice(index, 1);
      localStorage.setItem("userdeck", JSON.stringify(userDeck));
      filteredDeckData = [];
      renderDeckCards(currentPageDeck);
    });
  });

  document.querySelectorAll(".fav-button").forEach(button => {
    button.addEventListener("click", e => {
      const id = e.target.dataset.id;
      const userDeck = JSON.parse(localStorage.getItem("userdeck")) || [];
      const card = userDeck.find(c => c.id == id);
      if (!card) return;
      let favCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];
      if (!favCards.some(fav => fav.id == card.id)) {
        favCards.push(card);
        localStorage.setItem("userFavouriteCards", JSON.stringify(favCards));
        alert(`"${card.name}" has been added to your favorites`);
      } else alert(`"${card.name}" is already in your favorites!`);
    });
  });

  if (paginationDeckContainer) {
    renderPagination(dataToRender.length, page, paginationDeckContainer, currentPageDeck, (newPage) => {
      currentPageDeck = newPage;
      renderDeckCards(newPage);
    });
  }
}

function filterData(data, type) {
  if (type === "all") {
    return data;
  } else {
    return data.filter(card => card.MRarty === type);
  }
}

function handleMarketFilter(type) {
  filteredCardsData = filterData(cardsData, type);
  currentPage = 1;
  renderCard(filteredCardsData, currentPage);
}

function handleFavFilter(type) {
  const favCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];
  filteredFavData = filterData(favCards, type);
  currentPageFav = 1;
  renderFavoriteCards(currentPageFav);
}

function handleDeckFilter(type) {
  const userDeck = JSON.parse(localStorage.getItem("userdeck")) || [];
  filteredDeckData = filterData(userDeck, type);
  currentPageDeck = 1;
  renderDeckCards(currentPageDeck);
}

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
      <button class="page-btn w-[15%] h-15 p-2 bg-(--btn-color) text-(--bg-color) rounded-full shadow-lg flex items-center justify-center self-center hover:bg-gray-100 hover:text-(--btn-color) cursor-pointer max-md:w-[10%] max-md:h-10 ${i === page ? 'border-2 border-(--color-text)' : ''}" data-page="${i}">
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
      let userCart = JSON.parse(localStorage.getItem("usercart")) || [];
      let card = data.find(c => c.id == button.value);
      if (!card) return;

      if (card.quantity <= 0) return alert("This card is out of stock!");
      if (userCart.some(c => c.id == card.id)) return alert("You can't add the same card twice!");

      userCart.push(card);
      localStorage.setItem("usercart", JSON.stringify(userCart));
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
      handleMarketFilter(type);
    }
  });
}

if (cardCategoryFav) {
  cardCategoryFav.addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
      const type = e.target.value;
      handleFavFilter(type);
    }
  });
}

if (cardCategoryDeck) {
  cardCategoryDeck.addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
      const type = e.target.value;
      handleDeckFilter(type);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (favContainer) {
    renderFavoriteCards(currentPageFav);
  }

  if (deckContainer) {
    renderDeckCards(currentPageDeck);
  }
});

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
  let myCards = JSON.parse(localStorage.getItem('usercart')) || [];

  if (myCards.length === 0) {
    popup.innerHTML = `
      <button id="close-popup" class="absolute top-3 right-3 text-xl font-bold hover:text-(--btn-color)">×</button>
      <h2 class="text-center font-bold text-xl mb-4">My Cart</h2>
      <p class="text-center text-gray-500">Your Cart is Empty</p>
    `;

    document.getElementById('close-popup').addEventListener('click', () => {
      popup.classList.add('hidden');
    });

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
        <div class="flex items-center bg-(--bg-color) rounded-xl p-3 gap-3 max-md:w-70 max-md:mx-auto max-md:justify-center">
          <img src="${card.image}" alt="${card.name}" class="w-20 h-24 object-cover rounded-lg max-md:w-15 max-md:h-15">
          <div class="flex flex-col flex-1 max-md:w-[70%]">
            <h3 class="font-semibold">${card.name}</h3>
            <div class="flex items-center gap-2 mt-1">
              <p class="font-bold">Quantity:</p>
              <button data-index="${index}" class="qty-plus rounded-full bg-(--btn-color) text-(--bg-color) w-7 h-7 flex items-center justify-center hover:bg-(--color-text) transition">+</button>
              <span class="font-semibold quantity-value">${card.currentQty}</span>
              <button data-index="${index}" class="qty-minus rounded-full bg-(--btn-color) text-(--bg-color) w-7 h-7 flex items-center justify-center hover:bg-(--color-text) transition">-</button>
            </div>
            <p class="font-semibold mt-2">Price: <span class="text-(--btn-color)">${card.prix}$</span></p>
            <div class="flex justify-end mt-2">
              <button data-index="${index}" class="remove-card bg-(--btn-color) text-(--bg-color) px-4 py-1 rounded-lg hover:bg-(--color-text) transition">Remove</button>
            </div>
          </div>
        </div>`;
    });

    popup.innerHTML = `
      <button id="close-popup" class="absolute top-3 right-3 text-xl font-bold hover:text-(--btn-color)">×</button>
      <h2 class="text-center font-bold text-xl mb-4">Mon Panier</h2>
      <div class="flex flex-col gap-4">${cardsHTML}</div>
      <div class="flex justify-between items-center font-bold text-lg mt-6 max-md:w-full max-md:justify-around">
        <span>Total</span>
        <span>${total}$</span>
      </div>
      <div class="flex justify-between mt-4 max-md:w-full max-md:justify-around">
        <button id="clear-panier" class="bg-(--color-text) text-(--bg-color) px-5 py-2 rounded-lg hover:bg-(--btn-color) transition">Clear</button>
        <button id="order-panier" class="bg-(--btn-color) text-(--bg-color) px-5 py-2 rounded-lg hover:bg-(--color-text) transition">Order</button>
      </div>`;

    document.getElementById('close-popup').addEventListener('click', () => {
      popup.classList.add('hidden');
    });

    document.getElementById('clear-panier').addEventListener('click', () => {
      localStorage.removeItem('usercart');
      renderMyCard();
      if (deckContainer) renderDeckCards(currentPageDeck);
    });

    document.getElementById('order-panier').addEventListener('click', () => {
      const userCart = JSON.parse(localStorage.getItem("usercart")) || [];
      const userDeck = JSON.parse(localStorage.getItem("userdeck")) || [];

      userCart.forEach(card => {
        if (!userDeck.some(deckCard => deckCard.id === card.id)) {
          userDeck.push(card);
        }
      });

      localStorage.setItem("userdeck", JSON.stringify(userDeck));
      localStorage.removeItem('usercart');

      alert('Order placed successfully! Your cards have been added to your deck.');
      renderMyCard();
      if (deckContainer) renderDeckCards(currentPageDeck);
    });

    document.querySelectorAll('.remove-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        myCards.splice(index, 1);
        localStorage.setItem('usercart', JSON.stringify(myCards));
        renderMyCard();
        if (deckContainer) renderDeckCards(currentPageDeck);
      });
    });

    document.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.target.getAttribute('data-index'));
        myCards[index].currentQty++;
        localStorage.setItem('usercart', JSON.stringify(myCards));
        renderMyCard();
      });
    });

    document.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.target.getAttribute('data-index'));
        if (myCards[index].currentQty > 1) {
          myCards[index].currentQty--;
          localStorage.setItem('usercart', JSON.stringify(myCards));
          renderMyCard();
        }
      });
    });
  }

  refreshPopup();
}


const myPlayCards = JSON.parse(localStorage.getItem("userdeck")) || [];
const ZoneDeck = document.getElementById("zone_deck");

function renderPCards() {
  myPlayCards.forEach(card => {
    const cardHTML = document.createElement('div');
    cardHTML.setAttribute("draggable", "true");
    cardHTML.innerHTML = `
        <div class="border-7 rounded-lg border-(--btn-color) w-61 relative" id="id${card.id}">
          <div class="flex">
            <img class="w-90 h-50" src="${card.image}" alt="Card-image">
            <h1 class="absolute top-0 right-0 w-8 h-8 bg-[#374151] rounded-full text-(--bg-color) font-bold text-center">
              ${card.number}
            </h1>
          </div>
          <div class="flex flex-col bg-gray-100 pl-[15px] pt-[15px] pb-[15px]">
            <div class="flex gap-10">
              <h1 class="text-(--btn-color) font-extrabold">${card.name}</h1>
              <h2 class="bg-[#374151] w-20 h-7 rounded-full text-(--bg-color) font-bold text-center">
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
        </div>`;
        ZoneDeck.appendChild(cardHTML);
  })

  const nbrCards = document.getElementById("nbr-Cards");
  let deckcount = ZoneDeck.children.length;
  nbrCards.innerHTML = deckcount;
}
renderPCards();