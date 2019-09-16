class Card {
  constructor() {
    this.id = 0;
    this.image = 'logo';
    this.matchInfo = this.image;
    this.matched = false;
  }

  getId(counter) {
    this.id = counter;
  }

  match() {
    this.matched = true;
  }

}
