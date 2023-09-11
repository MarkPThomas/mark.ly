import config from '../config';

import { CoordinateNode } from "../../Geometry/Polyline";
import { Track } from "../Track/Track";
import { TrackPoint } from "../Track/TrackPoint";
import { TrackSegment } from "../Track/TrackSegment";

import { Smoother } from "./Smoother";

export class NoiseCloudSmoother extends Smoother {
  constructor(track: Track) { super(track); }

  public smoothNoiseClouds(minSpeedMS: number, iterate?: boolean) {
    const minRadiusMeters = minSpeedMS * config.GPS_INTERVAL_MIN_SEC;

    const totalRemovedNodes: CoordinateNode<TrackPoint, TrackSegment>[][] = [];

    let startCoordNode = this._smoothManager.track.firstPoint;
    let nextCoordNode = startCoordNode?.next as CoordinateNode<TrackPoint, TrackSegment>;
    while (startCoordNode && nextCoordNode) {
      if (this.isInCloud(startCoordNode, nextCoordNode, minRadiusMeters)) {
        const smoothingResults = this.smoothNextNoiseCloud(startCoordNode, nextCoordNode, minRadiusMeters);
        totalRemovedNodes.push(smoothingResults.removedNodes);

        if (iterate) {
          startCoordNode = smoothingResults.nextNode as CoordinateNode<TrackPoint, TrackSegment>;
          nextCoordNode = startCoordNode?.next as CoordinateNode<TrackPoint, TrackSegment>;
        } else {
          break;
        }
      } else {
        startCoordNode = startCoordNode.next as CoordinateNode<TrackPoint, TrackSegment>;
        nextCoordNode = nextCoordNode?.next as CoordinateNode<TrackPoint, TrackSegment>;
      }
    }

    return { nodes: totalRemovedNodes.flat().length, clouds: totalRemovedNodes.length };
  }

  protected smoothNextNoiseCloud(
    startCoordNode: CoordinateNode<TrackPoint, TrackSegment>,
    nextCoordNode: CoordinateNode<TrackPoint, TrackSegment>,
    minRadiusMeters: number) {
    const presumedPauseNode = startCoordNode;

    const removedNodes = [presumedPauseNode];
    let totalLat = presumedPauseNode.val.lat;
    let totalLng = presumedPauseNode.val.lng;
    let prevCoordNode: CoordinateNode<TrackPoint, TrackSegment>;
    while (nextCoordNode && this.isInCloud(presumedPauseNode, nextCoordNode, minRadiusMeters)) {
      totalLat += nextCoordNode.val.lat;
      totalLng += nextCoordNode.val.lng;
      prevCoordNode = nextCoordNode;

      removedNodes.push(nextCoordNode);

      nextCoordNode = nextCoordNode.next as CoordinateNode<TrackPoint, TrackSegment>;
    }

    const presumedResumeNode = prevCoordNode;
    const averageCoord = new TrackPoint(totalLat / removedNodes.length, totalLng / removedNodes.length);

    // Generate new nodes
    const smoothedPauseCoord = averageCoord.clone() as TrackPoint;
    (smoothedPauseCoord as TrackPoint).timestamp = presumedPauseNode.val.timestamp;
    const smoothedPauseNode = new CoordinateNode<TrackPoint, TrackSegment>(smoothedPauseCoord);

    const smoothedResumeCoord = averageCoord.clone() as TrackPoint;
    (smoothedResumeCoord as TrackPoint).timestamp = presumedResumeNode.val.timestamp;
    const smoothedResumeNode = new CoordinateNode<TrackPoint, TrackSegment>(smoothedResumeCoord);

    // Remove cloud nodes & connect new ones
    const lastNodeKept = removedNodes[0].prev as CoordinateNode<TrackPoint, TrackSegment>;
    const nextNodeKept = removedNodes[removedNodes.length - 1].next as CoordinateNode<TrackPoint, TrackSegment>;
    this._smoothManager.track.replaceNodesBetween(lastNodeKept, nextNodeKept, [smoothedPauseNode, smoothedResumeNode]);

    return { removedNodes, nextNode: nextNodeKept };
  }

  protected isInCloud(
    startCoord: CoordinateNode<TrackPoint, TrackSegment>,
    nextCoord: CoordinateNode<TrackPoint, TrackSegment>,
    minRadiusM: number
  ) {
    return startCoord.val.distanceTo(nextCoord.val) < minRadiusM;
  }
}