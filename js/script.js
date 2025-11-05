// document.addEventListener('DOMContentLoaded', () => {
//   let arr = [];
//   for (let count = 1; count < 7; count++) {
//     let cards = document.getElementById('id' + count);
//     arr.push({ cards });
//     console.log(cards);
//   }

//   const names = document.getElementsByClassName('name');
//   fetch('js/pokemondata1.json')
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then(data => {
//       console.log('Fetched data:', data);

//       const firstName = data[2].name;
//       console.log('First Pokémon name:', firstName);
//       for (let i = 0; i < names.length; i++) {
//         names[i].innerHTML = firstName;
//       }
//     })
//     .catch(error => {
//       console.error('There was a problem with the fetch operation:', error);
//     });
// });


// let change = document.getElementById('image-rotate');


// change.addEventListener('click', function() {
//     for(let i=0;i<100;i++){
//         change.src = '../img/JL2G_EN_'+i+'-2x.png';
//     }
// });

// change.addEventListener('mousleave', function() {
//     change.style.transform = 'rotateY(180deg)';
// });

let cardContainer = document.getElementById("card-container");
let cardCategory = document.getElementById('category');
let cardsData = [];

fetch('js/pokemondata1.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    cardsData = data;
    renderCard(cardsData);
  })
  .catch(error => {
    console.error('Erreur lors du chargement des cartes :', error);
  });

function renderCard(data, isFiltered = false) {
  if (isFiltered) {
    cardContainer.innerHTML = "";
  }
  console.log("Cartes affichées :", data);

  for (let i = 0; i < data.length; i++) {
    cardContainer.innerHTML += `
    <div>
      <div class="border-7 rounded-lg border-(--btn-color) w-61 relative" id="id${data[i].id}">
        <div class="flex">
          <img class="w-50 h-50" src="${data[i].image}" alt="Card-image">
          <h1 class="absolute top-0 right-0 w-8 h-8 bg-[#374151] rounded-full text-(--bg-color) font-bold text-center">
            ${data[i].number}
          </h1>
        </div>
        <div class="flex flex-col bg-gray-100 pl-[15px] pt-[15px] pb-[15px]">
          <div class="flex gap-10">
            <h1 class="text-(--btn-color) font-extrabold">${data[i].name}</h1>
            <h2 class="bg-[#374151] w-20 h-7 rounded-full text-(--bg-color) font-bold text-center">
              ${data[i].types[0]}
            </h2>
          </div>
          <p class="text-gray-500">${data[i].classification}</p>
          <div class="grid grid-cols-3">
            <p class="font-light">HP<span class="text-gray-700 font-bold">${data[i].maxHP}</span></p>
            <p class="font-light">CP<span class="text-gray-700 font-bold">${data[i].maxCP}</span></p>
            <p class="font-light">W<span class="text-gray-700 font-bold">${data[i].fleeRate}</span></p>
            <p class="flex"><img src="img/shield.png" alt="shield"><span class="text-gray-700 font-bold">${data[i].resistant[0]}</span></p>
            <p class="flex"><img src="img/shield.png" alt="shield"><span class="text-gray-700 font-bold">${data[i].resistant[1]}</span></p>
            <p class="flex"><img src="img/trending_down.png" alt="trending_down"><span class="text-gray-700 font-bold">${data[i].weaknesses[0]}</span></p>
          </div>
        </div>
      </div>
      <div class="text-center font-bold">
        <p>Rare: ${data[i].Rare}</p>
        <p>${data[i].Descreption}</p>
        <p>${data[i].prix}$</p>
      </div>
      <div class="flex justify-between">
        <button class="bg-(--btn-color) text-(--bg-color) rounded-sm p-2 hover:bg-(--color-text)">Favoris</button>
        <button class="bg-(--color-text) text-(--bg-color) rounded-sm p-2 hover:bg-(--btn-color)">Add To Cart</button>
      </div>
    </div>`;
  }
}

function filterCard (cardType) {
    const array = [];
    for (let i = 0; i < cardsData.length; i++) {
        if (cardsData[i].MRarty == cardType) array.push(cardsData[i]);
    }
    return array;
}

cardCategory.addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
        const type = e.target.value; // récupère le type
        if (type === "all") {
            renderCard(cardsData, true);
        } else {
            const filtrageData = cardsData.filter(card => card.MRarty === type);
            renderCard(filtrageData, true);
        }
    }
});


renderCard(cardsData);



let payButton = document.querySelectorAll('.panier-button');
let favouriteButton = document.querySelectorAll('.favourite-button');

// Map, ForEach: [1, 2, 3, 4] *2 [2, 4, 6, 8] map array.map((i) => {
// return i * 2;  
//}): newArray

// ForEach: [1, 2, 3, 4] forEach array.forEach((i) => {
// console.log(i); 
//}): void

// Filter: [1, 2, 3, 4] paire [2, 4] filter array.filter((i) => i % 2 === 0 );

payButton.forEach(button => {
  button.addEventListener('click', (e) => {
    console.log(button.value);
    let userCards = JSON.parse(localStorage.getItem("usercards")) || [];
    for (let i = 0; i < cardsData.length; i++) {
      if (cardsData[i].id == button.value) {
        if (cardsData[i].quantity <= 0) return alert("this cards is out of stock please wait until we refresh the stock and thank you!");
        let exist = false;
        userCards.forEach((cards) => { if (cards.id == cardsData[i].id) exist = true; })
        if (exist) return alert("you can't add the same card twise");
        alert('are you sure that you want to put this card in your panier');
        userCards.push(cardsData[i])
        localStorage.setItem("usercards", JSON.stringify(userCards));
      }
    }
  })
});

// favouriteButton.forEach(button => {
//   button.addEventListener('click', (e) => {
//     console.log(button.value);
//     let userFavouriteCards = JSON.parse(localStorage.getItem("userFavouriteCards")) || [];
//     for (let i = 0; i < cardsData.length; i++) {
//       if (cardsData[i].id == button.value) {
//         let exist = false;
//         userFavouriteCards.forEach((cards) => { if (cards.id == cardsData[i].id) exist = true; })
//         if (exist) return alert("you can't add the same card twise");
//         alert('are you sure that you want to put this card in your panier');
//         userFavouriteCards.push(cardsData[i])
//         localStorage.setItem("userFavouriteCards", JSON.stringify(userFavouriteCards));
//       }
//     }
//   })
// });

// const popup = document.getElementById('panier-popup');
// const panierButton = document.getElementById('card-button');
// const myCardContainer = document.getElementById('my-card-container');

// panierButton.addEventListener('click', () => {
//   popup.classList.toggle('hidden');
// })




// function renderMyCard() {
//   popup.innerHTML = '';
//   const myCard = JSON.parse(localStorage.getItem('usercards')) || [];

//   for (let i = 0; i < myCard.length; i++) {
//     popup.innerHTML += `
//   <div class="flex justify-between items-center bg-gray-800 p-2 rounded-lg">
//     <div class="flex flex-col">
//       <span>${myCard[i].name}</span>
//       <input type="number" id="quantity-input" min="1" value="1" max="${myCard[i].quantity}"
//               class="w-16 mt-1 text-center bg-black bg-opacity-50 text-yellow-300 border border-yellow-400 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400">
//     </div>
//     <span class="text-yellow-400 font-semibold">${myCard[i].price}$</span>
//   </div>
//   `;
//   }
// }
// renderMyCard();