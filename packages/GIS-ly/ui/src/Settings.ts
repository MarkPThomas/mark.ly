import { IBaseLayer } from "./components/Leaflet/Layers/BaseLayers";
import { IInitialPosition } from "./components/Leaflet/Map";
import {
  ITrackCriteria,
  convertToGlobalDefaults
} from "./model/GIS/settings";

export interface ISettings {
  initialPosition: IInitialPosition;
  baseLayers: IBaseLayer[];
  trackCriteria: ITrackCriteria;
}

export class Settings implements ISettings {
  initialPosition: IInitialPosition;
  baseLayers: IBaseLayer[];
  trackCriteria: ITrackCriteria;

  constructor(config: any) {
    this.initialPosition = this.getInitialPosition(config.initialPosition);
    this.baseLayers = config.baseLayers;
    this.trackCriteria = this.normalizeUnits(config.trackCriteria);
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

    if (!initialPosition.zoom) { // || !Number.parseInt(initialPosition.zoom)) {
      initialPosition.zoom = 13;
    }

    return initialPosition as IInitialPosition;
  }

  normalizeUnits(trackCriteria: ITrackCriteria): ITrackCriteria {
    return convertToGlobalDefaults(trackCriteria);
  }
}