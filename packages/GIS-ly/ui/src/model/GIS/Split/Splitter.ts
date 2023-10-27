import { Track } from "../Track";
import { SplitManager } from "./SplitManager";

export interface ISplitter {

}

export abstract class Splitter implements ISplitter {
  protected _splitManager: SplitManager;

  constructor(track: Track, minTrackDuration?: number) {
    this._splitManager = new SplitManager(track, minTrackDuration);
  }
}