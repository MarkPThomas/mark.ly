import { Track } from "../Track";
import { SmoothManager } from "./SmoothManager";

export interface ISmoother {

}

export abstract class Smoother implements ISmoother {
  protected _smoothManager: SmoothManager;

  constructor(track: Track) {
    this._smoothManager = new SmoothManager(track);
  }
}