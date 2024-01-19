export abstract class ConstrainedStats {
  protected _isConsidered: (number: number) => boolean | null;

  constructor(isConsidered: (number: number) => boolean | null = null) {
    this._isConsidered = isConsidered;
  }
}