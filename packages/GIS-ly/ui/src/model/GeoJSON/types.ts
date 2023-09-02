/**
 * JSON representation of a Position in the form of:
 *
 * [longitude, latitude [, altitude] ]
 *
 * @export
 * @type Position
 */
export type Position = [number, number] | [number, number, number];

/**
 * JSON representation of a {@link BoundingBox} in the form of:
 *
 * [westLongitude, southLatitude, eastLongitude, northLatitude]
 *
 * @export
 * @type bboxJson
 */
export type bboxJson = [number, number, number, number];
