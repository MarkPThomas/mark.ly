
/**
 * A form of Error that indicates an issue occurred during a GeoJSON operation.
 *
 * @export
 * @class GeoJsonException
 * @extends {Error}
 */
export class GeoJsonException extends Error {

}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @class LngLatOutOfRangeException
 * @typedef {LngLatOutOfRangeException}
 * @extends {GeoJsonException}
 */
export class LngLatOutOfRangeException extends GeoJsonException {

}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @export
 * @class InvalidGeometryException
 * @typedef {InvalidGeometryException}
 * @extends {GeoJsonException}
 */
export class InvalidGeometryException extends GeoJsonException {
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @static
 * @type {string}
 */
  static DEFAULT_MESSAGE = 'Invalid GeoJSON Geometry type. See https://datatracker.ietf.org/doc/html/rfc7946#section-1.4';
  /**
 * Creates an instance of InvalidGeometryException.
 * @date 2/11/2024 - 6:35:30 PM
 *
 * @constructor
 * @param {string} [message=InvalidGeometryException.DEFAULT_MESSAGE]
 */
  constructor(message: string = InvalidGeometryException.DEFAULT_MESSAGE) {
    super(message);
  }
}