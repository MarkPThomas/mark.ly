import { Numbers } from '../../../../../../common/utils/math/Numbers';

import { ICloneable, IEquatable } from '../../../../../../common/interfaces';

import { IRoutePathPropsProperties, RoutePathProps } from "../Route/RoutePathProps";
import { ITrackSegmentProperties, TrackSegment } from './TrackSegment';

export interface ITrackPathPropsProperties extends IRoutePathPropsProperties {
  /**
  * Average speed [m/s] at the node based on the speed of the segments before and after.
  * If one segment is missing or has no speed, this is the speed of the other segment.
  *
  * @type {number}
  * @memberof Coordinate
  */
  speed: number;
  rotationRate: number;
  ascentRate: number;
  descentRate: number;
}

export interface ITrackPathProps
  extends ITrackPathPropsProperties,
  ICloneable<TrackPathProps>,
  IEquatable<ITrackPathPropsProperties> {

  addPropertiesFromPath(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ): void;

  addElevationSpeedsFromPath(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ): void;
}

export class TrackPathProps
  extends RoutePathProps
  implements ITrackPathProps {

  speed: number = 0;
  rotationRate: number = 0;
  ascentRate: number = 0;
  descentRate: number = 0;

  constructor(rotation?: number, speed?: number, rotationRate?: number, ascentRate?: number, descentRate?: number) {
    super(rotation);

    this.speed = speed;
    this.rotationRate = rotationRate;
    this.ascentRate = ascentRate;
    this.descentRate = descentRate;
  }

  // === Common Interfaces ===
  clone(): TrackPathProps {
    const pathProps = new TrackPathProps(
      this.rotation, this.speed, this.rotationRate, this.ascentRate, this.descentRate
    );
    return pathProps;
  }

  equals(pathProps: ITrackPathPropsProperties): boolean {
    return super.equals(pathProps)
      && pathProps.speed === this.speed
      && pathProps.rotationRate === this.rotationRate
      && pathProps.ascentRate === this.ascentRate
      && pathProps.descentRate === this.descentRate;
  }

  // === Methods ===
  addPropertiesFromPath(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ) {
    super.addPropertiesFromPath(prevSegment, nextSegment);
    this.speed = TrackSegment.calcAvgSpeedMPS(prevSegment, nextSegment);
    this.rotationRate = TrackSegment.calcAngularSpeedRadPerSec(prevSegment, nextSegment);
  }

  addElevationSpeedsFromPath(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ) {
    console.log('Deriving elevation data for points...')
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

  protected pointIsMaximaMinima(
    prevSegment: ITrackSegmentProperties,
    nextSegment: ITrackSegmentProperties
  ): boolean {
    return prevSegment?.heightRate && nextSegment?.heightRate
      ? Numbers.Sign(prevSegment.heightRate) !== Numbers.Sign(nextSegment.heightRate)
      : false;
  }
}