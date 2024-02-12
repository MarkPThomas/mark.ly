import Cam from './Cam';

class CamsDifference {
  constructor() {
    this.cams = [];
  }

  sortByMinRange(cams) {
    cams.sort((a, b) => a.minRange - b.minRange);
    return cams;
  }

  add(cam) {

  }

  remove(cam) {

  }

  update(cam) {

  }
}

export default CamsDifference;