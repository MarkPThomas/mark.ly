import { ITilesLayer } from "./components/Leaflet/Layers/TileLayers";
import { IInitialPosition } from "./components/Leaflet/Map";
import {
  ITrackCriteria,
  convertTrackToGlobalUnits
} from "./model/GIS/settings";

export interface ISettings {
  initialPosition: IInitialPosition;
  baseLayers: ITilesLayer[];
  trackCriteria: ITrackCriteria;
}

export class Settings implements ISettings {
  initialPosition: IInitialPosition;
  baseLayers: ITilesLayer[];
  trackCriteria: ITrackCriteria;

  constructor(config: any) {
    this.initialPosition = this.getInitialPosition(config.initialPosition);
    this.baseLayers = config.baseLayers;

    console.log('config.trackCriteria:', config.trackCriteria)
    this.trackCriteria = this.normalizeUnits(config.trackCriteria);
    console.log('converted trackCriteria:', this.trackCriteria)
  }

  getInitialPosition(initialPosition: IInitialPosition): IInitialPosition {
    if (!initialPosition.point
      || initialPosition.point.length !== 2
      || !(typeof initialPosition.point[0] === 'number' && typeof initialPosition.point[1] === 'number')) {

      initialPosition.point = [
        37.7749,
        -122.4194
      ];
    }

    if (!initialPosition.zoom) {
      initialPosition.zoom = 13;
    }

    return initialPosition as IInitialPosition;
  }

  normalizeUnits(trackCriteria: ITrackCriteria): ITrackCriteria {
    return convertTrackToGlobalUnits(trackCriteria);
  }
}