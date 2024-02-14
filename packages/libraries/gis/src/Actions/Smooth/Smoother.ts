import { Track } from "../../Core/Track/index";
import { SmoothManager } from "./SmoothManager";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @export
 * @interface ISmoother
 * @typedef {ISmoother}
 */
export interface ISmoother {

}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @export
 * @abstract
 * @class Smoother
 * @typedef {Smoother}
 * @implements {ISmoother}
 */
export abstract class Smoother implements ISmoother {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @protected
 * @type {SmoothManager}
 */
  protected _smoothManager: SmoothManager;

  /**
 * Creates an instance of Smoother.
 * @date 2/11/2024 - 6:34:50 PM
 *
 * @constructor
 * @param {Track} track
 */
  constructor(track: Track) {
    this._smoothManager = new SmoothManager(track);
  }
}