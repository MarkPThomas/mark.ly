
/**
 * A form of Error that indicates an issue occurred during a GeoJSON operation.
 *
 * @export
 * @class GeoJsonException
 * @extends {Error}
 */
export class GeoJsonException extends Error {

}

export class LngLatOutOfRangeException extends GeoJsonException {

}

export class InvalidGeometryException extends GeoJsonException {
  static DEFAULT_MESSAGE = 'Invalid GeoJSON Geometry type. See https://datatracker.ietf.org/doc/html/rfc7946#section-1.4';
  constructor(message: string = InvalidGeometryException.DEFAULT_MESSAGE) {
    super(message);
  }
}