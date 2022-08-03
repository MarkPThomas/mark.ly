import { ICoordinate } from './Coordinate';
import { IBounds, Bounds } from './Bounds';
import { IElevation } from './NOAA';

export interface IGrid {
  gridId: string,
  gridX: number,
  gridY: number,
  elevation: IElevation
}

export class Grid implements IGrid {
  private _office: string;
  public get gridId() {
    return this._office;
  }
  private _gridX: number;
  public get gridX() {
    return this._gridX;
  }
  private _gridY: number;
  public get gridY() {
    return this._gridY;
  }

  private _elevation: IElevation;
  public get elevation() {
    return this._elevation;
  }

  private _bounds: IBounds;

  constructor(
    grid: IGrid,
    boundary: ICoordinate[] = [],
    elevation?: IElevation
  ) {
    this._office = grid.gridId;
    this._gridX = grid.gridX;
    this._gridY = grid.gridY;
    this._elevation = grid.elevation ?? elevation;
    this._bounds = new Bounds();
    this._bounds.addCoords(boundary);
  }

  isInGrid(coord: ICoordinate) {
    const bounds = this._bounds;
    return bounds
      ? bounds.S <= coord.latitude && coord.latitude <= bounds.N
      && bounds.W <= coord.longitude && coord.longitude <= bounds.E
      : false;
  }
}