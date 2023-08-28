export class GeoJsonConstants {
  /* istanbul ignore next */
  private constructor() { };

  /**
   * A Mercator project has a finite longitude values, this constant represents the lowest value available to represent a geolocation.
   *
   * @static
   * @memberof GeoJsonConstants
   */
  static MIN_LONGITUDE = -180;

  /**
   * A Mercator project has a finite longitude values, this constant represents the highest value available to represent a geolocation.
   *
   * @static
   * @memberof GeoJsonConstants
   */
  static MAX_LONGITUDE = 180;

  /**
   * While on a Mercator projected map the width (longitude) has a finite values, the height (latitude) can be infinitely long. This constant restrains the lower latitude value to -90 in order to preserve map readability and allows easier logic for tile selection.
   *
   * @static
   * @memberof GeoJsonConstants
   */
  static MIN_LATITUDE = -90;

  /**
   * While on a Mercator projected map the width (longitude) has a finite values, the height (latitude) can be infinitely long. This constant restrains the upper latitude value to 90 in order to preserve map readability and allows easier logic for tile selection.
   *
   * @static
   * @memberof GeoJsonConstants
   */
  static MAX_LATITUDE = 90;

  /**
   * +/- degrees added to a Point's bounding box.
   *
   * @static
   * @memberof GeoJsonConstants
   */
  static DEFAULT_BUFFER = 0.5;
}