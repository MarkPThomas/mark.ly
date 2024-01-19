import { Track } from "../../Core/Track";
import { SplitManager } from "./SplitManager";

export interface ISplitter {

}

export abstract class Splitter implements ISplitter {
  protected _splitManager: SplitManager;
  protected _minTrackDuration: number;

  constructor(track: Track, minTrackDuration: number = 300) {
    this._minTrackDuration = minTrackDuration;
    this._splitManager = new SplitManager(track, minTrackDuration);
  }
}