import { Transformations } from './Transformations';
import { CartesianCoordinate } from './Coordinates/CartesianCoordinate';
import { AngularOffset } from './Coordinates/AngularOffset';

describe('##Transformations', () => {
  const tolerance = 0.00001;
  const decimalPlace = tolerance.toString().split('.')[1].length;

  test('Initialization with Coordinates Results in Object with Immutable Coordinates Properties List', () => {
    const localOriginInGlobal = new CartesianCoordinate(3, 2);
    const localAxisXPtInGlobal = new CartesianCoordinate(5, 4);
    const transformations = new Transformations(localOriginInGlobal, localAxisXPtInGlobal);

    const angularOffset = AngularOffset.fromDeltaRadians(Math.PI / 4);
    const offset = localOriginInGlobal.OffsetFrom(CartesianCoordinate.Origin());

    expect(transformations.LocalOrigin).toEqual(localOriginInGlobal);
    expect(transformations.LocalAxisX).toEqual(localAxisXPtInGlobal);
    expect(transformations.Displacement).toEqual(offset);
    expect(transformations.Rotation.ToAngle().Degrees).toBeCloseTo(angularOffset.ToAngle().Degrees, decimalPlace);
  });

  describe('##transformToGlobal', () => {
    it.each([
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
    ])(`should transform local coordinates to global
          Global (x: %f, y: %f) from Local (x: %f, y: %f)
          Local Origin (x: %f, y: %f) in Global
          Local X-Axis (x: %f, y: %f) in Global`,
      (
        globalCoordinateX, globalCoordinateY,
        localCoordinateX, localCoordinateY,
        localOriginInGlobalX, localOriginInGlobalY,
        localAxisXPtInGlobalX, localAxisXPtInGlobalY
      ) => {
        const localOriginInGlobal = new CartesianCoordinate(localOriginInGlobalX, localOriginInGlobalY, tolerance);
        const localAxisXPtInGlobal = new CartesianCoordinate(localAxisXPtInGlobalX, localAxisXPtInGlobalY, tolerance);
        const transformations = new Transformations(localOriginInGlobal, localAxisXPtInGlobal);

        const coordinateLocal = new CartesianCoordinate(localCoordinateX, localCoordinateY, tolerance);
        const coordinateGlobalExpected = new CartesianCoordinate(globalCoordinateX, globalCoordinateY, tolerance);

        const coordinateGlobal = transformations.TransformToGlobal(coordinateLocal);

        expect(coordinateGlobal.X).toBeCloseTo(coordinateGlobalExpected.X, decimalPlace);
        expect(coordinateGlobal.Y).toBeCloseTo(coordinateGlobalExpected.Y, decimalPlace);
      }
    );
  });

  describe('##transformToLocal', () => {
    it.each([
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
    ])(`should transform global coordinates to local
          Global (x: %f, y: %f) to Local (x: %f, y: %f)
          Local Origin (x: %f, y: %f) in Global
          Local X-Axis (x: %f, y: %f) in Global`,
      (
        globalCoordinateX, globalCoordinateY,
        localCoordinateX, localCoordinateY,
        localOriginInGlobalX, localOriginInGlobalY,
        localAxisXPtInGlobalX, localAxisXPtInGlobalY
      ) => {
        const localOriginInGlobal = new CartesianCoordinate(localOriginInGlobalX, localOriginInGlobalY,);
        const localAxisXPtInGlobal = new CartesianCoordinate(localAxisXPtInGlobalX, localAxisXPtInGlobalY, tolerance);
        const transformations = new Transformations(localOriginInGlobal, localAxisXPtInGlobal);

        const coordinateGlobal = new CartesianCoordinate(globalCoordinateX, globalCoordinateY, tolerance);
        const coordinateLocalExpected = new CartesianCoordinate(localCoordinateX, localCoordinateY, tolerance);

        const coordinateLocal = transformations.TransformToLocal(coordinateGlobal);

        expect(coordinateLocal.X).toBeCloseTo(coordinateLocalExpected.X, decimalPlace);
        expect(coordinateLocal.Y).toBeCloseTo(coordinateLocalExpected.Y, decimalPlace);
      }
    );
  });
});
