import { Numbers } from '@markpthomas/math';

import { ICloneable, IEquatable } from 'common/interfaces';

import { IRoutePathPropsProperties, RoutePathProps } from "../Route/RoutePathProps";
import { ITrackSegmentProperties, TrackSegment } from './TrackSegment';

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @interface ITrackPathPropsProperties
 * @typedef {ITrackPathPropsProperties}
 * @extends {IRoutePathPropsProperties}
 */
export interface ITrackPathPropsProperties extends IRoutePathPropsProperties {
  /**
  * Average speed [m/s] at the node based on the speed of the segments before and after.
  * If one segment is missing or has no speed, this is the speed of the other segment.
  *
  * @type {number}
  * @memberof Coordinate
  */
  speed: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {number}
 */
  rotationRate: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {number}
 */
  ascentRate: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {number}
 */
  descentRate: number;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @interface ITrackPathProps
 * @typedef {ITrackPathProps}
 * @extends {ITrackPathPropsProperties}
 * @extends {ICloneable<TrackPathProps>}
 * @extends {IEquatable<ITrackPathPropsProperties>}
 */
export interface ITrackPathProps
  extends ITrackPathPropsProperties,
  ICloneable<TrackPathProps>,
  IEquatable<ITrackPathPropsProperties> {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITrackSegmentProperties} prevSegment
 * @param {ITrackSegmentProperties} nextSegment
 */
  addPropertiesFromPath(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ): void;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITrackSegmentProperties} prevSegment
 * @param {ITrackSegmentProperties} nextSegment
 */
  addElevationSpeedsFromPath(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ): void;
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @export
 * @class TrackPathProps
 * @typedef {TrackPathProps}
 * @extends {RoutePathProps}
 * @implements {ITrackPathProps}
 */
export class TrackPathProps
  extends RoutePathProps
  implements ITrackPathProps {

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {number}
 */
  speed: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {number}
 */
  rotationRate: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {number}
 */
  ascentRate: number;
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @type {number}
 */
  descentRate: number;

  /**
 * Creates an instance of TrackPathProps.
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @constructor
 * @param {?number} [rotation]
 * @param {number} [speed=0]
 * @param {?number} [rotationRate]
 * @param {number} [ascentRate=0]
 * @param {number} [descentRate=0]
 */
  constructor(rotation?: number, speed: number = 0, rotationRate?: number, ascentRate: number = 0, descentRate: number = 0) {
    super(rotation);

    this.speed = Math.abs(speed);
    this.rotationRate = rotationRate ?? null;
    this.ascentRate = Math.abs(ascentRate);
    this.descentRate = Math.abs(descentRate);
  }

  // === Common Interfaces ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @returns {TrackPathProps}
 */
  clone(): TrackPathProps {
    const pathProps = new TrackPathProps(
      this.rotation, this.speed, this.rotationRate, this.ascentRate, this.descentRate
    );
    return pathProps;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITrackPathPropsProperties} pathProps
 * @returns {boolean}
 */
  equals(pathProps: ITrackPathPropsProperties): boolean {
    return super.equals(pathProps)
      && pathProps.speed === this.speed
      && pathProps.rotationRate === this.rotationRate
      && pathProps.ascentRate === this.ascentRate
      && pathProps.descentRate === this.descentRate;
  }

  // === Methods ===
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITrackSegmentProperties} prevSegment
 * @param {ITrackSegmentProperties} nextSegment
 */
  addPropertiesFromPath(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ) {
    super.addPropertiesFromPath(prevSegment, nextSegment);
    this.speed = TrackSegment.calcAvgSpeedMPS(prevSegment, nextSegment);
    this.rotationRate = TrackSegment.calcAngularSpeedRadPerSec(prevSegment, nextSegment);
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @param {ITrackSegmentProperties} prevSegment
 * @param {ITrackSegmentProperties} nextSegment
 */
  addElevationSpeedsFromPath(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ) {
    // console.log('Deriving elevation data for points...')
    if (this.pointIsMaximaMinima(prevSegment, nextSegment)) {
      if (prevSegment.heightRate > 0) {
        this.ascentRate = prevSegment.heightRate
        this.descentRate = Math.abs(nextSegment.heightRate);
      } else {
        this.ascentRate = nextSegment.heightRate
        this.descentRate = Math.abs(prevSegment.heightRate);
      }
    } else {
      const elevationSpeed = TrackSegment.calcAvgElevationSpeedMPS(prevSegment, nextSegment);
      if (elevationSpeed !== undefined && elevationSpeed > 0) {
        this.ascentRate = elevationSpeed;
        this.descentRate = 0;
      } else if (elevationSpeed !== undefined && elevationSpeed < 0) {
        this.ascentRate = 0;
        this.descentRate = Math.abs(elevationSpeed);
      }
    }
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:55 PM
 *
 * @protected
 * @param {ITrackSegmentProperties} prevSegment
 * @param {ITrackSegmentProperties} nextSegment
 * @returns {boolean}
 */
  protected pointIsMaximaMinima(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ): boolean {
    return prevSegment?.heightRate && nextSegment?.heightRate
      ? Numbers.Sign(prevSegment.heightRate) !== Numbers.Sign(nextSegment.heightRate)
      : false;
  }
}