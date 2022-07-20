import Rope from './Rope';

class Ropes {
  constructor() {
    this.ropes = [];
  }

  sortByLength(ropes) {
    ropes.sort((a, b) => a.length - b.length)
      .sort((a, b) => a.diameter - b.diameter)
      .sort((a, b) => a.weight - b.weight)
      .sort((a, b) => a.type - b.type);
    return ropes;
  }

  contains(rope) {

  }

  add(rope) {

  }

  remove(rope) {

  }

  replace(rope) {

  }
}

export default Ropes;