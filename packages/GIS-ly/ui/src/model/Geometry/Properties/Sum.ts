import { ConstrainedProperty } from "./ConstrainedProperty";

export interface ISum {
  count: number,
  value: number,
}

export class Sum
  extends ConstrainedProperty
  implements ISum {

  private _count: number;
  get count(): number {
    return this._count;
  }

  private _value: number;
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
    if (this._isConsidered === null || this._isConsidered(number)) {
      this._count--;
      this._value -= number;
    }
  }

  average() {
    return this._value / this._count;
  }
}