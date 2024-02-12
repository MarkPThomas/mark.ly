export interface ICoordinate {
  latitude: number,
  longitude: number
}

export class Coordinate implements ICoordinate {
  _latitude: number;
  public get latitude() {
    return this._latitude;
  }

  _longitude: number;
  public get longitude() {
    return this._longitude;
  }

  constructor(coord?: [number, number]) {
    if (coord) {
      this._latitude = coord[1];
      this._longitude = coord[0];
    }
  }

  getTuple() {
    return [this._latitude, this._longitude];
  }
}