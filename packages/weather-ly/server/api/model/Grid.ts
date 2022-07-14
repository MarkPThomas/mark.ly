import { IGrid } from './NOAA';
import { ICoordinate } from './Coordinate';
import { IBounds, Bounds } from './Bounds';

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

  private _bounds: IBounds;

  constructor(grid: IGrid, boundary: ICoordinate[] = []) {
    this._office = grid.gridId;
    this._gridX = grid.gridX;
    this._gridY = grid.gridY;
    this._bounds = new Bounds();
    this._bounds.addCoords(boundary);
  }

  isInGrid(coord: ICoordinate) {
    const bounds = this._bounds;
    console.log('Coordinate', coord);
    console.log(`Bounds N:${bounds.N}`);
    console.log(`Bounds S:${bounds.S}`);
    console.log(`Bounds E:${bounds.E}`);
    console.log(`Bounds W:${bounds.W}`);
    return bounds
      ? bounds.S <= coord.latitude && coord.latitude <= bounds.N
      && bounds.W <= coord.longitude && coord.longitude <= bounds.E
      : false;
  }
}