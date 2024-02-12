import Rack from './Rack';
import RackEnvelope from './RackEnvelope';
import RackDifference from './RackDifference';

class User {
  constructor(userName = "Guest") {
    this.userName = userName;
    this.rack = new Rack();
    this.rackNeeded = new RackEnvelope();
    this.rackShort = new RackDifference();
  }
}

export default User;