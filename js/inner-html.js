explaneContent.innerHTML = `
        <section class="game-explanation">
        <h1>welcome <span class="player-name"></span>!</h1>
        <article>The goal of the game is to find all 5 pairs of cards as quickly as possible. The player that finds the all pairs, wins.</article>
        <article>To begin playing, the player whose name is highlighted can click any card in the card pile. It will flip over and reveal a picture of Stormtrooper. Click another card. If they match, they will disappear and you will have completed a match! If they don't, you'll have three seconds to look at them before they flip back over. Then it's time for the other attempt to try!</article>
        <article>After you play, you'll see you name if you find all pairs and how long it took to win the game.</article>
        <button class="button--play-game" type="button" name="button">play game</button>
      </section>`;

winnerContent.innerHTML = `
      <section class="winner-information">
        <h1>congratulations, <span class="player-name"></span> wins!</h1>
        <article class="time-information">It took you <span class="game-time"></span>seconds.</article>
        <article>Click below to keep playing.</article>
        <footer>
          <button class="button--new-game" type="button" name="button">new game</button>
          <button class="button--rematch" type="button" name="button">rematch</button>
        </footer>
      </section>`;

game-board.innerHTML = `
  <aside class="player-information">
    <header>
      <h2 class="player-name">Player name</h2>
    </header>
    <section>
      <p class="aside-text">matches</p>
      <p class="aside-text">this round</p>
      <p class="matches-number">5</p>
    </section>
    <section class="win-game-list">
      <h2>game wins</h2>
      <article>
        <p class="aside-text">round <span class="round-number">?</span></p>
        <p class="aside-text"><span class="game-time">452.3</span> seconds</p>
      </article>
    </section>
  </aside>
  <aside class="game-place">
    <div class="card-1"></div>
    <div class="card-2"></div>
    <div class="card-3"></div>
    <div class="card-4"></div>
    <div class="card-5"></div>
    <div class="card-6"></div>
    <div class="card-7"></div>
    <div class="card-8"></div>
    <div class="card-9"></div>
    <div class="card-10"></div>
  </aside>`;
