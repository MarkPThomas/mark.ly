import { ConstrainedStats } from "./ConstrainedStats";

export interface ISum {
  count: number,
  value: number,
}

export class Sum
  extends ConstrainedStats
  implements ISum {

  private _count: number = 0;
  get count(): number {
    return this._count;
  }

  private _value: number = 0;
  get value(): number {
    return this._value;
  }

  add(number: number) {
    if (this._isConsidered === null || this._isConsidered(number)) {
      this._count++;
      this._value += number;
    }
  }

  remove(number: number) {
    if ((this._isConsidered === null || this._isConsidered(number)) && this._count) {
      this._count--;
      this._value -= number;
    }
  }

  average() {
    return this._count ? this._value / this._count : 0;
  }
}