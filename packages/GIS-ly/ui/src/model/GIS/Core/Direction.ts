export type LatDirection = 'N' | 'S' | '';
export type LngDirection = 'E' | 'W' | '';

/**
 * Cardinal direction that the segment is pointing, directed from {@link TrackPoint} I towards {@link TrackPoint} J.
 *
 * @interface Direction
 */
export interface IDirection {
  lat: LatDirection;
  lng: LngDirection;
};

// export class Direction {

// }