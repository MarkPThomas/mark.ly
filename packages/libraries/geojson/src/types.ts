import { Geometry } from "./geometries";

/**
 * A Position is an array of coordinates.
 *
 * JSON representation of a Position in the form of:
 *
 * `[x, y [, z] ]` or
 * `[longitude, latitude [, altitude] ]`
 *
 * These coordinates are used to define any of the containing {@link Geometry} objects.
 *
 * **External Reference:** {@link https://tools.ietf.org/html/rfc7946#section-3.1.1 | GeoJSON Standard RFC 7946}
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
