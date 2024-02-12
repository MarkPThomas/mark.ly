import { CartesianCoordinate } from "../../Coordinates/CartesianCoordinate";
import { Curve } from "../Curve";
import { LinearCurve } from "../LinearCurve";
import { CartesianParametricEquationXY } from "../Parametrics/Components/CartesianParametricEquationXY";
import { CurveLimit } from "./CurveLimit";


describe('CurveLimit', () => {
  const Tolerance = 0.00001;
  let curve: Curve;
  let curveLimit: CurveLimit;

  beforeEach(() => {
    curve = new LinearCurve(new CartesianCoordinate(-1, -2), new CartesianCoordinate(4, 3));
    curve.Tolerance = Tolerance;
    curveLimit = CurveLimit.fromCurve(curve);
  });

  describe('Initialization', () => {
    describe('Initialization', () => {
      it('should initialize with default limit (0, 0)', () => {
        const curveLimitInitialize = CurveLimit.fromCurve(curve);

        expect(curveLimitInitialize.Limit.X).toBeCloseTo(0, Tolerance);
        expect(curveLimitInitialize.Limit.Y).toBeCloseTo(0, Tolerance);
      });
    });
  });

  describe('Methods', () => {
    describe('SetLimitByX', () => {
      it('should set the limit by X coordinate', () => {
        curveLimit.SetLimitByX(2);

        const limitExpected = new CartesianCoordinate(2, 1, Tolerance);

        expect(curveLimit.Limit).toEqual(limitExpected);
      });

      it('should throw NotSupportedError if the curve is not in Cartesian coordinates', () => {
        const nonCartesianLimit = CurveLimit.fromCurve(new NonCartesianCurve());

        expect(() => nonCartesianLimit.SetLimitByX(1)).toThrow();
      });
    });

    describe('SetLimitByY', () => {
      it('should set the limit by Y coordinate', () => {
        curveLimit.SetLimitByY(1);

        const limitExpected = new CartesianCoordinate(2, 1, Tolerance);

        expect(curveLimit.Limit).toEqual(limitExpected);
      });

      it('should throw NotSupportedError if the curve is not in Cartesian coordinates', () => {
        const nonCartesianLimit = CurveLimit.fromCurve(new NonCartesianCurve());

        expect(() => nonCartesianLimit.SetLimitByY(1)).toThrow();
      });
    });


    describe('SetLimitByRotation', () => {
      it('should set the limit by rotation angle', () => {
        // Implement your test logic here, if applicable.
        // For instance, call curveLimit.SetLimitByRotation(-Numbers.PiOver2) and perform assertions.
      });

      it('should throw NotSupportedError if the curve is not in polar coordinates', () => {
        // const nonPolarLimit = CurveLimit.fromCurve(new NonPolarCurve());

        // expect(() => nonPolarLimit.SetLimitByRotation(1)).toThrow();
      });
    });

    describe('SetLimitByCoordinate', () => {
      it('should set the limit by a Cartesian coordinate', () => {
        const xCoordinate = 2;
        const yCoordinate = 1;
        curveLimit.SetLimitByCoordinate(new CartesianCoordinate(xCoordinate, yCoordinate));

        const limitExpected = new CartesianCoordinate(xCoordinate, yCoordinate, Tolerance);

        expect(curveLimit.Limit).toEqual(limitExpected);
      });

      it('should throw NotSupportedError if the curve is not in Cartesian coordinates', () => {
        const coordinate = new CartesianCoordinate(1, 2);
        const nonCartesianLimit = CurveLimit.fromCurve(new NonCartesianCurve());

        expect(() => nonCartesianLimit.SetLimitByCoordinate(coordinate)).toThrow();
      });

      it('should throw ArgumentOutOfRangeException if the coordinate does not lie on the curve', () => {
        const coordinate = new CartesianCoordinate(1, 2);

        expect(() => curveLimit.SetLimitByCoordinate(coordinate)).toThrow();
      });
    });

    describe('SetLimitByRotation', () => {
      it('should set the limit by rotation angle', () => {
        // Implement your test logic here, if applicable.
        // For instance, call curveLimit.SetLimitByRotation(-Numbers.PiOver2) and perform assertions.
      });

      it('should throw NotSupportedError if the curve is not in polar coordinates', () => {
        // const nonPolarLimit = CurveLimit.fromCurve(new NonPolarCurve());

        // expect(() => nonPolarLimit.SetLimitByRotation(1)).toThrow();
      });
    });

    describe('SetLimitByCoordinate', () => {
      it('should set the limit by a Cartesian coordinate', () => {
        const xCoordinate = 2;
        const yCoordinate = 1;
        curveLimit.SetLimitByCoordinate(new CartesianCoordinate(xCoordinate, yCoordinate));

        const limitExpected = new CartesianCoordinate(xCoordinate, yCoordinate, Tolerance);

        expect(curveLimit.Limit).toEqual(limitExpected);
      });

      it('should throw NotSupportedError if the curve is not in Cartesian coordinates', () => {
        const coordinate = new CartesianCoordinate(1, 2);
        const nonCartesianLimit = CurveLimit.fromCurve(new NonCartesianCurve());

        expect(() => nonCartesianLimit.SetLimitByCoordinate(coordinate)).toThrow();
      });

      it('should throw ArgumentOutOfRangeException if the coordinate does not lie on the curve', () => {
        const coordinate = new CartesianCoordinate(1, 2);

        expect(() => curveLimit.SetLimitByCoordinate(coordinate)).toThrow();
      });
    });

    describe('LimitPolar', () => {
      it('should return the limit as a PolarCoordinate', () => {
        // curveLimit.SetLimitByX(2);
        // const limit = curveLimit.LimitPolar();

        // const expectedLimit = new PolarCoordinate(2.236068, 0.463648, Tolerance);

        // expect(limit).toEqual(expectedLimit);
      });
    });
  });

  describe('Static', () => {
    describe('GetLimitByX', () => {
      it('should get the limit by X coordinate', () => {
        const xCoordinate = 2;
        const curve = new LinearCurve(new CartesianCoordinate(-1, -2, Tolerance), new CartesianCoordinate(4, 3, Tolerance));
        const limit = CurveLimit.GetLimitByX(xCoordinate, curve);

        const expectedLimit = new CartesianCoordinate(xCoordinate, 1);

        expect(limit).toEqual(expectedLimit);
      });
    });

    describe('GetLimitByY', () => {
      it('should get the limit by Y coordinate', () => {
        const yCoordinate = 1;
        const curve = new LinearCurve(new CartesianCoordinate(-1, -2, Tolerance), new CartesianCoordinate(4, 3, Tolerance));
        const limit = CurveLimit.GetLimitByY(yCoordinate, curve);

        const expectedLimit = new CartesianCoordinate(2, yCoordinate, Tolerance);

        expect(limit).toEqual(expectedLimit);
      });
    });

    describe('GetLimitByRotation', () => {
      it('should get the limit by rotation angle', () => {
        // Implement your test logic here, if applicable.
        // For instance, create a curve and call CurveLimit.GetLimitByRotation(3 * Numbers.PiOver2, curve),
        // then perform assertions against the expected limit.
      });
    });

    describe('GetLimitByCoordinate', () => {
      it('should get the limit by a Cartesian coordinate', () => {
        const expectedLimit = new CartesianCoordinate(2, 1, Tolerance);
        const curve = new LinearCurve(new CartesianCoordinate(-1, -2, Tolerance), new CartesianCoordinate(4, 3, Tolerance));
        const limit = CurveLimit.GetLimitByCoordinate(expectedLimit, curve);

        expect(limit).toEqual(expectedLimit);
      });

      it('should throw ArgumentOutOfRangeException if the coordinate does not lie on the curve', () => {
        const coordinate = new CartesianCoordinate(2, 2);
        const curve = new LinearCurve(new CartesianCoordinate(-1, -2, Tolerance), new CartesianCoordinate(4, 3, Tolerance));

        expect(() => CurveLimit.GetLimitByCoordinate(coordinate, curve)).toThrow();
      });
    });
  });

  describe('ICloneable', () => {
    describe('Clone', () => {
      it('should clone the curveLimit and have the same limit', () => {
        const curveLimitClone = curveLimit.clone() as CurveLimit;

        expect(curveLimitClone.Limit).toEqual(curveLimit.Limit);
      });
    });
  });
});

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @class NonCartesianCurve
 * @typedef {NonCartesianCurve}
 * @extends {Curve}
 */
class NonCartesianCurve extends Curve {
  /**
 * Creates an instance of NonCartesianCurve.
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @constructor
 */
  constructor() {
    super();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @public
 * @returns {NonCartesianCurve}
 */
  public clone(): NonCartesianCurve {
    throw new Error('Method not implemented.');
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @protected
 * @returns {CartesianParametricEquationXY}
 */
  protected createParametricEquation(): CartesianParametricEquationXY {
    throw new Error('Method not implemented.');
  }
}

/**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @class NonPolarCurve
 * @typedef {NonPolarCurve}
 * @extends {Curve}
 */
class NonPolarCurve extends Curve {
  /**
 * Creates an instance of NonPolarCurve.
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @constructor
 */
  constructor() {
    super();
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @public
 * @returns {NonPolarCurve}
 */
  public clone(): NonPolarCurve {
    throw new Error('Method not implemented.');
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:34:19 PM
 *
 * @protected
 * @returns {CartesianParametricEquationXY}
 */
  protected createParametricEquation(): CartesianParametricEquationXY {
    throw new Error('Method not implemented.');
  }
}
