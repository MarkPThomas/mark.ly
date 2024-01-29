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
    if (TimeStamp.isMalformed(timeStampI) && TimeStamp.isMalformed(timeStampJ)) {
      // Assumed points providing timestamps do not have timestamps, therefore no time can elapse
      return 0;
    }
    if (TimeStamp.isMalformed(timeStampI) || TimeStamp.isMalformed(timeStampJ)) {
      // If one point has a timestamp to provide, the other should as well
      return undefined;
    }

    const dateI = new Date(timeStampI);
    const timeI = dateI.getTime();

    const dateJ = new Date(timeStampJ);
    const timeJ = dateJ.getTime();

    return (!Number.isNaN(timeI) && !Number.isNaN(timeJ))
      ? Math.round((timeJ - timeI) / 1000)
      : undefined;
  }

  private static isMalformed(val: any) {
    return val === '' || val === null || val === undefined;
  }
}