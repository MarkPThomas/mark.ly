import Rack from './Rack';
import Ropes from './Ropes';
import CamsEnvelope from './CamsEnvelope';

class RackEnvelope {
  constructor() {
    this.cams = new Cams();
    this.ropes = new Ropes();
  }

  getRackNeeded(routes) {
    const rackNeeded = new Rack();
    console.log('Routes', routes);
    routes.forEach(route => {
      // Cams
      console.log('route.pitches[0].rack', route.pitches[0].rack);

      let camsForRoute = route.pitches[0].rack.cams;
      console.log('cams', camsForRoute);
      const camsNeeded = rackNeeded.cams;
      console.log('camsNeeded', camsNeeded);
      for (let i = 0; i < camsForRoute.length; i++) {
        let camForRoute = camsForRoute[i];
        const isInSet = (index) => {return (index !== -1)};

        const index = camsNeeded.findIndex((camNeeded) => {return (this.camsAreEqual(camNeeded, camForRoute));});
        console.log(index);
        if (isInSet(index)) {
          let currentCam = camsNeeded[i];
          if (currentCam.quantity < camForRoute.quantity) {
            camsNeeded[i] = camForRoute;
          }
          // else if (updatedComponent.quantity === 0) {
          //   camsNeeded.splice(index, 1);
          // }
        } else {
          camsNeeded.push(camForRoute);
        }
      }
      this.camsSortByMinRange(camsNeeded);

      // Ropes: TODO
    });
    return rackNeeded;
  }
}

export default RackEnvelope;