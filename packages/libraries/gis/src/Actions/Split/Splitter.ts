import { Track } from "../../Core/Track/index";
import { SplitManager } from "./SplitManager";

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @export
 * @interface ISplitter
 * @typedef {ISplitter}
 */
export interface ISplitter {

}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @export
 * @abstract
 * @class Splitter
 * @typedef {Splitter}
 * @implements {ISplitter}
 */
export abstract class Splitter implements ISplitter {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @protected
 * @type {SplitManager}
 */
  protected _splitManager: SplitManager;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @protected
 * @type {number}
 */
  protected _minTrackDuration: number;

  /**
 * Creates an instance of Splitter.
 * @date 2/11/2024 - 6:34:51 PM
 *
 * @constructor
 * @param {Track} track
 * @param {number} [minTrackDuration=300]
 */
  constructor(track: Track, minTrackDuration: number = 300) {
    this._minTrackDuration = minTrackDuration;
    this._splitManager = new SplitManager(track, minTrackDuration);
  }
}