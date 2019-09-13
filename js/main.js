var body = document.querySelector('body');
var nameInput = document.querySelector('#player-input');
var names = [];

body.addEventListener('click', choosePlayGameBtnAction);

function choosePlayGameBtnAction(event) {
  if (event.target.classList.contains('main-page')) {
    submitName(event.target);
  }
  if (event.target.classList.contains('welcome-page')) {
    startGame(event.target);
  }
}

function submitName(target) {
  var playerName = nameInput.value;
  names.push(playerName);
  if (playerName != "" && playerName.length < 33) {
    removeMainPage(target);
    createWelcomePage(playerName);
  } else {
    showError();
  }
}

function removeMainPage(target) {
  target.closest('.player-input-form').remove();
}

function createWelcomePage(name) {
  var pageStructure = defineStructureOfWelcomePage(name);
  var parent = document.querySelector('.content');
  var newSection = document.createElement('section');
  newSection.classList.add('game-explanation');
  newSection.innerHTML = pageStructure;
  parent.appendChild(newSection);
}

function defineStructureOfWelcomePage(name) {
  var explaneContent = `
      <h1>welcome <span class="h1 player-name">${name}</span>!</h1>
      <article>The goal of the game is to find all 5 pairs of cards as quickly as possible. The player that finds the all pairs, wins.</article>
      <article>To begin playing, the player whose name is highlighted can click any card in the card pile. It will flip over and reveal a picture of Stormtrooper. Click another card. If they match, they will disappear and you will have completed a match! If they don't, you'll have three seconds to look at them before they flip back over. Then it's time for the other attempt to try!</article>
      <article>After you play, you'll see you name if you find all pairs and how long it took to win the game.</article>
      <button class="welcome-page button--play-game" type="button" name="button">play game</button>`;
  return explaneContent;
}

function showError() {
  var playerName = nameInput.value;
  var emptyInput = "Please enter a name.";
  var longName = "Name can't be longer than 32 symbols"
  if (playerName === "") {
    createErrorMessage(emptyInput);
    addErrorStyles();
  }
  if (playerName.length > 32) {
    createErrorMessage(longName);
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

nameInput.addEventListener('input', removeErrorMessage);

function removeErrorMessage() {
  if (nameInput.value.length < 2 && document.querySelectorAll('.error').length != 0) {
    document.querySelector('.error').remove();
    nameInput.classList.remove('error-input');
  }
}

function startGame(target) {
  removeWelcomePage(target);
  createGamePage();
}

function removeWelcomePage(target) {
  target.closest('.content').remove();
  document.querySelector('.header').remove();
}

function createGamePage() {
  var gamePage = document.createElement('main');
  gamePage.classList.add('game-board');
  gamePage.innerHTML = getGamePageStructure();
  body.appendChild(gamePage);
}

function getGamePageStructure() {
  var gamePageStructure = `
  <aside class="player-information">
    <header>
      <h2 class="player-name">${names[0]}</h2>
    </header>
    <section>
      <p class="aside-text">matches</p>
      <p class="aside-text">this round</p>
      <p class="matches-number">?</p>
    </section>
    <section class="win-game-list">
      <h2>game wins</h2>
      <article>
        <p class="aside-text">round <span class="round-number">?</span></p>
        <p class="aside-text"><span class="game-time">?</span> seconds</p>
      </article>
    </section>
  </aside>
  <aside class="game-place">
    <div class="back card card-1"></div>
    <div class="back card card-2"></div>
    <div class="back card card-3"></div>
    <div class="back card card-4"></div>
    <div class="back card card-5"></div>
    <div class="back card card-6"></div>
    <div class="back card card-7"></div>
    <div class="back card card-8"></div>
    <div class="back card card-9"></div>
    <div class="back card card-10"></div>
  </aside>`;
  return gamePageStructure;
}


body.addEventListener('click', flipCard);

function flipCard(event) {
  if (event.target.classList.contains('back')) {
    event.target.classList.add('front');
    event.target.classList.remove('back');
    event.target.style.backgroundImage = "url('./image/stt-5.jpg')";
    setTimeout(backCard, 3000, event.target);
  }
}

function backCard(target) {
  target.classList.add('back');
  target.classList.remove('front');
  target.style.backgroundImage = "url('./image/logo.jpg')";
}
