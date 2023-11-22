import { IPointOfInterest } from "./IPointOfInterest";
import { Properties } from "./Properties";

export interface IMaxMin<T = any> {
  min: IPointOfInterest<T>,
  max: IPointOfInterest<T>
}

export class MaxMin<T = any>
  extends Properties
  implements IMaxMin<T>
{
  protected _tolerance: number;

  private _min: IPointOfInterest<T>;
  get min(): IPointOfInterest {
    return this._min;
  }

  private _max: IPointOfInterest<T>;
  get max(): IPointOfInterest {
    return this._max;
  }

  constructor(tolerance: number = 1e-6, isConsidered: (number: number) => boolean | null = null) {
    super(isConsidered);
    this._tolerance = Math.abs(tolerance);
  }

  add(number: number, ref: T = null, isConsidered: (number: number) => boolean | null = null) {
    if (isConsidered === null || isConsidered(number)) {
      if (this._min.value > number) {
        this._min.value = number;
        this._min.refs = [];
      }

      if (ref && Math.abs(this._min.value - number) <= this._tolerance) {
        this._min.refs.push(ref);
      }

      if (this._max.value < number) {
        this._max.value = number;
        this._max.refs = [];
      }

      if (ref && Math.abs(this._max.value - number) <= this._tolerance) {
        this._max.refs.push(ref);
      }
    }
  }
}