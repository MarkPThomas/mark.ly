import Cam from './Cam';

class Cams {
  constructor() {
    this.cams = [];
  }

  sortByMinRange(cams) {
    cams.sort((a, b) => a.minRange - b.minRange);
    return cams;
  }

  contains(cam) {

  }

  add(cam) {

  }

  remove(cam) {

  }

  replace(cam) {

  }
}

export default Cams;