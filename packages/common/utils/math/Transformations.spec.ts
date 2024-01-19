import {
  Transformations,
  CartesianCoordinate,
  AngularOffset,
  CartesianOffset,
} from './your-module'; // Update with your module import

describe('Transformations Tests', () => {
  const Tolerance = 0.00001;

  test('Initialization with Coordinates Results in Object with Immutable Coordinates Properties List', () => {
    const localOriginInGlobal = new CartesianCoordinate(3, 2);
    const localAxisXPtInGlobal = new CartesianCoordinate(5, 4);
    const transformations = new Transformations(localOriginInGlobal, localAxisXPtInGlobal);

    const angularOffset = new AngularOffset(Math.PI / 4);
    const offset = localOriginInGlobal.offsetFrom(CartesianCoordinate.Origin());

    expect(transformations.localOrigin).toEqual(localOriginInGlobal);
    expect(transformations.localAxisX).toEqual(localAxisXPtInGlobal);
    expect(transformations.displacement).toEqual(offset);
    expect(transformations.rotation.toAngle().degrees).toBeCloseTo(angularOffset.toAngle().degrees, 5);
  });

  describe('TransformToGlobal', () => {
    const testCases = [
      [4, 6, 3, 5, 1, 1, 2, 1], // Displaced Coord system in local Quad 1
      [4, 6, 5, 5, -1, 1, 0, 1], // Displaced Coord system in local Quad 2
      [4, 6, 5, 7, -1, -1, 0, -1], // Displaced Coord system in local Quad 3
      [4, 6, 3, 7, 1, -1, 2, -1], // Displaced Coord system in local Quad 4
      [4, 6, 7.071068, 1.414214, 0, 0, 1, 1], // Rotated system x-axis towards global Quad 1, local Quad 1
      [4, 6, 1.414214, -7.071068, 0, 0, -1, 1], // Rotated system x-axis towards global Quad 2, local Quad 4
      [4, 6, -7.071068, -1.414214, 0, 0, -1, -1], // Rotated system x-axis towards global Quad 3, local Quad 3
      [4, 6, -1.414214, 7.071068, 0, 0, 1, -1], // Rotated system x-axis towards global Quad 4, local Quad 2
      [4, 6, 2.12132, -3.535534, 3, 2, 2, 3], // Translated & Rotated system with x-axis towards global Quad 2, local coord in Quad 4
      [4, 6, -3.535534, -2.12132, 3, 2, 2, 1], // Translated & Rotated system with x-axis towards global Quad 3, local coord in Quad 3
      [4, 6, -2.12132, 3.535534, 3, 2, 4, 1], // Translated & Rotated system with x-axis towards global Quad 4, local coord in Quad 2
      [4, 6, 3.535534, 2.12132, 3, 2, 4, 3], // Translated & Rotated system with x-axis towards global Quad 1, local coord in Quad 1
      [-7, 3, 3.535534, 2.12132, -3, 2, -4, 3], // Translated & Rotated system with x-axis towards global Quad 2, local coord in Quad 1
      [-4, -6, 3.535534, 2.12132, -3, -2, -4, -3], // Translated & Rotated system with x-axis towards global Quad 3, local coord in Quad 1
      [7, -3, 3.535534, 2.12132, 3, -2, 4, -3], // Translated & Rotated system with x-axis towards global Quad 4, local coord in Quad 1
      [7, 3, 3.535534, -2.12132, 3, 2, 4, 3], // Translated & Rotated system with x-axis towards global Quad 1, local coord in Quad 4
      [-4, 6, 3.535534, -2.12132, -3, 2, -4, 3], // Translated & Rotated system with x-axis towards global Quad 2, local coord in Quad 4
      [-7, -3, 3.535534, -2.12132, -3, -2, -4, -3], // Translated & Rotated system with x-axis towards global Quad 3, local coord in Quad 4
      [4, -6, 3.535534, -2.12132, 3, -2, 4, -3], // Translated & Rotated system with x-axis towards global Quad 4, local coord in Quad 4
      [-1, 1, -3.535534, 2.12132, 3, 2, 4, 3], // Translated & Rotated system with x-axis towards global Quad 1, local coord in Quad 2
      [-2, -2, -3.535534, 2.12132, -3, 2, -4, 3], // Translated & Rotated system with x-axis towards global Quad 2, local coord in Quad 2
      [1, -1, -3.535534, 2.12132, -3, -2, -4, -3], // Translated & Rotated system with x-axis towards global Quad 3, local coord in Quad 2
      [2, 2, -3.535534, 2.12132, 3, -2, 4, -3], // Translated & Rotated system with x-axis towards global Quad 4, local coord in Quad 2
      [2, -2, -3.535534, -2.12132, 3, 2, 4, 3], // Translated & Rotated system with x-axis towards global Quad 1, local coord in Quad 3
      [1, 1, -3.535534, -2.12132, -3, 2, -4, 3], // Translated & Rotated system with x-axis towards global Quad 2, local coord in Quad 3
      [-2, 2, -3.535534, -2.12132, -3, -2, -4, -3], // Translated & Rotated system with x-axis towards global Quad 3, local coord in Quad 3
      [-1, -1, -3.535534, -2.12132, 3, -2, 4, -3], // Translated & Rotated system with x-axis towards global Quad 4, local coord in Quad 3
    ];

    test.each(testCases)(
      'TransformToGlobal Transforms Local Coordinate to Global - Test Case',
      (
        globalCoordinateX,
        globalCoordinateY,
        localCoordinateX,
        localCoordinateY,
        localOriginInGlobalX,
        localOriginInGlobalY,
        localAxisXPtInGlobalX,
        localAxisXPtInGlobalY
      ) => {
        const localOriginInGlobal = new CartesianCoordinate(
          localOriginInGlobalX,
          localOriginInGlobalY,
          Tolerance
        );
        const localAxisXPtInGlobal = new CartesianCoordinate(
          localAxisXPtInGlobalX,
          localAxisXPtInGlobalY,
          Tolerance
        );
        const transformations = new Transformations(
          localOriginInGlobal,
          localAxisXPtInGlobal
        );

        const coordinateLocal = new CartesianCoordinate(
          localCoordinateX,
          localCoordinateY,
          Tolerance
        );
        const coordinateGlobalExpected = new CartesianCoordinate(
          globalCoordinateX,
          globalCoordinateY,
          Tolerance
        );

        const coordinateGlobal = transformations.transformToGlobal(
          coordinateLocal
        );

        expect(coordinateGlobal).toEqual(coordinateGlobalExpected);
      }
    );
  });

  describe('TransformToLocal', () => {
    const testCases = [
      [4, 6, 3, 5, 1, 1, 2, 1], // Displaced Coord system in local Quad 1
      [4, 6, 5, 5, -1, 1, 0, 1], // Displaced Coord system in local Quad 2
      [4, 6, 5, 7, -1, -1, 0, -1], // Displaced Coord system in local Quad 3
      [4, 6, 3, 7, 1, -1, 2, -1], // Displaced Coord system in local Quad 4
      [4, 6, 7.071068, 1.414214, 0, 0, 1, 1], // Rotated system x-axis towards global Quad 1, local Quad 1
      [4, 6, 1.414214, -7.071068, 0, 0, -1, 1], // Rotated system x-axis towards global Quad 2, local Quad 4
      [4, 6, -7.071068, -1.414214, 0, 0, -1, -1], // Rotated system x-axis towards global Quad 3, local Quad 3
      [4, 6, -1.414214, 7.071068, 0, 0, 1, -1], // Rotated system x-axis towards global Quad 4, local Quad 2
      [4, 6, 2.12132, -3.535534, 3, 2, 2, 3], // Translated & Rotated system with x-axis towards global Quad 2, local coord in Quad 4
      [4, 6, -3.535534, -2.12132, 3, 2, 2, 1], // Translated & Rotated system with x-axis towards global Quad 3, local coord in Quad 3
      [4, 6, -2.12132, 3.535534, 3, 2, 4, 1], // Translated & Rotated system with x-axis towards global Quad 4, local coord in Quad 2
      [4, 6, 3.535534, 2.12132, 3, 2, 4, 3], // Translated & Rotated system with x-axis towards global Quad 1, local coord in Quad 1
      [-7, 3, 3.535534, 2.12132, -3, 2, -4, 3], // Translated & Rotated system with x-axis towards global Quad 2, local coord in Quad 1
      [-4, -6, 3.535534, 2.12132, -3, -2, -4, -3], // Translated & Rotated system with x-axis towards global Quad 3, local coord in Quad 1
      [7, -3, 3.535534, 2.12132, 3, -2, 4, -3], // Translated & Rotated system with x-axis towards global Quad 4, local coord in Quad 1
      [7, 3, 3.535534, -2.12132, 3, 2, 4, 3], // Translated & Rotated system with x-axis towards global Quad 1, local coord in Quad 4
      [-4, 6, 3.535534, -2.12132, -3, 2, -4, 3], // Translated & Rotated system with x-axis towards global Quad 2, local coord in Quad 4
      [-7, -3, 3.535534, -2.12132, -3, -2, -4, -3], // Translated & Rotated system with x-axis towards global Quad 3, local coord in Quad 4
      [4, -6, 3.535534, -2.12132, 3, -2, 4, -3], // Translated & Rotated system with x-axis towards global Quad 4, local coord in Quad 4
      [-1, 1, -3.535534, 2.12132, 3, 2, 4, 3], // Translated & Rotated system with x-axis towards global Quad 1, local coord in Quad 2
      [-2, -2, -3.535534, 2.12132, -3, 2, -4, 3], // Translated & Rotated system with x-axis towards global Quad 2, local coord in Quad 2
      [1, -1, -3.535534, 2.12132, -3, -2, -4, -3], // Translated & Rotated system with x-axis towards global Quad 3, local coord in Quad 2
      [2, 2, -3.535534, 2.12132, 3, -2, 4, -3], // Translated & Rotated system with x-axis towards global Quad 4, local coord in Quad 2
      [2, -2, -3.535534, -2.12132, 3, 2, 4, 3], // Translated & Rotated system with x-axis towards global Quad 1, local coord in Quad 3
      [1, 1, -3.535534, -2.12132, -3, 2, -4, 3], // Translated & Rotated system with x-axis towards global Quad 2, local coord in Quad 3
      [-2, 2, -3.535534, -2.12132, -3, -2, -4, -3], // Translated & Rotated system with x-axis towards global Quad 3, local coord in Quad 3
      [-1, -1, -3.535534, -2.12132, 3, -2, 4, -3], // Translated & Rotated system with x-axis towards global Quad 4, local coord in Quad 3
    ];

    test.each(testCases)(
      'TransformToLocal Transforms Global Coordinate to Local - Test Case',
      (
        globalCoordinateX,
        globalCoordinateY,
        localCoordinateX,
        localCoordinateY,
        localOriginInGlobalX,
        localOriginInGlobalY,
        localAxisXPtInGlobalX,
        localAxisXPtInGlobalY
      ) => {
        const localOriginInGlobal = new CartesianCoordinate(
          localOriginInGlobalX,
          localOriginInGlobalY,
          Tolerance
        );
        const localAxisXPtInGlobal = new CartesianCoordinate(
          localAxisXPtInGlobalX,
          localAxisXPtInGlobalY,
          Tolerance
        );
        const transformations = new Transformations(
          localOriginInGlobal,
          localAxisXPtInGlobal
        );

        const coordinateGlobal = new CartesianCoordinate(
          globalCoordinateX,
          globalCoordinateY,
          Tolerance
        );
        const coordinateLocalExpected = new CartesianCoordinate(
          localCoordinateX,
          localCoordinateY,
          Tolerance
        );

        const coordinateLocal = transformations.transformToLocal(
          coordinateGlobal
        );

        expect(coordinateLocal).toEqual(coordinateLocalExpected);
      }
    );
  });
});
