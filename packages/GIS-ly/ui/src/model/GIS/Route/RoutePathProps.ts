import { ICloneable, IEquatable } from '../../../../../../common/interfaces';
import { ISegmentProperties, Segment } from '../../Geometry/Segment';

export interface IRoutePathPropsProperties {
  rotation: number;
}

export interface IRoutePathProps
  extends IRoutePathPropsProperties,
  ICloneable<RoutePathProps>,
  IEquatable<IRoutePathPropsProperties> {

  addPropertiesFromPath(
    prevSegment: ISegmentProperties,
    nextSegment: ISegmentProperties
  ): void;
}

export class RoutePathProps
  implements IRoutePathProps {

  rotation: number;

  constructor(rotation?: number) {
    this.rotation = rotation;
  }

  clone(): RoutePathProps {
    const pathProps = new RoutePathProps(this.rotation);

    return pathProps;
  }

  equals(pathProps: IRoutePathPropsProperties): boolean {
    return pathProps.rotation === this.rotation;
  }

  // === Methods ===
  addPropertiesFromPath(
    prevSegment: ISegmentProperties,
    nextSegment: ISegmentProperties
  ) {
    this.rotation = Segment.calcPathRotationRad(prevSegment, nextSegment);
  }
}