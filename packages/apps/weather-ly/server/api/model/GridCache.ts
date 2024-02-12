import { ICoordinate, Coordinate } from "./Coordinate";
import { Grid, IGrid } from "./Grid";
import { IGeometry, IElevation } from "./NOAA";

export class GridCache {
  static cache: Grid[] = [];

  static getGrid(coord: ICoordinate): IGrid | null {
    let currentGrid: IGrid | null = null;
    GridCache.cache.forEach(grid => {
      if (grid.isInGrid(coord)) {
        console.log(`Getting Grid from cache`);
        currentGrid = grid;
        return;
      }
    });
    return currentGrid;
  }

  static getIndex(grid: IGrid): number {
    let index = -1;
    GridCache.cache.forEach((gridCurrent, indexCurrent) => {
      if (gridCurrent.gridId === grid.gridId
        && gridCurrent.gridX === grid.gridX
        && gridCurrent.gridY === grid.gridY) {
        console.log(`Getting Grid index from cache`);
        index = indexCurrent;
        return;
      }
    });
    return index;
  }

  static containsGrid(param: { grid?: IGrid, coord?: ICoordinate }): boolean {
    return param.grid
      ? GridCache.getIndex(param.grid) >= 0
      : param.coord
        ? GridCache.getGrid(param.coord) !== null
        : false;
  }

  static updateCache(grid: IGrid, geometry: IGeometry, elevation: IElevation) {
    console.log('Updating cache...');
    const gridIndex = GridCache.getIndex(grid);
    console.log(`Grid cached at index ${gridIndex}`);
    if (gridIndex >= 0) {
      const coords = [
        new Coordinate(geometry.coordinates[0][0]),
        new Coordinate(geometry.coordinates[0][1]),
        new Coordinate(geometry.coordinates[0][2]),
        new Coordinate(geometry.coordinates[0][3])
      ]
      GridCache.cache[gridIndex] = new Grid(grid, coords, elevation);
    }
  }
}