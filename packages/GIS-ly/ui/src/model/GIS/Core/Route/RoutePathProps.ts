import { ICloneable, IEquatable } from '../../../../../../../common/interfaces';
import { IRouteSegmentProperties, RouteSegment } from './RouteSegment';

export interface IRoutePathPropsProperties {
  rotation: number;
}

export interface IRoutePathProps
  extends IRoutePathPropsProperties,
  ICloneable<RoutePathProps>,
  IEquatable<IRoutePathPropsProperties> {

  addPropertiesFromPath(
    prevSegment: IRouteSegmentProperties,
    nextSegment: IRouteSegmentProperties
  ): void;
}

export class RoutePathProps
  implements IRoutePathProps {

  rotation: number = 0;

  constructor(rotation?: number) {
    this.rotation = rotation ?? null;
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
    prevSegment: IRouteSegmentProperties,
    nextSegment: IRouteSegmentProperties
  ) {
    this.rotation = RouteSegment.calcPathRotationRad(prevSegment, nextSegment);
  }
}