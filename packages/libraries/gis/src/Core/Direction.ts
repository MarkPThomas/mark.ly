/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @typedef {LatDirection}
 */
export type LatDirection = 'N' | 'S' | '';
/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @export
 * @typedef {LngDirection}
 */
export type LngDirection = 'E' | 'W' | '';

/**
 * Cardinal direction that the segment is pointing, directed from {@link TrackPoint} I towards {@link TrackPoint} J.
 *
 * @interface Direction
 */
export interface IDirection {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {LatDirection}
 */
  lat: LatDirection;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:52 PM
 *
 * @type {LngDirection}
 */
  lng: LngDirection;
};

// export class Direction {

// }