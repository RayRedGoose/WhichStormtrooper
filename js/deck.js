class Deck {
  constructor() {
    this.round = decks.length + 1;
    this.startTime = 0;
    this.endTime = 0;
    this.allImages = ['stt-1', 'stt-2', 'stt-3', 'stt-4', 'stt-5', 'stt-1', 'stt-2', 'stt-3', 'stt-4', 'stt-5'];
    this.allCards = [];
    this.matchedCards = [];
    this.selectedCards = [];
    this.matches = 0;
    this.player = {};
  }

  addCards(card) {
    this.allCards.push(card);
  }

  getGameTime() {
    var allTime = this.endTime - this.startTime;
    var minutes = parseInt((allTime / 60000), 10);
    var seconds = parseInt(((allTime - (minutes * 60000)) / 1000), 10);
    this.player.time = {minutes: minutes, seconds: seconds};
  }

  shuffle(index) {
    var random = Math.floor(Math.random() * this.allImages.length);
    var card = this.allCards[index - 1];
    card.image = this.allImages[random];
    card.matchInfo = card.image;
    this.allImages.splice(random, 1);
  }

  checkSelectedCards(card) {
    this.selectedCards.push(card);
  }

  moveToMatched(card1, card2) {
    var index1 = decks[0].selectedCards[0].id - 1;
    var index2 = decks[0].selectedCards[0].id - 1;
    this.allCards[index1].match();
    this.allCards[index2].match();
    this.matches++;
    var cards = {one: card1, two: card2};
    this.matchedCards.push(cards);
  }
}
