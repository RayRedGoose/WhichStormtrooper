class Deck {
  constructor() {
    this.startTime = 0;
    this.endTime = 0;
    this.allImages = ['stt-1', 'stt-2', 'stt-3', 'stt-4', 'stt-5', 'stt-1', 'stt-2', 'stt-3', 'stt-4', 'stt-5'];
    this.allCards = [];
    this.matchedCards = [];
    this.selectedCards = [];
    this.matches = 0;
    this.player = {};
    this.playerTwo = {};
    this.numbersOfPlayers = 1;
  }

  addCards(card) {
    card.getId(this.allCards.length + 1);
    this.shuffle(card);
    this.allCards.push(card);
  }

  getGameTime(winner) {
    var allTime = this.endTime - this.startTime;
    var minutes = parseInt((allTime / 60000), 10);
    var seconds = parseInt(((allTime - (minutes * 60000)) / 1000), 10);
    winner.time = {minutes: minutes, seconds: seconds, allTime: allTime};
  }

  shuffle(card) {
    var random = Math.floor(Math.random() * this.allImages.length);
    card.image = this.allImages[random];
    card.matchInfo = card.image;
    this.allImages.splice(random, 1);
  }

  addSelectedCards(card) {
    this.selectedCards.push(card);
  }

  checkSelectedCards() {
    var result = this.selectedCards[0].image === this.selectedCards[1].image;
    return result;
  }

  moveToMatched(card1, card2) {
    var index1 = this.selectedCards[0].id - 1;
    var index2 = this.selectedCards[0].id - 1;
    this.allCards[index1].match();
    this.allCards[index2].match();
    this.matches++;
    var cards = {one: card1, two: card2};
    this.matchedCards.push(cards);
  }

  startNextRound() {
    this.player.round++;
  }

  renewDeck() {
    this.allImages = ['stt-1', 'stt-2', 'stt-3', 'stt-4', 'stt-5', 'stt-1', 'stt-2', 'stt-3', 'stt-4', 'stt-5'];
    this.allCards = [];
    this.matchedCards = [];
    this.selectedCards = [];
    this.matches = 0;
    this.player.matchCount = 0;
    this.playerTwo.matchCount = 0;
  }

  getOrder() {
    var order = Boolean(Math.floor(Math.random() * 2));
    this.player.order = order;
    this.playerTwo.order = !order;
  }

  changeOrder() {
    this.player.order = !this.player.order;
    this.playerTwo.order = !this.playerTwo.order;
  }
}
