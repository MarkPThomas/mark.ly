import { ICloneable } from '../../../../../../common/interfaces';

import {
  LinkedListDoubleGeneric as List,
} from '../../../../../../common/utils/dataStructures';

import { BoundingBox } from '../../GeoJSON/BoundingBox';

import {
  CoordinateNode,
  IPolyline,
  Polyline,
  SegmentNode
} from '../../Geometry/Polyline';

// import { ElevationRequestApi } from '../../elevationDataApi';
import { ElevationRequestApi } from '../../../../../server/api/elevationDataApi';

import { RoutePoint } from './RoutePoint';
import { RouteSegment } from './RouteSegment';
import { IPointProperties } from '../Point/Point';

type CoordNode = CoordinateNode<RoutePoint, RouteSegment>;
type SegNode = SegmentNode<RoutePoint, RouteSegment>;

export interface IPolylineRouteMethods<TVertex extends RoutePoint, TSegment extends RouteSegment>
  extends
  IPolyline<TVertex, TSegment> {
  /**
     * Adds elevation data to the track for matching lat/long points.
     *
     * @param {Map<string, number>} elevations Elevations accessed by a lat/long string key of the `LatLngLiteral`
     * from { lat: number, lng: number } as a JSON string.
     * @memberof Track
     */
  addElevations(elevations: Map<string, number>): void;

  /**
   * Adds derived elevation properties to Segments and Points based on elevation data in the Points.
   *
   * @memberof ITrack
   */
  addElevationProperties(): void;

  /**
   * Queries an API to add mapped elevation data to the Polyline.
   *
   * @memberof Track
   */
  addElevationsFromApi(): void;
}

export interface IPolylineRoute<TVertex extends RoutePoint, TSegment extends RouteSegment>
  extends
  IPolylineRouteMethods<TVertex, TSegment>,
  ICloneable<IPolylineRoute<TVertex, TSegment>> {

  /**
   * Adds elevation data to the track for matching lat/long points.
   *
   * @param {Map<string, number>} elevations Elevations accessed by a lat/long string key of the `LatLngLiteral`
   * from { lat: number, lng: number } as a JSON string.
   * @memberof Track
   */
  addElevations(elevations: Map<string, number>): void;

  /**
   * Adds derived elevation properties to Segments and Points based on elevation data in the Points.
   *
   * @memberof ITrack
   */
  addElevationProperties(): void;

  /**
   * Queries an API to add mapped elevation data to the Polyline.
   *
   * @memberof Track
   */
  addElevationsFromApi(): void;
}

export class PolylineRoute<TVertex extends RoutePoint, TSegment extends RouteSegment>
  extends Polyline<TVertex, TSegment>
  implements IPolylineRoute<TVertex, TSegment> {

  constructor(coords: TVertex[]) {
    super(coords);
  }

  clone(): PolylineRoute<TVertex, TSegment> {
    const polylineRoute = new PolylineRoute([]);

    // polylineRoute._vertices.clone()
    // polylineRoute._segments.clone()

    return polylineRoute as PolylineRoute<TVertex, TSegment>;
  }

  copyRangeByPoints(
    startPoint: IPointProperties,
    endPoint: IPointProperties
  ): PolylineRoute<TVertex, TSegment> | null {
    let startNode;

    if (!startNode) {
      startNode = this.firstPoint;
      if (!startNode) {
        return null;
      }
    }

    const startNodeClone = startNode.clone() as CoordNode;

    // Duplicate vertices
    let currNode = startNode;
    let currNodeClone = startNodeClone;
    // while (currNode && currNode.next) {
    //   // Duplicate next & connect
    //   const nextNode = currNode.next as CoordNode;
    //   const nextNodeClone = nextNode.clone() as CoordNode;

    //   currNodeClone.next = nextNodeClone;
    //   nextNodeClone.prev = currNodeClone;

    //   if (nextNode.val.timestamp === endTime) {
    //     break;
    //   } else {
    //     currNodeClone = nextNodeClone;
    //     currNode = nextNode;
    //   }
    // }

    // Duplicate segments
    let startSegmentClone: SegNode;
    let prevSegmentClone: SegNode;
    currNode = startNode;
    currNodeClone = startNodeClone;
    // while (currNode && currNode.next) {
    //   const currSegment = currNode.nextSeg;
    //   const nextNode = currNode.next as CoordNode;
    //   const nextNodeClone = currNodeClone.next as CoordNode;

    //   const segmentClone = currSegment.clone() as SegNode;
    //   if (!startSegmentClone) {
    //     startSegmentClone = segmentClone;
    //   } else {
    //     segmentClone.prev = prevSegmentClone;
    //     prevSegmentClone.next = segmentClone;
    //   }
    //   segmentClone.prevCoord = currNodeClone;
    //   segmentClone.nextCoord = nextNodeClone;

    //   currNodeClone.nextSeg = segmentClone;
    //   nextNodeClone.prevSeg = segmentClone;

    //   if (nextNode.val.timestamp === endTime) {
    //     break;
    //   } else {
    //     prevSegmentClone = segmentClone;
    //     currNode = nextNode;
    //     currNodeClone = nextNodeClone;
    //   }
    // }

    const polylineRoute = new PolylineRoute([]);
    polylineRoute._vertices = List.fromHead<CoordNode, RoutePoint>(startNodeClone);
    polylineRoute._segments = List.fromHead<SegNode, RouteSegment>(startSegmentClone);

    return polylineRoute as PolylineRoute<TVertex, TSegment>;
  }
  // ===

  protected updateProperties(numberNodesAffected: number) {
    if (numberNodesAffected) {
      // regenerate all segments
      this.buildSegments();
      //    optimize: replace segment
      //     // coord.prevSeg
      //     // coord.nextSeg

      // update segment properties
      this.addProperties();
      //    optimize: update new segment properties and adjacent node properties
    }
  }

  protected addPropertiesToNodes() {
    super.addPropertiesToNodes();
    this.addPathPropertiesToCoords();
    // let coord = this._vertices.head as CoordNode;
    // while (coord) {
    //   coord.val.path.addPropertiesFromPath(coord.prevSeg?.val, coord.nextSeg?.val);

    //   coord = coord.next as CoordNode;
    // }
  }

  protected addPathPropertiesToCoords() {
    let coord = this._vertices.head as CoordNode;
    while (coord) {
      coord.val.path.addPropertiesFromPath(coord.prevSeg?.val, coord.nextSeg?.val);

      coord = coord.next as CoordNode;
    }
  }

  protected getSegment(prevCoord: RoutePoint, nextCoord: RoutePoint): TSegment {
    return RouteSegment.fromRoutePoints(prevCoord, nextCoord) as TSegment;
  }

  /**
   * Adds elevation-derived properties from nodes to segments.
   * Adds further elevation-derived properties from segments back to nodes.
   *
   * Does nothing if nodes do not have elevation properties.
   *
   * @memberof PolylineTrack
   */
  addElevationProperties() {
    this.addElevationDataToSegments();
  }


  addElevations(elevations: Map<string, number>) {
    this.addNodeElevations(elevations);
    this.addElevationProperties();
  }

  protected addNodeElevations(elevations: Map<string, number>) {
    console.log('Adding elevations to points...')
    let coord = this._vertices.head as CoordNode;
    while (coord) {
      const elevation = elevations.get(JSON.stringify({ lat: coord.val.lat, lng: coord.val.lng }));
      if (elevation) {
        coord.val.elevation = elevation;
      }

      coord = coord.next as CoordNode;
    }
  }

  addElevationsFromApi() {
    const coords = this._vertices.toArray();
    const boundingBox = BoundingBox.fromPoints(coords);
    console.log(`Getting elevations for ${coords.length} coords`);

    const elevationsApi = new ElevationRequestApi();
    elevationsApi.getElevations(coords, boundingBox)
      // TODO: How does this work with requests 100 at a time?
      .then((result) => {
        if (result.elevations) {
          console.log(`Received elevations for ${result.elevations.size} coords`);
          console.log('Result: ', result);

          this.addElevations(result.elevations);
        } else {
          console.log('No elevations received');
        }
      });
  }

  protected addElevationDataToSegments() {
    console.log('Deriving elevation data for segments...')
    let coord = this._vertices.head?.next as CoordinateNode<TVertex, TSegment>;
    while (coord) {
      const prevCoord = coord.prev as CoordinateNode<TVertex, TSegment>;
      const prevSegment = prevCoord.nextSeg?.val;

      if (prevSegment) {
        prevSegment.addElevationData(prevCoord.val, coord.val);
      }

      coord = coord.next as CoordinateNode<TVertex, TSegment>;
    }
  }
}