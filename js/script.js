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

//*********************************fetcher le data*********************************
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

//*********************************styliser les cartes avec se forme dessus*********************************
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
            <img class="h-50 object-cover" src="${card.image}" alt="${card.name}">
            <h1 class="absolute top-0 right-0 w-8 h-8 bg-[#374151] rounded-full text-(--bg-color) font-bold text-center">${card.number}</h1>
          </div>
          <div class="flex flex-col bg-gray-100 pl-[15px] pt-[15px] pb-[15px]">
            <div class="flex gap-10">
              <h1 class="text-(--btn-color) font-extrabold">${card.name}</h1>
              <h2 class="bg-[#374151] w-20 h-7 rounded-full text-(--bg-color) font-bold text-center">
                ${card.types ? card.types[0] : card.types[1]}
              </h2>
            </div>
            <p class="text-gray-500">${card.classification}</p>
            <div class="grid grid-cols-3">
              <p class="font-light">HP <span class="text-gray-700 font-bold">${card.maxHP}</span></p>
              <p class="font-light">CP <span class="text-gray-700 font-bold">${card.maxCP}</span></p>
              <p class="font-light">W <span class="text-gray-700 font-bold">${card.fleeRate}</span></p>
              <p class="flex"><img src="img/shield.png" alt="shield"><span class="text-gray-700 font-bold">${card.resistant ? card.resistant[0] : card.resistant[2]}</span></p>
              <p class="flex"><img src="img/shield.png" alt="shield"><span class="text-gray-700 font-bold">${card.resistant ? card.resistant[1] : card.resistant[3]}</span></p>
              <p class="flex"><img src="img/trending_down.png" alt="trending_down"><span class="text-gray-700 font-bold">${card.weaknesses ? card.weaknesses[0] : card.weaknesses[1]}</span></p>
            </div>
          </div>
        </div>
        <div class="text-center font-bold">
          <p>Rare: ${card.Rare}</p>
          <p>${card.Descreption}</p>
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

//*********************************page favorite avec style des cartes et gestion des evenement(supp carte ,ajoute carte panier, pagination)*********************************
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
            <img class="h-50 object-cover" src="${card.image}" alt="Card-image">
            <h1 class="absolute top-0 right-0 w-8 h-8 bg-[#374151] rounded-full text-(--bg-color) font-bold text-center">
              ${card.number}
            </h1>
          </div>
          <div class="flex flex-col bg-gray-100 pl-[15px] pt-[15px] pb-[15px]">
            <div class="flex gap-10">
              <h1 class="text-(--btn-color) font-extrabold">${card.name}</h1>
              <h2 class="bg-[#374151] w-20 h-7 rounded-full text-(--bg-color) font-bold text-center">
                ${card.types ? card.types[0] : card.types[1]}
              </h2>
            </div>
            <p class="text-gray-500">${card.classification}</p>
            <div class="grid grid-cols-3">
              <p class="font-light">HP<span class="text-gray-700 font-bold">${card.maxHP}</span></p>
              <p class="font-light">CP<span class="text-gray-700 font-bold">${card.maxCP}</span></p>
              <p class="font-light">W<span class="text-gray-700 font-bold">${card.fleeRate}</span></p>
            </div>
          </div>
        </div>
        <div class="text-center font-bold">
          <p>Rare: ${card.Rare}</p>
          <p>${card.Descreption}</p>
          <p>${card.prix}$</p>
        </div>
        <div class="flex justify-between">
          <button class="remove-favourite bg-(--btn-color) text-(--bg-color) rounded-sm p-2 hover:bg-(--color-text)" data-index="${actualIndex}">Remove</button>
          <button class="panier-button bg-(--color-text) text-(--bg-color) rounded-sm p-2 hover:bg-(--btn-color)" value="${card.id}">Add To Cart</button>
        </div>
      </div>
    `;
  });

//*********************************button pour eviter le carte dans mon page favorite*********************************
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

//*********************************button pour ajouter les cartes a panier*********************************
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

//*********************************pagination de page favorite*********************************
  if (paginationFavContainer) {
    renderPagination(dataToRender.length, page, paginationFavContainer, currentPageFav, (newPage) => {
      currentPageFav = newPage;
      renderFavoriteCards(newPage);
    });
  }
}

//*********************************page mydeck avec style des cartes et gestion des evenement(vende carte ,ajoute carte panier, pagination)*********************************
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
            <img class="h-50 object-cover" src="${card.image}" alt="Card-image">
            <h1 class="absolute top-0 right-0 w-8 h-8 bg-[#374151] rounded-full text-(--bg-color) font-bold text-center">
              ${card.number}
            </h1>
          </div>
          <div class="flex flex-col bg-gray-100 pl-[15px] pt-[15px] pb-[15px]">
            <div class="flex gap-10">
              <h1 class="text-(--btn-color) font-extrabold">${card.name}</h1>
              <h2 class="bg-[#374151] w-20 h-7 rounded-full text-(--bg-color) font-bold text-center">
                ${card.types ? card.types[0] : card.types[1]}
              </h2>
            </div>
            <p class="text-gray-500">${card.classification}</p>
            <div class="grid grid-cols-3">
              <p class="font-light">HP<span class="text-gray-700 font-bold">${card.maxHP}</span></p>
              <p class="font-light">CP<span class="text-gray-700 font-bold">${card.maxCP}</span></p>
              <p class="font-light">W<span class="text-gray-700 font-bold">${card.fleeRate}</span></p>
              <p class="flex"><img src="img/shield.png" alt="shield"><span class="text-gray-700 font-bold">${card.resistant ? card.resistant[0] : card.resistant[2]}</span></p>
              <p class="flex"><img src="img/shield.png" alt="shield"><span class="text-gray-700 font-bold">${card.resistant ? card.resistant[1] : card.resistant[3]}</span></p>
              <p class="flex"><img src="img/trending_down.png" alt="trending_down"><span class="text-gray-700 font-bold">${card.weaknesses ? card.weaknesses[0] : card.weaknesses[1]}</span></p>
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

//*********************************button pour vende les cartes*********************************
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

//*********************************button pour ajouter les cartes dans page favorite*********************************
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

//*********************************pagination de la page favorite*********************************
  if (paginationDeckContainer) {
    renderPagination(dataToRender.length, page, paginationDeckContainer, currentPageDeck, (newPage) => {
      currentPageDeck = newPage;
      renderDeckCards(newPage);
    });
  }
}

//*********************************fonction pour filtrer par MRarty*********************************
function filterData(data, type) {
  if (type === "all") {
    return data;
  } else {
    return data.filter(card => card.MRarty === type);
  }
}

//*********************************fonction de filtrage dans page market*********************************
function handleMarketFilter(type) {
  filteredCardsData = filterData(cardsData, type);
  currentPage = 1;
  renderCard(filteredCardsData, currentPage);
}

//*********************************fonction de filtrage dans page favorite*********************************
function handleFavFilter(type) {
  const favCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];
  filteredFavData = filterData(favCards, type);
  currentPageFav = 1;
  renderFavoriteCards(currentPageFav);
}

//*********************************fonction de filtrage dans page mydeck*********************************
function handleDeckFilter(type) {
  const userDeck = JSON.parse(localStorage.getItem("userdeck")) || [];
  filteredDeckData = filterData(userDeck, type);
  currentPageDeck = 1;
  renderDeckCards(currentPageDeck);
}

//*********************************fonction de pagination*********************************
function renderPagination(totalCards, page, container, currentPage, onPageChange) {
  if (!container) return;

  const totalPages = Math.ceil(totalCards / cardsPerPage);
  let html = '';

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  html += `
    <button id="prev-page" class="w-[50%] h-[5%] max-md:w-[100%] max-md:h-[90%] p-2 bg-white rounded-sm shadow-lg flex items-center justify-center self-center hover:bg-gray-100 transition cursor-pointer" ${page === 1 ? 'disabled' : ''}>
      <img class="w-[50%] h-[15%] max-md:w-[90%] max-md:h-[90%]" src="img/icons8-left-arrow-50.png" alt="left-arrow">
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn w-[15%] h-[5%] p-2 bg-(--btn-color) text-(--bg-color) rounded-full shadow-lg flex items-center justify-center self-center hover:bg-gray-100 hover:text-(--btn-color) cursor-pointer max-md:w-[50%] max-md:h-[90%] ${i === page ? 'border-2 border-(--color-text)' : ''}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  html += `
    <button id="next-page" class="w-[50%] h-[5%] max-md:w-[100%] max-md:h-[90%] p-2 bg-white rounded-sm shadow-lg flex items-center justify-center self-center hover:bg-gray-100 transition cursor-pointer max-md:w-[15%] max-md:h-10" ${page === totalPages ? 'disabled' : ''}>
      <img class="w-[50%] h-[15%] max-md:w-[90%] max-md:h-[90%]" src="img/icons8-right-arrow-50.png" alt="right-arrow">
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

//*********************************fonction d'ajouter une carte dans panier*********************************
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

//*********************************filtrer*********************************
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

//*********************************fonction de popap panier*********************************
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

//*********************************fonction calculer totale prix des cartes*********************************
  function calculateTotal() {
    return myCards.reduce((sum, card) => sum + card.prix * card.currentQty, 0);
  }

//*********************************fonction pour refresh le panier*********************************
  function refreshPopup() {
    let total = calculateTotal();
    let cardsHTML = '';

    myCards.forEach((card, index) => {
      cardsHTML += `
        <div class="flex items-center bg-(--bg-color) rounded-xl p-3 gap-3 max-md:w-70 max-md:mx-auto max-md:justify-center">
          <img src="${card.image}" alt="${card.name}" class="h-24 object-cover rounded-lg max-md:h-15">
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

//*********************************gestion des events dans panier*********************************
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

//*********************************supp une card dans le panier*********************************
    document.querySelectorAll('.remove-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        myCards.splice(index, 1);
        localStorage.setItem('usercart', JSON.stringify(myCards));
        renderMyCard();
        if (deckContainer) renderDeckCards(currentPageDeck);
      });
    });

//********************************incremente quantity*********************************
    document.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.target.getAttribute('data-index'));
        myCards[index].currentQty++;
        localStorage.setItem('usercart', JSON.stringify(myCards));
        renderMyCard();
      });
    });

//*********************************decrement quantity*********************************
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

let currentPlayerTurn = true;
let turnPhase = 'draw';
let cardsDrawnThisTurn = 0;
let maxDrawsPerTurn = 1;
let playerHP = 100;
let opponentHP = 100;
let draggedItem = null;
let selectedCardForAction = null;

const allCards = JSON.parse(localStorage.getItem("userdeck")) || [];
const marketCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];
let opponentDeck = [...marketCards];
let myPlayCards = [...allCards];
const ZoneDeck = document.getElementById("zone_deck");
const cardsArenaContainer = document.getElementById("Cards-arena");
const playerHandContainer = document.getElementById("player-hand-cards");
const opponentHandContainer = document.getElementById("opponent-hand");

let opponentHand = [];
let opponentPlayCards = [...opponentDeck];

//*********************************ajouter le panier dans page play*********************************
document.addEventListener('DOMContentLoaded', function() {
    renderPCards();
    initializeGame();
    const popup = document.getElementById('panier-popup');
    const panierButton = document.getElementById('card-button');

    if (popup && panierButton) {
        panierButton.addEventListener('click', () => {
            popup.classList.toggle('hidden');
            renderMyCard(); 
        });
    }
});


//*********************************fonction designer les cartes dans page play*********************************
function renderPCards() {
    ZoneDeck.innerHTML = '';
    if (myPlayCards.length === 0) {
        ZoneDeck.innerHTML = '<p class="text-(--bg-color) text-center">No cards in deck</p>';
        document.getElementById("nbr-Cards").textContent = '0';
        return;
    }

    myPlayCards.forEach(card => {
        const cardHTML = document.createElement('div');
        cardHTML.className = 'deck-card cursor-pointer transform hover:scale-105 transition';
        cardHTML.setAttribute("draggable", "true");
        cardHTML.setAttribute("data-card-id", card.id);
        cardHTML.setAttribute("data-card-data", JSON.stringify(card));
        cardHTML.innerHTML = `
            <div class="border-4 rounded-lg border-(--btn-color) w-40 relative bg-white">
                <div class="flex">
                    <img class="h-40 object-cover" src="${card.image}" alt="${card.name}">
                    <h1 class="absolute top-0 right-0 w-6 h-6 bg-[#374151] rounded-full text-white font-bold text-center text-xs flex items-center justify-center">
                        ${card.number}
                    </h1>
                </div>
                <div class="flex flex-col bg-gray-100 p-2">
                    <div class="flex justify-between items-center">
                        <h1 class="text-(--btn-color) font-bold text-sm">${card.name}</h1>
                        <h2 class="bg-[#374151] text-xs px-2 py-1 rounded-full text-white font-bold">
                            ${card.types ? card.types[0] : card.types[1]}
                        </h2>
                    </div>
                    <p class="text-gray-500 text-xs">${card.classification}</p>
                    <div class="grid grid-cols-2 gap-1 text-xs mt-1">
                        <p>HP: <span class="font-bold">${card.maxHP}</span></p>
                        <p>CP: <span class="font-bold">${card.maxCP}</span></p>
                    </div>
                </div>
            </div>`;
        
        ZoneDeck.appendChild(cardHTML);

        cardHTML.addEventListener('dragstart', (e) => {
            if (!currentPlayerTurn) {
                e.preventDefault();
                return;
            }
            draggedItem = cardHTML;
            cardHTML.classList.add('opacity-50');
        });

        cardHTML.addEventListener('dragend', () => {
            cardHTML.classList.remove('opacity-50');
        });
    });

    document.getElementById("nbr-Cards").textContent = myPlayCards.length;
}

function initializeGame() {
    updateHP();
    setupEventListeners();
    startPlayerTurn();
}

//*********************************fonction qui gere le click (draw, end turn,attaque,defense...) et les drop dans page play*********************************
function setupEventListeners() {
    document.getElementById('draw-card-btn').addEventListener('click', drawCard);
    document.getElementById('end-turn-btn').addEventListener('click', endTurn);
    document.getElementById('attack-mode').addEventListener('click', () => placeCardOnField('attack'));
    document.getElementById('defense-mode').addEventListener('click', () => placeCardOnField('defense'));
    document.getElementById('cancel-action').addEventListener('click', cancelCardAction);

    document.querySelectorAll('.card-arena').forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            if (currentPlayerTurn) {
                e.preventDefault();
            }
        });
        
        slot.addEventListener('drop', (e) => {
            if (!currentPlayerTurn || !draggedItem) return;
            
            e.preventDefault();
            const slotElement = e.target.closest('.card-arena');
            
            if (slotElement && slotElement.classList.contains('player-slot') && 
                slotElement.children.length === 0) {
                
                selectedCardForAction = {
                    element: draggedItem,
                    slot: slotElement
                };
                document.getElementById('card-action-modal').classList.remove('hidden');
            }
        });
    });

    const cartButton = document.getElementById('card-button');
    const panierPopup = document.getElementById('panier-popup');
    const closePopup = document.getElementById('close-popup');

    if (cartButton && panierPopup && closePopup) {
        cartButton.addEventListener('click', () => {
            panierPopup.classList.toggle('hidden');
        });

        closePopup.addEventListener('click', () => {
            panierPopup.classList.add('hidden');
        });
    }
}

//*********************************fonction de draw les cartes dans page play*********************************
function drawCard() {
    if (!currentPlayerTurn) {
        alert("Not your turn!");
        return;
    }
    
    if (turnPhase !== 'draw') {
        alert("You can only draw at the start of your turn!");
        return;
    }
    
    if (cardsDrawnThisTurn >= maxDrawsPerTurn) {
        alert("You can only draw one card per turn!");
        return;
    }
    
    const playerHand = document.getElementById('player-hand-cards');
    const currentHandCount = playerHand.children.length;
    if (currentHandCount >= 5) {
        alert("Hand is full! Maximum 5 cards.");
        return;
    }
    
    if (myPlayCards.length === 0) {
        alert("No more cards in deck!");
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * myPlayCards.length);
    const drawnCard = myPlayCards[randomIndex];
    
    myPlayCards.splice(randomIndex, 1);
    localStorage.setItem("userdeck", JSON.stringify(myPlayCards));
    
    addCardToHand(drawnCard);
    
    document.getElementById("nbr-Cards").textContent = myPlayCards.length;
    renderPCards();
    
    cardsDrawnThisTurn++;
    turnPhase = 'main';
    
    document.getElementById('summon-status').textContent = "Place cards";
    document.getElementById('turn-indicator').textContent = "Your Turn";
}

//*********************************fonction qui ajouter les cartes dans main dans page play*********************************
function addCardToHand(card) {
    const playerHand = document.getElementById('player-hand-cards');
    
    const handCard = document.createElement('div');
    handCard.className = 'hand-card cursor-pointer transform hover:scale-105 transition';
    handCard.setAttribute("draggable", "true");
    handCard.setAttribute("data-card-id", card.id);
    handCard.setAttribute("data-card-data", JSON.stringify(card));
    handCard.innerHTML = `
        <div class="border-4 rounded-lg border-(--btn-color) w-32 relative bg-white">
            <div class="flex">
                <img class="h-30 object-cover" src="${card.image}" alt="${card.name}">
                <h1 class="absolute top-0 right-0 w-5 h-5 bg-[#374151] rounded-full text-white font-bold text-center text-xs flex items-center justify-center">
                    ${card.number}
                </h1>
            </div>
            <div class="flex flex-col bg-gray-100 p-1">
                <h1 class="text-(--btn-color) font-bold text-xs truncate">${card.name}</h1>
                <div class="flex justify-between text-xs">
                    <p>HP: <span class="font-bold">${card.maxHP}</span></p>
                    <p>CP: <span class="font-bold">${card.maxCP}</span></p>
                </div>
            </div>
        </div>`;
    
    playerHand.appendChild(handCard);
    
    handCard.addEventListener('dragstart', (e) => {
        if (!currentPlayerTurn) {
            e.preventDefault();
            return;
        }
        draggedItem = handCard;
        handCard.classList.add('opacity-50');
    });
    
    handCard.addEventListener('dragend', () => {
        handCard.classList.remove('opacity-50');
    });
    
    handCard.addEventListener('click', () => {
        showCardInfo(card);
    });
    
    updateHandCount();
}

function updateHandCount() {
    const handCount = document.getElementById('player-hand-cards').children.length;
    document.getElementById('nbr-Cards-hand').textContent = handCount;
}

function placeCardOnField(mode) {
    if (!selectedCardForAction) return;
    
    const { element, slot } = selectedCardForAction;
    
    const cardDataStr = element.getAttribute('data-card-data');
    let cardData;
    
    if (cardDataStr) {
        cardData = JSON.parse(cardDataStr);
    } else {
        const cardId = element.getAttribute('data-card-id');
        cardData = allCards.find(c => c.id == cardId);
    }
    
    if (!cardData) {
        alert("Error: Card data not found!");
        document.getElementById('card-action-modal').classList.add('hidden');
        selectedCardForAction = null;
        return;
    }
    
    const battleCard = document.createElement('div');
    battleCard.className = `battle-card ${mode} relative`;
    battleCard.setAttribute('data-card-id', cardData.id);
    battleCard.setAttribute('data-mode', mode);
    battleCard.setAttribute('data-hp', cardData.maxHP || 50);
    battleCard.setAttribute('data-attack', cardData.maxCP || 30);
    battleCard.setAttribute('data-card-data', JSON.stringify(cardData));
    
    battleCard.innerHTML = `
        <div class="border-4 rounded-lg ${mode === 'attack' ? 'border-red-500' : 'border-blue-500'} w-28 relative bg-white">
            <img class="h-20 object-cover" src="${cardData.image}" alt="${cardData.name}">
            <div class="absolute top-0 left-0 bg-${mode === 'attack' ? 'red' : 'blue'}-500 text-white text-xs px-1 rounded-br">
                ${mode === 'attack' ? '⚔️' : '🛡️'}
            </div>
            <div class="bg-gray-100 p-1 text-center">
                <h1 class="font-bold text-xs truncate">${cardData.name}</h1>
                <div class="flex justify-between text-xs">
                    <span>HP: ${cardData.maxHP}</span>
                    <span>ATK: ${cardData.maxCP}</span>
                </div>
            </div>
        </div>`;
    
    slot.appendChild(battleCard);

    if (element.parentElement.id === 'player-hand-cards') {
        element.remove();
        updateHandCount();
    } else if (element.classList.contains('deck-card')) {
        element.remove();
        const cardIndex = myPlayCards.findIndex(c => c.id == cardData.id);
        if (cardIndex > -1) {
            myPlayCards.splice(cardIndex, 1);
            localStorage.setItem("userdeck", JSON.stringify(myPlayCards));
        }
        renderPCards();
    }
    
    document.getElementById('card-action-modal').classList.add('hidden');
    selectedCardForAction = null;

    if (turnPhase === 'draw') {
        turnPhase = 'main';
    }
    checkArenaFull();
}

function cancelCardAction() {
    document.getElementById('card-action-modal').classList.add('hidden');
    selectedCardForAction = null;
}

//*********************************fonction gere le tour de player principale (ici c'est moi) d'un carte dans page play*********************************
function startPlayerTurn() {
    currentPlayerTurn = true;
    turnPhase = 'draw';
    cardsDrawnThisTurn = 0;
    
    document.getElementById('turn-indicator').textContent = "Your Turn";
    document.getElementById('turn-indicator').classList.add('text-green-400');
    document.getElementById('turn-indicator').classList.remove('text-red-400');
    document.getElementById('summon-status').textContent = "Draw a card";
    
    if (myPlayCards.length === 0) {
        alert("Deck is empty! Moving to main phase.");
        turnPhase = 'main';
        document.getElementById('turn-indicator').textContent = "Your Turn";
        document.getElementById('summon-status').textContent = "Place cards";
    }
}

//*********************************fonction qui gere le role de button end turn dans page play*********************************
function endTurn() {
    if (!currentPlayerTurn) return;
    
    if (turnPhase === 'draw' && cardsDrawnThisTurn === 0) {
        alert("You must draw a card before ending your turn!");
        return;
    }
    
    currentPlayerTurn = false;
    turnPhase = 'end';
    
    document.getElementById('turn-indicator').textContent = "Opponent's Turn";
    document.getElementById('turn-indicator').classList.remove('text-green-400');
    document.getElementById('turn-indicator').classList.add('text-red-400');
    document.getElementById('summon-status').textContent = "Waiting...";
    
    if (!checkArenaFull()) {
        setTimeout(simulateOpponentTurn, 2000);
    }
}

function opponentDrawCard() {
    if (opponentHand.length < 5 && opponentPlayCards.length > 0 && Math.random() > 0.3) {
        const randomIndex = Math.floor(Math.random() * opponentPlayCards.length);
        const drawnCard = opponentPlayCards[randomIndex];
        opponentPlayCards.splice(randomIndex, 1);
        opponentHand.push(drawnCard);
        
        updateOpponentHandDisplay();
        return true;
    }
    return false;
}

function updateOpponentHandDisplay() {
    const opponentHandContainer = document.getElementById('opponent-hand');
    opponentHandContainer.innerHTML = '';
    
    opponentHand.forEach(card => {
        const opponentCard = document.createElement('div');
        opponentCard.className = 'opponent-hand-card bg-gray-400 w-12 h-16 rounded border';
        opponentCard.setAttribute('data-card-id', card.id);
        opponentHandContainer.appendChild(opponentCard);
    });
    
    document.getElementById('opponent-hand-count').textContent = opponentHand.length;
}

//*********************************fonction gere le tour d'autre player dans page play*********************************
function simulateOpponentTurn() {
    opponentDrawCard();
    
    setTimeout(() => {
        const opponentSlots = document.querySelectorAll('.opponent-attack');
        const emptySlots = Array.from(opponentSlots).filter(slot => slot.children.length === 0);
        
        if (emptySlots.length > 0 && opponentHand.length > 0 && Math.random() > 0.3) {
            const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
            const randomCardIndex = Math.floor(Math.random() * opponentHand.length);
            const opponentCardData = opponentHand[randomCardIndex];
            
            opponentHand.splice(randomCardIndex, 1);
            updateOpponentHandDisplay();
            
            const mode = Math.random() > 0.5 ? 'attack' : 'defense';
            
            const opponentCard = document.createElement('div');
            opponentCard.className = `battle-card opponent ${mode} relative`;
            opponentCard.setAttribute('data-card-id', opponentCardData.id);
            opponentCard.setAttribute('data-mode', mode);
            opponentCard.setAttribute('data-hp', opponentCardData.maxHP || 50);
            opponentCard.setAttribute('data-attack', opponentCardData.maxCP || 30);
            opponentCard.setAttribute('data-card-data', JSON.stringify(opponentCardData));
            
            opponentCard.innerHTML = `
                <div class="border-4 rounded-lg ${mode === 'attack' ? 'border-red-300' : 'border-blue-300'} w-28 relative bg-gray-200">
                    <img class="h-20 object-cover" src="${opponentCardData.image}" alt="${opponentCardData.name}">
                    <div class="absolute top-0 left-0 bg-${mode === 'attack' ? 'red' : 'blue'}-300 text-white text-xs px-1 rounded-br">
                        ${mode === 'attack' ? '⚔️' : '🛡️'}
                    </div>
                    <div class="bg-gray-100 p-1 text-center">
                        <h1 class="font-bold text-xs truncate">${opponentCardData.name}</h1>
                        <div class="flex justify-between text-xs">
                            <span>HP: ${opponentCardData.maxHP}</span>
                            <span>ATK: ${opponentCardData.maxCP}</span>
                        </div>
                    </div>
                </div>`;
            
            randomSlot.appendChild(opponentCard);
            
            setTimeout(() => {
                checkArenaFull();
            }, 500);
        }
        
        setTimeout(() => {
            if (!checkArenaFull()) {
                setTimeout(startPlayerTurn, 1000);
            }
        }, 1000);
        
    }, 1500);
}

//*********************************fonction qui tester who win dans page play*********************************
function checkArenaFull() {
    const playerSlots = document.querySelectorAll('.player-slot');
    const opponentSlots = document.querySelectorAll('.opponent-attack');
    
    let playerCardsCount = 0;
    let opponentCardsCount = 0;
    let totalPlayerHP = 0;
    let totalOpponentHP = 0;
    
    playerSlots.forEach(slot => {
        const card = slot.querySelector('.battle-card');
        if (card) {
            playerCardsCount++;
            const cardHP = parseInt(card.getAttribute('data-hp')) || 50;
            totalPlayerHP += cardHP;
        }
    });
    
    opponentSlots.forEach(slot => {
        const card = slot.querySelector('.battle-card');
        if (card) {
            opponentCardsCount++;
            const cardHP = parseInt(card.getAttribute('data-hp')) || 50;
            totalOpponentHP += cardHP;
        }
    });
    
    console.log(`Arena - Player: ${playerCardsCount}/5 cards, ${totalPlayerHP} HP total`);
    console.log(`Arena - Opponent: ${opponentCardsCount}/5 cards, ${totalOpponentHP} HP total`);
    
    if (playerCardsCount === 5 && opponentCardsCount === 5) {
        console.log("🎯 Arena full! Winner calculated...");
        
        let winner = "";
        if (totalPlayerHP > totalOpponentHP) {
            winner = `🎉 You win!!!`;
        } else if (totalOpponentHP > totalPlayerHP) {
            winner = `💀 You lose!!!`;
        } else {
            winner = `🤝 Tie!!!`;
        }
        
        alert(winner);
        setTimeout(resetGame, 2000);
        return true;
    }
    
    return false;
}

function updateHP() {
    document.getElementById('player-score').textContent = playerHP;
    document.getElementById('opponent-score').textContent = opponentHP;
    
    console.log(`HP updated - Player:${playerHP}, Opponent: ${opponentHP}`);
}

//*********************************fonction qui restartle jeux dans page play*********************************
function resetGame() {
    console.log("Restarting the game...");
    playerHP = 100;
    opponentHP = 100;

    document.querySelectorAll('.battle-card').forEach(card => card.remove());
    document.getElementById('player-hand-cards').innerHTML = '';
    document.getElementById('opponent-hand').innerHTML = '';
    myPlayCards = [...allCards];
    opponentPlayCards = [...opponentDeck];
    opponentHand = [];
    
    localStorage.setItem("userdeck", JSON.stringify(myPlayCards));
    
    updateHP();
    updateHandCount();
    document.getElementById('opponent-hand-count').textContent = '0';

    renderPCards();
    setTimeout(startPlayerTurn, 1000);
}

//*********************************fonction afficher les informations d'un carte dans page play*********************************
function showCardInfo(card) {
    const info = `
Nom: ${card.name}
Type: ${card.types ? card.types[0] : 'Unknown'}
HP: ${card.maxHP}
CP: ${card.maxCP}
Classification: ${card.classification || 'Unknown'}`;
    
    alert(`Card information:\n${info}`);
}

const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('change', function() {
        if (this.checked) {
            nav.style.maxHeight = nav.scrollHeight + 'px';
        } else {
            nav.style.maxHeight = '0';
        }
    });
}