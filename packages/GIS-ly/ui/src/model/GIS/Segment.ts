import {
  ISegment as ISegmentGeometry,
  Segment as SegmentGeometry
} from '../Geometry/Segment';

export interface ISegment extends ISegmentGeometry {
  direction?: {
    lat: string;
    lng: string;
  };
  duration?: number;
  /**
   * Speed in m/s
   *
   * @type {number}
   * @memberof ISegment
   */
  speed?: number;
  height?: number;
  heightRate?: number;
}

export class Segment extends SegmentGeometry implements ISegment {
  direction?: {
    lat: string;
    lng: string;
  };
  duration?: number;
  speed?: number;
  height?: number;
  heightRate?: number;
}