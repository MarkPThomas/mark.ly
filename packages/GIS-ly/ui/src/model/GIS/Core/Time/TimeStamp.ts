export interface ITimeStamp {
  time: string;
}

export class TimeStamp implements ITimeStamp {
  protected _time: string;
  get time() {
    return this._time;
  }

  constructor(time: string) {
    this._time = time;
  }

  /**
  * Returns a time interval in seconds between two timestamps, or undefined if there is an error.
  *
  * @protected
  * @param {string} timeStampI UTC
  * @param {string} timeStampJ UTC
  * @return {*}
  * @memberof Track
  */
  static calcIntervalSec(timeStampI: string, timeStampJ: string): number | undefined {
    if (TimeStamp.isNullOrUndefined(timeStampI) && TimeStamp.isNullOrUndefined(timeStampJ)) {
      // Assumed points providing timestamps do not have timestamps, therefore no time can elapse
      return 0;
    }
    if (TimeStamp.isNullOrUndefined(timeStampI) || TimeStamp.isNullOrUndefined(timeStampJ)) {
      // If one point has a timestamp to provide, the other should as well
      return undefined;
    }

    const dateI = new Date(timeStampI);
    const timeI = dateI.getTime();

    const dateJ = new Date(timeStampJ);
    const timeJ = dateJ.getTime();

    return (!TimeStamp.isNullOrUndefined(timeI) && !TimeStamp.isNullOrUndefined(timeJ))
      ? Math.round((timeJ - timeI) / 1000)
      : undefined;
  }

  private static isNullOrUndefined(val: any) {
    return val === null || val === undefined;
  }
}