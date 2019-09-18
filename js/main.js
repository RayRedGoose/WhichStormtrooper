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
  if (target.classList.contains('pl-2')) { chooseTwoPlayer(); }
  if (target.classList.contains('pl-1')) { chooseOnePlayer(); }
  if (target.classList.contains('button')) { chooseButtonFunction(target); }
  if (target.classList.contains('back')) { seeCardImage(target); }
}

function chooseButtonFunction(target) {
  getActionForSPlayer(target);
  getActionForDPlayers(target);
}

function getActionForSPlayer(target) {
  if (target.classList.contains('main-page')) {  createPlayer(); }
  if (target.classList.contains('welcome-page')) { startGame(); }
  if (target.classList.contains('start-game')) { launchGame(target); }
  if (target.classList.contains('button--new-game')) { renewPlayerAndGame(); }
  if (target.classList.contains('button--rematch')) { rematchGame(); }
}

function getActionForDPlayers(target) {
  if (target.classList.contains('main-page-double')) { goToRules(); }
  if (target.classList.contains('welcome-page-double')) { goToPairGameBoard(); }
  if (target.classList.contains('button--rematch-double')) { rematchGameForBoth(); }
}

// *** CHOOSE NUMBER OF PLAYERS ***

function chooseTwoPlayer() {
  var parent = document.querySelector('.player-input-form');
  var button = document.querySelector('.button--play-game');
  var input = createInput();
  parent.insertBefore(input, button);
  deck.numbersOfPlayers = 2;
  document.querySelector('.main-page').classList.replace('main-page', 'main-page-double');
}

function chooseOnePlayer() {
  var parent = document.querySelector('.player-input-form');
  parent.querySelector('div').remove();
  deck.numbersOfPlayers = 1;
  document.querySelector('.main-page-double').classList.replace('main-page-double', 'main-page');
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
function createPlayer() {
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
function startGame() {
  removeWelcomePage();
  createGamePage();
  createCards();
}

// Function for starting game
function launchGame(target) {
  if (deck.playerTwo.hasOwnProperty('name')) {
    deck.getOrder();
    highlightName();
  }
  deck.startTime = Date.now();
  showAllCards();
  target.disabled = true;
}

// Function for showing all cards
function showAllCards() {
  var cards = document.querySelectorAll('.card');
  cards.forEach(flipEveryCard);
}

// Flip card functions
function flipEveryCard(elem) {
  flipCard(elem);
  setTimeout(backCard, 3000, elem);
  elem.classList.add('back');
}

function seeCardImage(target) {
  var card = deck.allCards[target.id - 1];
  var cardsSelected = deck.selectedCards;
  if (!cardsSelected.includes(card)) { deck.addSelectedCards(card); }
  if (cardsSelected.length != 0 && cardsSelected.length < 3) { flipCard(target); }
  if (deck.selectedCards.length === 2) { setTimeout(checkMatchedCards, 1500); }
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
    changeOrderPlayers();
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
  if (deck.checkSelectedCards()) {
    makeMatchedCard(card1, card2);
  } else {
    flipCardBack(card1, card2);
  }
}

function makeMatchedCard(card1, card2) {
  deck.moveToMatched(card1, card2);
  if (!deck.playerTwo.hasOwnProperty('name')) {
    makeMatchedCardsSPlayer(card1, card2);
  } else {
    makeMatchedCardsDPlayer(card1, card2);
  }
  clearMatchedCard(card1, card2);
}

function makeMatchedCardsSPlayer(card1, card2) {
  deck.player.matchCount++;
  document.querySelector('.matches-number').innerText = deck.player.matchCount;
  makePlayerWinner(deck.player);
}

// Function for ending game
function makePlayerWinner(winner) {
  if (deck.matches === 5) {
    makeChangesInDeck(winner);
    showWinnerPage(winner);
    changeRematchButton();
  }
}

function makeChangesInDeck(winner) {
  deck.endTime = Date.now();
  deck.getGameTime(deck.player);
  deck.getGameTime(deck.playerTwo);
  localStorage.setItem(winner.round, JSON.stringify(winner));
  deck.startNextRound();
  deck.renewDeck();
}

// Function for starting new game

function rematchGame() {
  removeWelcomePage();
  createGamePage();
  createCards();
}

function renewPlayerAndGame() {
  location.reload();
}

// *** TWO PLAYERS GAME PROCESS ***

function goToRules() {
  var playerOneName = document.querySelector('#player-input').value;
  var playerTwoName = document.querySelector('#player-input-2').value;
  if (playerTwoName != "" && playerTwoName.length < 33 && playerOneName != "" && playerOneName.length < 33) {
    launchRulesPageForDouble(playerTwoName);
  } else {
    showError();
  }
}

function launchRulesPageForDouble(playerTwoName) {
  createSecondPlayer(playerTwoName);
  createPlayer();
  changeWelcomePageStructure();
}

function createSecondPlayer(playerName) {
  var player = new Player(playerName);
  deck.playerTwo = player;
}

function changeWelcomePageStructure() {
  document.querySelector('.game-explanation').innerHTML = getDoubleWelcomePageStructure();
}

function goToPairGameBoard() {
  removeWelcomePage();
  createGamePage();
  changeStylesForBoard();
  createCards();
  createSecondPlayerBoard();
}

function changeStylesForBoard() {
  var gameBoard = document.querySelector('.game-board');
  gameBoard.style.gridTemplateColumns = "1fr 3fr 1fr";
}

function createSecondPlayerBoard() {
  var parent = document.querySelector('.game-board');
  var aside = document.createElement('aside');
  aside.classList.add('second-player');
  parent.appendChild(aside);
  aside.innerHTML = getPlayerInformetion();
  showRecentGames(deck.playerTwo.name, '.win-game-list-two');
}

function makeMatchedCardsDPlayer(card1, card2) {
  var blockOne = document.querySelector('.player-information');
  var blockTwo = document.querySelector('.second-player');
  showMatchesForFirstPlayer(blockOne)
  showMatchesForSecondPlayer(blockTwo)
  changeHighlight();
  showWinner();
}

function showMatchesForFirstPlayer(blockOne) {
  if (deck.player.order) {
    deck.player.findMatch();
    blockOne.querySelector('.matches-number').innerText = deck.player.matchCount;
  }
}

function showMatchesForSecondPlayer(blockTwo) {
  if (deck.playerTwo.order) {
    deck.playerTwo.findMatch();
    blockTwo.querySelector('.matches-number').innerText = deck.playerTwo.matchCount;
  }
}

function showWinner() {
  if (deck.player.matchCount > deck.playerTwo.matchCount) {
    var winner = deck.player;
  } else {
    var winner = deck.playerTwo;
  }
  makePlayerWinner(winner);
}

function rematchGameForBoth() {
  removeWelcomePage();
  createGamePage();
  changeStylesForBoard();
  createCards();
  createSecondPlayerBoard();
}

function changeRematchButton() {
  if (deck.playerTwo.hasOwnProperty('name')) {
  var button = document.querySelector('.button--rematch');
  button.classList.replace('button--rematch', 'button--rematch-double');
  }
}

// *** CREATE PAGES FUNCTIONS ***

// Create input for second player
function createInput() {
  var input = document.createElement('div');
  input.style.marginTop = '20px';
  input.innerHTML = `
    <label for="player-input">
      <input id="player-input-2" type="text" placeholder="Your name here">player 2 name
    </label>`;
  return input;
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
  showRecentGames(deck.player.name, '.win-game-list-one');
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
function showRecentGames(name, parentClass) {
  var playerGame = getPlayerGames(name);
  if (playerGame.length != 0) {
    showWinGamesInList(playerGame, parentClass);
  }
}

function showWinGamesInList(playerGame, parentClass) {
  for (var i = 0; i < playerGame.length; i++) {
    var parent = document.querySelector(parentClass);
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
function showWinnerPage(winner) {
  removeGamePage();
  createWinnerPage(winner);
}

function createWinnerPage(winner) {
  pushFromLocalStorage();
  createHeader();
  createWinnerPageBody(winner);
}

function createHeader() {
  var header = document.createElement('header');
  header.classList.add('header');
  header.innerHTML = '<nav class="top-players-list"></nav><h1>Which Stormtrooper</h1>';
  body.appendChild(header);
}

function createWinnerPageBody(winner) {
  var winnerPage = document.createElement('main');
  winnerPage.classList.add('content');
  winnerPage.innerHTML = getWinnerPageStructure(winner);
  body.appendChild(winnerPage);
}

// *** REMOVING FUNCTIONS ***

// Remove page structures
function removeMainPage() {
  document.querySelector('.player-input-form').remove();
  document.querySelector('.switch').remove();
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

function clearMatchedCard(card1, card2) {
  if (deck.matches < 5) {
    document.querySelector(`.card-${card1.id}`).remove();
    document.querySelector(`.card-${card2.id}`).remove();
    setClearSelectedCards(100);
  }
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

// *** HIGHLIGHTS FUNCTIONS ***

function highlightName() {
  if (deck.player.order) {
    highlightFirstName();
  }
  if (deck.playerTwo.order) {
    highlightSecondName();
  }
}

function highlightFirstName() {
  var blockOne = document.querySelector('.player-information');
  var nameOne = blockOne.querySelector('.player-name');
  nameOne.classList.add('highlighted');
}

function highlightSecondName() {
  var blockTwo = document.querySelector('.second-player');
  var nameTwo = blockTwo.querySelector('.player-name');
  nameTwo.classList.add('highlighted');
}

function removeHighlightName() {
  if (deck.player.order) {
    removeHighlightFirstName();
  }
  if (deck.playerTwo.order) {
    removeHighlightSecondName();
  }
}

function removeHighlightFirstName() {
  var blockOne = document.querySelector('.player-information');
  var nameOne = blockOne.querySelector('.player-name');
  nameOne.classList.remove('highlighted');
}

function removeHighlightSecondName() {
  var blockTwo = document.querySelector('.second-player');
  var nameTwo = blockTwo.querySelector('.player-name');
  nameTwo.classList.remove('highlighted');
}

function changeHighlight() {
  removeHighlightName();
  deck.changeOrder();
  highlightName();
}

function changeOrderPlayers() {
  if (deck.playerTwo.hasOwnProperty('name')) {
    changeHighlight();
  }
}

// *** PAGE STRUCTURES ***

function getWelcomePageStructure() {
  var explaneContent = `
      <h1>welcome <span class="h1 player-name">${deck.player.name}</span>!</h1>
      <article>The goal of the game is to find all 5 pairs of cards as quickly as possible. The player that finds the all pairs, wins.</article>
      <article>To begin playing, the player whose name is highlighted can click any card in the card pile. It will flip over and reveal a picture of Stormtrooper. Click another card. If they match, they will disappear and you will have completed a match! If they don't, you'll have three seconds to look at them before they flip back over. Then it's time for the other attempt to try!</article>
      <article>After you play, you'll see your name if you find all pairs and how long it took to win the game.</article>
      <button class="button welcome-page button--play-game" type="button" name="button">play game</button>`;
  return explaneContent;
}

function getDoubleWelcomePageStructure() {
  var explaneContent = `
      <h1>welcome <span class="h1 player-name">${deck.player.name}</span> and <span class="h1 player-name">${deck.playerTwo.name}</span>!</h1>
      <article>The goal of the game is to find all 5 pairs of cards as quickly as possible. The player that finds the greatestnumbers of pairs, wins.</article>
      <article>To begin playing, the player whose name is highlighted can click any card in the card pile. It will flip over and reveal a picture of Stormtrooper. Click another card. If they match, they will disappear and you will have completed a match! If they don't, you'll have three seconds to look at them before they flip back over. Then it's time for the other player to try!</article>
      <article>After you play, you'll see the name of the final winner and how long it took to win the game.</article>
      <button class="button welcome-page-double button--play-game" type="button" name="button">play game</button>`;
  return explaneContent;
}

function getGamePageStructure() {
  var gamePageStructure = `
  <aside class="player-information">
    <header><h2 class="player-name">${deck.player.name}</h2></header>
    <section>
      <p class="aside-text">matches</p>
      <p class="aside-text">this round</p>
      <p class="matches-number">${deck.player.matchCount}</p>
    </section>
    <section class="win-game-list win-game-list-one"><h2>game wins</h2></section>
    <button class="button start-game button--white" type="button" name="button">start game</button>
  </aside>
  <aside class="cards-place"></aside>`;
  return gamePageStructure;
}

function getPlayerInformetion() {
  var asideBlock = `
    <header><h2 class="player-name">${deck.playerTwo.name}</h2></header>
    <section>
      <p class="aside-text">matches</p>
      <p class="aside-text">this round</p>
      <p class="matches-number">${deck.playerTwo.matchCount}</p>
    </section>
    <section class="win-game-list win-game-list-two"><h2>game wins</h2></section>`;
  return asideBlock;
}

function getWinnerPageStructure(winner) {
  var winnerPageStructure = `
    <section class="winner-information">
      <h1>congratulations, <span class="h1 player-name">${winner.name}</span> wins!</h1>
      <article class="time-information">It took you <span class="game-time">${winner.time.minutes}</span> minutes <span class="game-time">${winner.time.seconds}</span> seconds.</article>
      <article>Click below to keep playing.</article>
      <footer>
        <button class="button winner-page button--new-game" type="button" name="button">new game</button>
        <button class="button winner-page button--rematch" type="button" name="button">rematch</button>
      </footer>
    </section>`;
  return winnerPageStructure;
}
