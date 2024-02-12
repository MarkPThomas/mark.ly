import Rack from './Rack';
import Ropes from './Ropes';
import CamsDifference from './CamsDifference';

class RackDifference {
  constructor() {
    this.cams = new Cams();
    this.ropes = new Ropes();
  }

  getRackShort(rackAvailable, rackNeeded) {
    const rackShort = new Rack();

    // Cams
    const camsNeeded = rackNeeded.cams;
    const camsAvailable = rackAvailable.cams;
    for (let i = 0; i < camsNeeded.length; i++) {
      const camNeeded = camsNeeded[i];
      let camShort = {
        "_id": camNeeded._id,
        "manufacturer": camNeeded.manufacturer,
        "modelName": camNeeded.modelName,
        "lineName": camNeeded.lineName,
        "size": camNeeded.size,
        "color": camNeeded.color,
        "minRange": camNeeded.minRange,
        "minRangeUnit": camNeeded.minRangeUnit,
        "maxRange": camNeeded.maxRange,
        "maxRangeUnit": camNeeded.maxRangeUnit,
        "weight": camNeeded.weight,
        "weightUnit": camNeeded.weightUnit,
        "quantity": camNeeded.quantity
      };

      let camFound = false;
      for (let j = 0; j < camsAvailable.length; j++) {
        const camAvailable = camsAvailable[j];
        if (this.camsAreEqual(camAvailable.size, camNeeded.size)) {
          camFound = true;
          const quantityShort = camNeeded.quantity - camAvailable.quantity;
          if (quantityShort > 0) {
            camShort.quantity = quantityShort;
            rackShort.cams.push(camShort);
          }
          break;
        }
      }
      if (!camFound) {
        rackShort.cams.push(camShort);
      }
    }
    this.camsSortByMinRange(rackShort.cams);
    // Ropes: TODO

    return rackShort;
  }
}

export default RackDifference;