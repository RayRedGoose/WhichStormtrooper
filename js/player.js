class Player {
  constructor(name) {
    this.round = games.length + 1;
    this.name = name.toLowerCase();
    this.time = 0;
    this.matchCount = 0;
    this.order = 0;
  }

  findMatch() {
    this.matchCount = this.matchCount + 1;
  }
}
