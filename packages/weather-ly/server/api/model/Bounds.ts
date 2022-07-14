import { Coordinate, ICoordinate } from './Coordinate';

export interface IBounds {
  N: number,
  S: number,
  E: number,
  W: number,

  addCoords(coords: ICoordinate[]),
  addCoord(coord: ICoordinate)
}

export class Bounds implements IBounds {
  private _north: number;
  public get N() {
    return this._north;
  }

  private _south: number;
  public get S() {
    return this._south;
  }

  private _east: number;
  public get E() {
    return this._east;
  }

  private _west: number;
  public get W() {
    return this._west;
  }

  addCoords(coords: ICoordinate[] | [number, number][]) {
    console.log('addCoords', coords);
    coords.forEach(coord => this.addCoord(coord));
  }

  addCoord(coord: ICoordinate | [number, number]) {
    console.log('addCoord: ', coord);
    let coordCheck: ICoordinate = Array.isArray(coord) ? new Coordinate(coord) : coord;
    console.log('coordCheck: ', coordCheck);
    if (!this._north || coordCheck.latitude > this._north) {
      this._north = coordCheck.latitude;
    }
    if (!this._south || coordCheck.latitude < this._south) {
      this._south = coordCheck.latitude;
    }
    if (!this._east || coordCheck.longitude > this._east) {
      this._east = coordCheck.longitude;
    }
    if (!this._west || coordCheck.longitude < this._west) {
      this._west = coordCheck.longitude;
    }
  }
}