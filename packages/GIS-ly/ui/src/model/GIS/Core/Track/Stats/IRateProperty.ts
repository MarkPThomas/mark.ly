import { INodeOfInterest } from "../../../../Geometry/Properties";

import { TrackPoint } from "../TrackPoint";
import { TrackSegment } from "../TrackSegment";

export interface IRateProperty {
  max: INodeOfInterest<TrackPoint, TrackSegment>;
  min: INodeOfInterest<TrackPoint, TrackSegment>;
  avg: number;
  // median: number;
  // stdDev1: number;
}