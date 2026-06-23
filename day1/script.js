// 1

let heading = document.getElementById("portfolio-title");
console.log(heading);

let description = document.getElementsByClassName("portfolio-desc");
console.log(description[0]);

function getAllParaElems() {
  const allParas = document.getElementsByTagName("p");
  const num = allParas.length;
  console.log(`There are ${num} paragraphs in this document`);
}

getAllParaElems();

const headingQS = document.querySelector("#portfolio-title");
console.log(headingQS);

const firstSectionPara = document.querySelector("section p");
console.log(firstSectionPara); // Logs the text paragraph inside Card 1

const allSections = document.querySelectorAll("section");
console.log(allSections); // Logs a NodeList containing all 3 <section> elements

function countAllParasWithQS() {
  const allParas = document.querySelectorAll("p");
  console.log(`There are ${allParas.length} paragraphs in this document`);
}
countAllParasWithQS();

// 2

const startCard = document.getElementById("card-2");
console.log("Starting Element (Card 2):", startCard);

const parent = startCard.parentElement;
console.log("Parent Node:", parent);

const firstChild = startCard.firstElementChild; // <h2> element inside Card 2
console.log("First Child:", firstChild);

const lastChild = startCard.lastElementChild; // <p> element inside Card 2
console.log("Last Child:", lastChild);

const nextSibling = startCard.nextElementSibling; // third <section>
console.log("Next Sibling:", nextSibling);

// 3
function addCard(title, body, imageUrl) {
  const container = document.getElementById("card-container");

  const newSection = document.createElement("section");
  const cardTitle = document.createElement("h2");
  const cardDescription = document.createElement("p");
  const cardImage = document.createElement("img");

  cardTitle.textContent = title;
  cardDescription.textContent = body;
  cardImage.src = imageUrl;
  cardImage.alt = "image form lorem picsum";

  newSection.appendChild(cardTitle);
  newSection.appendChild(cardDescription);
  newSection.appendChild(cardImage);

  container.appendChild(newSection);

  console.log("new card added");
}

// addCard(
//   "New - Card 4",
//   "This content was generated through DOM manipulation.",
//   "https://picsum.photos/id/128/200/200",
// );

// 4
function removeCard(id) {
  const cardToRemove = document.getElementById(id);
  if (cardToRemove) {
    cardToRemove.remove();
    console.log("removed card with id: ", id);
  }
}

// removeCard("card-2");

function clearAllCards() {
  const allCardsToRemove = document.querySelectorAll("section");
  if (allCardsToRemove.length > 0) {
    allCardsToRemove.forEach((card) => {
      card.remove();
    });
    console.log("removed all cards");
  }
}

// clearAllCards();
