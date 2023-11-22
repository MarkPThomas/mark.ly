export abstract class Properties {
  protected _isConsidered: (number: number) => boolean | null;

  constructor(isConsidered: (number: number) => boolean | null = null) {
    this._isConsidered = isConsidered;
  }
}