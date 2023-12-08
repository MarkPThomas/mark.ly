import { INodeOfInterest } from "../../../../Geometry/Stats";

import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";

export interface IRateProperty {
  max: INodeOfInterest<TrackPoint, TrackSegment>;
  min: INodeOfInterest<TrackPoint, TrackSegment>;
  avg: number;
  // median: number;
  // stdDev1: number;
}