/**
 * A Position is an array of coordinates.
 * https://tools.ietf.org/html/rfc7946#section-3.1.1
 *
 * JSON representation of a Position in the form of:
 *
 * [x, y [, z] ] or
 * [longitude, latitude [, altitude] ]
 *
 * These coordinates are used to define any of the containing {@link Geometry} objects.
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
