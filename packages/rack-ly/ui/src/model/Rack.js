import Ropes from './Ropes';
import Cams from './Cams';

class Rack {
  constructor() {
    this.cams = new Cams();
    this.ropes = new Ropes();
  }
}

export default Rack;