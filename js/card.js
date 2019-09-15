class Card {
  constructor() {
    this.id = 0;
    this.image = 'logo';
    this.matchInfo = this.image;
    this.matched = false;
  }

  getId(id) {
    this.id = id;
  }

  setImage(deck) {
    var random = Math.floor(Math.random() * deck.allImages.length);
    this.image = deck.allImages[random];
    this.matchInfo = this.image;
    deck.allImages.splice(random, 1);
  }

  match() {
    this.matched = true;
  }

}
