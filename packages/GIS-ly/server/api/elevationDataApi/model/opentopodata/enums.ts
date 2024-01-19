export enum DataSets {
  NED_10m = 'ned10m',
  EU_DEM_25m = 'eudem25m',
  NZ_DEM_8m = 'nzdem8m',
  ASTER_30m = 'aster30m'
}

export const DataSetProperties = {
  'ned10m': { url: 'https://www.opentopodata.org/datasets/ned/' },
  'eudem25m': { url: 'https://www.opentopodata.org/datasets/eudem/' },
  'nzdem8m': { url: 'https://www.opentopodata.org/datasets/nzdem/' },
  'aster30m': { url: 'https://www.opentopodata.org/datasets/aster/' }
}