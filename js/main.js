var body = document.querySelector('body');
var nameInput = document.querySelector('#player-input');
var decks = [];

body.addEventListener('click', chooseBodyClickAction);
nameInput.addEventListener('input', removeErrorMessage);


function chooseBodyClickAction(event) {
  if (event.target.classList.contains('main-page')) {  createPlayer(event.target); }
  if (event.target.classList.contains('welcome-page')) { startGame(event.target); }
  if (event.target.classList.contains('back')) { limitFlipFunction(event.target); }
  if (event.target.classList.contains('button--white')) { launchGame(event.target); }
}

function launchGame(target) {
  var start = Date.now();
  decks[0].startTime = start;
  var cards = document.querySelectorAll('.card');
  for (var i = 0; i < cards.length; i++) {
    flipCard(cards[i]);
    setTimeout(backCard, 3000, cards[i]);
    cards[i].classList.add('back');
  }
  target.disabled = true;
}

function createPlayer(target) {
  var playerName = nameInput.value;
  if (playerName != "" && playerName.length < 33) {
    var deck = new Deck(playerName);
    var player = new Player(playerName)
    decks.push(deck);
    deck.player = player;
    removeMainPage(target);
    createWelcomePage(playerName);
  } else {
    showError();
  }
}

function startGame(target) {
  removeWelcomePage(target);
  createGamePage();
}

// Create Welcome Page function
function createWelcomePage(name) {
  var parent = document.querySelector('.content');
  var newSection = document.createElement('section');
  newSection.classList.add('game-explanation');
  newSection.innerHTML = getWelcomePageStructure(name);
  parent.appendChild(newSection);
}

// Create Game Page function
function createGamePage() {
  var gamePage = document.createElement('main');
  gamePage.classList.add('game-board');
  gamePage.innerHTML = getGamePageStructure();
  body.appendChild(gamePage);
  createCards();
}

function createWinnerPage() {
  var header = document.createElement('header');
  header.classList.add('header');
  header.innerHTML = '<nav></nav><h1>Which Stormtrooper</h1>';
  body.appendChild(header);
  var winnerPage = document.createElement('main');
  winnerPage.classList.add('content');
  winnerPage.innerHTML = getWinnerPageStructure();
  body.appendChild(winnerPage);
}

function createCards() {
  var parent = document.querySelector('.cards-place');
  for (var i = 1; i < 11; i++) {
    var card = new Card();
    card.getId(i);
    decks[0].addCards(card);
    decks[0].shuffle(i);
    var cardBody = document.createElement('div');
    cardBody.classList.add('card', `card-${i}`);
    cardBody.id = i;
    parent.appendChild(cardBody);
  }
}

// Flip card functions
function limitFlipFunction(target) {
  var card = decks[0].allCards[target.id - 1];
  var cardsSelected = decks[0].selectedCards;
  if (!cardsSelected.includes(card)) {
    decks[0].checkSelectedCards(card);
  }
  if (cardsSelected.length != 0 && cardsSelected.length < 3) {
    flipCard(target);
  }
  if (cardsSelected.length === 2) {
    setTimeout(removeMatchedCards, 1500);
  }
}

function flipCard(target) {
  var id = target.id;
  target.classList.add(`flip-${id}`);
  target.style.backgroundImage = `url('./image/${decks[0].allCards[id-1].image}.jpg')`;
  setTimeout(removeFlipClass, 250, target, id);
}

function removeFlipClass(target, id) {
  target.classList.remove(`flip-${id}`);
}

function backCard(target, id) {
  var id = target.id;
  target.classList.add(`flip-${id}`);
  target.style.backgroundImage = "url('./image/logo.jpg')";
  setTimeout(removeFlipClass, 250, target, id);
}

// Get page structures
function getWelcomePageStructure(name) {
  var explaneContent = `
      <h1>welcome <span class="h1 player-name">${decks[0].player.name}</span>!</h1>
      <article>The goal of the game is to find all 5 pairs of cards as quickly as possible. The player that finds the all pairs, wins.</article>
      <article>To begin playing, the player whose name is highlighted can click any card in the card pile. It will flip over and reveal a picture of Stormtrooper. Click another card. If they match, they will disappear and you will have completed a match! If they don't, you'll have three seconds to look at them before they flip back over. Then it's time for the other attempt to try!</article>
      <article>After you play, you'll see you name if you find all pairs and how long it took to win the game.</article>
      <button class="welcome-page button--play-game" type="button" name="button">play game</button>`;
  return explaneContent;
}

function getGamePageStructure() {
  var gamePageStructure = `
  <aside class="player-information">
    <header>
      <h2 class="player-name">${decks[0].player.name}</h2>
    </header>
    <section>
      <p class="aside-text">matches</p>
      <p class="aside-text">this round</p>
      <p class="matches-number">${decks[0].matches}</p>
    </section>
    <section class="win-game-list">
      <h2>game wins</h2>
      <article>
        <p class="aside-text">round <span class="round-number">${decks[0].round}</span></p>
        <p class="aside-text"><span class="game-time">?</span> minutes</p>
      </article>
    </section>
    <button class="button--white" type="button" name="button">start game</button>
  </aside>
  <aside class="cards-place"></aside>`;
  return gamePageStructure;
}

function getWinnerPageStructure() {
  var winnerPageStructure = `
    <section class="winner-information">
      <h1>congratulations, <span class="h1 player-name">${decks[0].player.name}</span> wins!</h1>
      <article class="time-information">It took you <span class="game-time">${decks[0].player.time.minutes}</span> minutes <span class="game-time">${decks[0].player.time.seconds}</span> seconds.</article>
      <article>Click below to keep playing.</article>
      <footer>
        <button class="button--new-game" type="button" name="button">new game</button>
        <button class="button--rematch" type="button" name="button">rematch</button>
      </footer>
    </section>`;
  return winnerPageStructure;
}

// Remove page structures
function removeMainPage(target) {
  target.closest('.player-input-form').remove();
}

function removeWelcomePage(target) {
  target.closest('.content').remove();
  document.querySelector('.header').remove();
}

function removeMatchedCards() {
  var card1 = decks[0].selectedCards[0];
  var card2 = decks[0].selectedCards[1]
  var matchCondition = card1.image === card2.image;
  if (matchCondition) {
    decks[0].moveToMatched(card1, card2);
    document.querySelector('.matches-number').innerText = decks[0].matches;
    document.querySelector(`.card-${card1.id}`).remove();
    document.querySelector(`.card-${card2.id}`).remove();
    setClearSelectedCards(100);
    if (decks[0].matches === 5) {
      var end = Date.now();
      decks[0].endTime = end;
      decks[0].getGameTime();
      showWinnerPage();
    }
  } else {
    setTimeout(backCard, 1500, document.querySelector(`.card-${card1.id}`));
    setTimeout(backCard, 1500, document.querySelector(`.card-${card2.id}`));
    setClearSelectedCards(1501);
  }
}

function setClearSelectedCards(time) {
  setTimeout(clearSelectedCards, time)
}

function clearSelectedCards() {
  decks[0].selectedCards = [];
}

// *** ERROR FUNCTIONS ***

function showError() {
  var errorMessages = ["Please enter a name.", "Name can't be longer than 32 symbols"];
  if (nameInput.value === "") {
    createErrorMessage(errorMessages[0]);
    addErrorStyles();
  }
  if (nameInput.value.length > 32) {
    createErrorMessage(errorMessages[1]);
    addErrorStyles();
  }
}

function createErrorMessage(text) {
  var errors = document.querySelectorAll('.error');
  if (errors.length === 0) {
    var parent = document.querySelector('.player-input-form');
    var errorMessage = document.createElement('div');
    errorMessage.classList.add('error');
    errorMessage.innerHTML = `
      <img src="./image/warning.svg">
      <p>${text}</p>`;
    parent.insertBefore(errorMessage, parent.firstElementChild);
  } else {
    errors[0].innerHTML = `
      <img src="./image/warning.svg">
      <p>${text}</p>`;
  }
}

function addErrorStyles() {
  nameInput.classList.add('error-input');
}

function removeErrorMessage() {
  if (nameInput.value.length < 2 && document.querySelectorAll('.error').length != 0) {
    document.querySelector('.error').remove();
    nameInput.classList.remove('error-input');
  }
}

function showWinnerPage() {
  removeGamePage();
  createWinnerPage();
}

function removeGamePage() {
  document.querySelector('.game-board').remove();
}
