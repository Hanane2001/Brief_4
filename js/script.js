let count;

let arr = [];

for (count = 1; count < 7; count++) {
    let cards = document.getElementById('id'+count);
    arr.push({cards});
    console.log(cards);
}



// let change = document.getElementById('image-rotate');


// change.addEventListener('click', function() {
//     for(let i=0;i<100;i++){
//         change.src = '../img/JL2G_EN_'+i+'-2x.png';
//     }
// });

// change.addEventListener('mousleave', function() {
//     change.style.transform = 'rotateY(180deg)';
// });