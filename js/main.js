var body = document.querySelector('body');
var nameInput = document.querySelector('#player-input');
var games = [];
var deck = new Deck();

window.addEventListener('load', loadInformationAboutGames);
body.addEventListener('click', chooseBodyClickAction);
nameInput.addEventListener('input', removeErrorMessage);

// *** LOADING FUNCTION ***
function loadInformationAboutGames() {
  pushFromLocalStorage();
}

// *** CLICK FUNCTIONS ***

function chooseBodyClickAction(event) {
  var target = event.target;
  if (target.classList.contains('top-players-list')) { activeTopPlayersList(target); }
  if (target.classList.contains('button')) { chooseButtonFunction(target); }
  if (target.classList.contains('back')) { seeCardImage(target); }
}

function chooseButtonFunction(target) {
  if (target.classList.contains('main-page')) {  createPlayer(); }
  if (target.classList.contains('welcome-page')) { startGame(target); }
  if (target.classList.contains('button--white')) { launchGame(target); }
  if (target.classList.contains('button--new-game')) { renewPlayerAndGame(); }
  if (target.classList.contains('button--rematch')) { rematchGame(target); }
}

// TOP PLAYERS LIST FUNCTIONS

function activeTopPlayersList(target) {
  if (target.innerHTML === "") {
    var topPlayers = getWinners();
    createTopPlayerList(target, topPlayers);
  } else {
    removeTopPlayersList(target);
  }
}

function createAllTimeArray() {
  var allTime = [];
  for (var i = 0; i < games.length; i++) {
    allTime.push(games[i].time.allTime);
  }
  return allTime.sort();
}

function getWinners() {
  var allTime = createAllTimeArray();
  var topPlayers = [];
  sortWinners(allTime, topPlayers);
  return topPlayers;
}

function sortWinners(allTime, topPlayers) {
  for (var i = 0; i < allTime.length; i++) {
    for (var k = 0; k < games.length; k++) {
      if (allTime[i] === games[k].time.allTime) {
        topPlayers.splice(i, 0, games[k]);
      }
    }
  }
  cutWinnersArray(topPlayers);
}

function cutWinnersArray(topPlayers) {
  if (topPlayers.length > 5) {
    topPlayers.splice(topPlayers.length - 6, topPlayers.length - 5);
  }
}

function createTopPlayerList(target, array) {
  var list = document.createElement('ul');
  target.appendChild(list);
  if (array.length != 0) {
    addTopPlayers(target, array);
  } else {
    showNotification(list);
  }
}

function showNotification(list) {
  list.innerHTML = '<p>there is no game yet</p>'
  list.style.padding = "20px";
}

function addTopPlayers(target, array) {
  for (var i = 0; i < array.length; i++) {
    createListItem(target, array, i);
  }
}

function createListItem(target, array, i) {
  var listParent = target.querySelector('ul');
  var listItem = document.createElement('li');
  listParent.appendChild(listItem);
  listItem.innerHTML = `
          <p>#${i + 1} TOP PLAYER: <span style="font-weight: 600;">${array[i].name}</span></p>
          <p>${array[i].time.minutes} minutes ${array[i].time.seconds} seconds</p>`;
}

function removeTopPlayersList(target) {
  target.querySelector('ul').remove();
}

// *** GAME PROCESS ***

// Function for creating player
function createPlayer(target) {
  var playerName = nameInput.value;
  if (playerName != "" && playerName.length < 33) {
    var player = new Player(playerName);
    deck.player = player;
    goToWelcomePageBody(playerName);
  }
  showError();
}

// Function for launching page with game rules
function goToWelcomePageBody(name) {
  removeMainPage();
  createWelcomePage(name);
}

// Function for launching game page
function startGame(target) {
  removeWelcomePage();
  createGamePage();
  createCards();
}

// Function for starting game
function launchGame(target) {
  deck.startTime = Date.now();
  showAllCards();
  target.disabled = true;
}

// Function for showing all cards
function showAllCards() {
  var cards = document.querySelectorAll('.card');
  for (var i = 0; i < cards.length; i++) {
    flipCard(cards[i]);
    setTimeout(backCard, 3000, cards[i]);
    cards[i].classList.add('back');
  }
}

// Flip card functions
function seeCardImage(target) {
  var card = deck.allCards[target.id - 1];
  var cardsSelected = deck.selectedCards;
  if (!cardsSelected.includes(card)) { deck.checkSelectedCards(card); }
  if (cardsSelected.length != 0 && cardsSelected.length < 3) { flipCard(target); }
  if (cardsSelected.length === 2) { setTimeout(checkMatchedCards, 1500);}
}

function flipCard(target) {
  var id = target.id;
  target.classList.add(`flip-${id}`);
  target.style.backgroundImage = `url('./image/${deck.allCards[id-1].image}.jpg')`;
  setTimeout(removeFlipClass, 250, target, id);
}

function flipCardBack(card1, card2) {
  if (card1.image != card2.image) {
    setTimeout(backCard, 1500, document.querySelector(`.card-${card1.id}`));
    setTimeout(backCard, 1500, document.querySelector(`.card-${card2.id}`));
    setClearSelectedCards(1501);
  }
}

function backCard(target, id) {
  var id = target.id;
  target.classList.add(`flip-${id}`);
  target.style.backgroundImage = "url('./image/logo.jpg')";
  setTimeout(removeFlipClass, 250, target, id);
}

function removeFlipClass(target, id) {
  target.classList.remove(`flip-${id}`);
}

// Function for checking matched cards
function checkMatchedCards() {
  var card1 = deck.selectedCards[0];
  var card2 = deck.selectedCards[1];
  removeMatchedCards(card1, card2);
  flipCardBack(card1, card2);
}

// Function for removing matched cards
function removeMatchedCards(card1, card2) {
  if (card1.image === card2.image) {
    deck.moveToMatched(card1, card2);
    document.querySelector('.matches-number').innerText = deck.matches;
    document.querySelector(`.card-${card1.id}`).remove();
    document.querySelector(`.card-${card2.id}`).remove();
    setClearSelectedCards(100);
    makePlayerWinner();
  }
}

// Function for ending game
function makePlayerWinner() {
  if (deck.matches === 5) {
    deck.endTime = Date.now();
    deck.getGameTime();
    localStorage.setItem(deck.player.round, JSON.stringify(deck.player));
    showWinnerPage();
    deck.startNextRound();
    deck.renewDeck();
  }
}

// Function for starting new game

function rematchGame(target) {
  removeWelcomePage(target);
  createGamePage();
  createCards();
}

function renewPlayerAndGame() {
  location.reload();
}

// *** CREATE PAGES FUNCTIONS ***

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
  showRecentGames();
}

function createCards() {
  var parent = document.querySelector('.cards-place');
  for (var i = 1; i < 11; i++) {
    var card = new Card();
    deck.addCards(card);
    createCardBody(parent, i);
  }
}

function createCardBody(parent, i) {
  var cardBody = document.createElement('div');
  cardBody.classList.add('card', `card-${i}`);
  cardBody.id = i;
  parent.appendChild(cardBody);
}

// Function for creating win game list
function showRecentGames() {
  var playerGame = getPlayerGames(deck.player.name);
  if (playerGame.length != 0) {
    showWinGamesInList(playerGame);
  }
}

function showWinGamesInList(playerGame) {
  for (var i = 0; i < playerGame.length; i++) {
    var parent = document.querySelector('.win-game-list');
    var article = document.createElement('article');
    article.innerHTML = `
      <p class="aside-text">round <span class="round-number">${playerGame[i].round}</span></p>
      <p class="aside-text"><span class="game-time">${playerGame[i].time.minutes}</span> minutes <span class="game-time">${playerGame[i].time.seconds}</span> seconds</p>`;
    parent.appendChild(article);
  }
}

function getPlayerGames(name) {
  var playerGames = [];
  for (var i = 0; i < games.length; i++) {
    if (games[i].name === name) {
      playerGames.push(games[i]);
    }
  }
  cutPlayerGamesArray(playerGames);
  return playerGames;
}

function cutPlayerGamesArray(array) {
  if (array.length > 3) {
    array.splice(0, array.length - 3)
  }
}

// Function for creating winner page
function showWinnerPage() {
  removeGamePage();
  createWinnerPage();
}

function createWinnerPage() {
  pushFromLocalStorage();
  createHeader();
  createtWinnerPageBody();
}

function createHeader() {
  var header = document.createElement('header');
  header.classList.add('header');
  header.innerHTML = '<nav class="top-players-list"></nav><h1>Which Stormtrooper</h1>';
  body.appendChild(header);
}

function createtWinnerPageBody() {
  var winnerPage = document.createElement('main');
  winnerPage.classList.add('content');
  winnerPage.innerHTML = getWinnerPageStructure();
  body.appendChild(winnerPage);
}

// Get page structures
function getWelcomePageStructure(name) {
  var explaneContent = `
      <h1>welcome <span class="h1 player-name">${deck.player.name}</span>!</h1>
      <article>The goal of the game is to find all 5 pairs of cards as quickly as possible. The player that finds the all pairs, wins.</article>
      <article>To begin playing, the player whose name is highlighted can click any card in the card pile. It will flip over and reveal a picture of Stormtrooper. Click another card. If they match, they will disappear and you will have completed a match! If they don't, you'll have three seconds to look at them before they flip back over. Then it's time for the other attempt to try!</article>
      <article>After you play, you'll see you name if you find all pairs and how long it took to win the game.</article>
      <button class="button welcome-page button--play-game" type="button" name="button">play game</button>`;
  return explaneContent;
}

function getGamePageStructure() {
  var gamePageStructure = `
  <aside class="player-information">
    <header>
      <h2 class="player-name">${deck.player.name}</h2>
    </header>
    <section>
      <p class="aside-text">matches</p>
      <p class="aside-text">this round</p>
      <p class="matches-number">${deck.matches}</p>
    </section>
    <section class="win-game-list">
      <h2>game wins</h2>
    </section>
    <button class="button button--white" type="button" name="button">start game</button>
  </aside>
  <aside class="cards-place"></aside>`;
  return gamePageStructure;
}

function getWinnerPageStructure() {
  var winnerPageStructure = `
    <section class="winner-information">
      <h1>congratulations, <span class="h1 player-name">${deck.player.name}</span> wins!</h1>
      <article class="time-information">It took you <span class="game-time">${deck.player.time.minutes}</span> minutes <span class="game-time">${deck.player.time.seconds}</span> seconds.</article>
      <article>Click below to keep playing.</article>
      <footer>
        <button class="button button--new-game" type="button" name="button">new game</button>
        <button class="button button--rematch" type="button" name="button">rematch</button>
      </footer>
    </section>`;
  return winnerPageStructure;
}
// *** REMOVING FUNCTIONS ***

// Remove page structures
function removeMainPage() {
  document.querySelector('.player-input-form').remove();
}

function removeWelcomePage() {
  document.querySelector('.content').remove();
  document.querySelector('.header').remove();
}

function removeGamePage() {
  document.querySelector('.game-board').remove();
}

// Function for clearing

function setClearSelectedCards(time) {
  setTimeout(clearSelectedCards, time)
}

function clearSelectedCards() {
  deck.selectedCards = [];
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
    createErrorBody(text);
  } else {
    errors[0].innerHTML = `
      <img src="./image/warning.svg">
      <p>${text}</p>`;
  }
}

function createErrorBody(text) {
  var parent = document.querySelector('.player-input-form');
  var errorMessage = document.createElement('div');
  errorMessage.classList.add('error');
  errorMessage.innerHTML = `
    <img src="./image/warning.svg">
    <p>${text}</p>`;
  parent.insertBefore(errorMessage, parent.firstElementChild);
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

// *** ARRAY FUNCTIONS ***

function pushFromLocalStorage() {
  games = [];
  for (var i = 1; i <= localStorage.length; i++) {
    var localStorageItem = JSON.parse(localStorage.getItem(i));
    games.push(localStorageItem);
  }
}
