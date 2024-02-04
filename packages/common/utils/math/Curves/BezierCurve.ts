import { Angle } from "../Coordinates/Angle";
import { CartesianCoordinate } from "../Coordinates/CartesianCoordinate";
import { PolarCoordinate } from "../Coordinates/PolarCoordinate";
import { Generics } from "../Generics";
import { GeometryLibrary } from "../Geometry/GeometryLibrary";
import { Numbers } from "../Numbers";
import { Vector } from "../Vectors/Vector";
import { Curve } from "./Curve";
import { LinearCurve } from "./LinearCurve";
import { BezierCurveParametric1stOrder } from "./Parametrics/BezierCurveParametric1stOrder";
import { BezierCurveParametric2ndOrder } from "./Parametrics/BezierCurveParametric2ndOrder";
import { BezierCurveParametric3rdOrder } from "./Parametrics/BezierCurveParametric3rdOrder";
import { CartesianParametricEquationXY } from "./Parametrics/Components/CartesianParametricEquationXY";
import { CurveHandle } from "./tools/CurveHandle";


/**
 * Class BezierCurve.
 * Implements the {@link Curve}
 */
export class BezierCurve extends Curve {
  /**
   * The maximum number of control points.
   */
  protected static readonly _maxNumberOfControlPoints: number = 3;

  /**
   * Gets the number of control points.
   */
  public readonly NumberOfControlPoints: number = BezierCurve._maxNumberOfControlPoints;

  /**
   * Gets the handle at starting point, i.
   */
  public readonly HandleI: CurveHandle;

  /**
   * Gets the handle at ending point, j.
   */
  public readonly HandleJ: CurveHandle;

  /**
   * Initializes a new instance of the {@link BezierCurve} class.
   * @param handleStart The handle start.
   * @param handleEnd The handle end.
   * @param numberOfControlPoints The number of control points.
   * @param tolerance Tolerance to apply to the curve.
   */
  constructor(
    length?: number,
    pointI?: CartesianCoordinate,
    pointJ?: CartesianCoordinate,
    handleStart?: CurveHandle,
    handleEnd?: CurveHandle,
    numberOfControlPoints: number = BezierCurve._maxNumberOfControlPoints,
    tolerance: number = BezierCurve.DEFAULT_TOLERANCE
  ) {
    super(tolerance);
    this.NumberOfControlPoints = this.getNumberOfControlPoints(numberOfControlPoints);

    let handleI = handleStart;
    let handleJ = handleEnd;

    if (length !== undefined) {
      const pointI = CartesianCoordinate.atOrigin();
      const pointJ = new CartesianCoordinate(length, 0);
      const handleLength = this.getHandleLength(pointI, pointJ);

      handleI = new CurveHandle(pointI, handleLength);
      handleJ = this.getCurveHandleJ(pointJ, handleLength);
    } else if (pointI && pointJ) {
      const handleLength = this.getHandleLength(pointI, pointJ);

      handleI = new CurveHandle(pointI, handleLength);
      handleJ = this.getCurveHandleJ(pointJ, handleLength);
    }

    if (handleI && handleJ) {
      this.HandleI = handleI;
      this.HandleJ = handleJ;
    }
  }

  /**
   * Initializes a new instance of the {@link BezierCurve} class.
   * @param handleStart The handle start.
   * @param handleEnd The handle end.
   * @param numberOfControlPoints The number of control points.
   * @param tolerance Tolerance to apply to the curve.
   */
  static fromHandles(
    handleStart: CurveHandle,
    handleEnd: CurveHandle,
    numberOfControlPoints: number = BezierCurve._maxNumberOfControlPoints,
    tolerance: number = BezierCurve.DEFAULT_TOLERANCE
  ): BezierCurve {
    return new BezierCurve(undefined, undefined, undefined, handleStart, handleEnd, numberOfControlPoints, tolerance);
  }

  /**
   * Initializes a new instance of the {@link BezierCurve} class.
   * @param pointI The point i.
   * @param pointJ The point j.
   * @param numberOfControlPoints The number of control points.
   * @param tolerance Tolerance to apply to the curve.
   */
  static fromPts(
    pointI: CartesianCoordinate,
    pointJ: CartesianCoordinate,
    numberOfControlPoints: number = BezierCurve._maxNumberOfControlPoints,
    tolerance: number = BezierCurve.DEFAULT_TOLERANCE
  ): BezierCurve {
    return new BezierCurve(undefined, pointI, pointJ, undefined, undefined, numberOfControlPoints, tolerance);
  }

  /**
   * Initializes a new instance of the {@link BezierCurve} class.
   * @param length The length.
   * @param numberOfControlPoints The number of control points.
   * @param tolerance Tolerance to apply to the curve.
   */
  static fromLength(
    length: number,
    numberOfControlPoints: number = BezierCurve._maxNumberOfControlPoints,
    tolerance: number = Curve.DEFAULT_TOLERANCE
  ): BezierCurve {
    return new BezierCurve(length, undefined, undefined, undefined, undefined, numberOfControlPoints, tolerance);
  }

  /**
   * Gets the bezier curve handle j, with appropriate slope defaults.
   * @param pointJ The point j.
   * @param handleLength Length of the handle.
   * @returns {@link CurveHandle}.
   * @private
   */
  private getCurveHandleJ(pointJ: CartesianCoordinate, handleLength: number): CurveHandle {
    return new CurveHandle(pointJ, handleLength, new Angle(-1 * Numbers.Pi));
  }

  /**
   * Gets the length of the handle for handles at the control points.
   * @param pointI The point i.
   * @param pointJ The point j.
   * @returns Length of the handle.
   * @private
   */
  private getHandleLength(pointI: CartesianCoordinate, pointJ: CartesianCoordinate): number {
    return 0.1 * pointJ.offsetFrom(pointI).length();
  }

  /**
   * Gets the number of control points.
   * @param numberOfControlPoints The number of control points.
   * @returns The adjusted number of control points.
   * @private
   */
  private getNumberOfControlPoints(numberOfControlPoints: number): number {
    return Math.min(Math.max(0, numberOfControlPoints), BezierCurve._maxNumberOfControlPoints);
  }

  /**
   * Creates the parametric vector.
   * @returns {@link CartesianParametricEquationXY}.
   * @protected
   * @override
   */
  protected override createParametricEquation(): CartesianParametricEquationXY {
    switch (this.NumberOfControlPoints) {
      case 1:
        return new BezierCurveParametric1stOrder(this);
      case 2:
        return new BezierCurveParametric2ndOrder(this);
      case 3:
        return new BezierCurveParametric3rdOrder(this);
      default:
        return new BezierCurveParametric3rdOrder(this);
    }
  }

  /**
   * Slope of the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param relativePosition The relative position, s. Relative position must be between 0 and 1.
   * @returns Slope of the curve.
   */
  public SlopeByPosition(relativePosition: number): number {
    const xPrime = this.xPrimeByParameter(relativePosition);
    const yPrime = this.yPrimeByParameter(relativePosition);

    return GeometryLibrary.SlopeParametric(xPrime, yPrime);
  }

  /**
   * Curvature of the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param relativePosition The relative position, s. Relative position must be between 0 and 1.
   * @returns Curvature of the curve.
   */
  public CurvatureByPosition(relativePosition: number): number {
    const xPrime = this.xPrimeByParameter(relativePosition);
    const yPrime = this.yPrimeByParameter(relativePosition);
    const xPrimeDouble = this.xPrimeDoubleByParameter(relativePosition);
    const yPrimeDouble = this.yPrimeDoubleByParameter(relativePosition);

    return GeometryLibrary.CurvatureParametric(xPrime, yPrime, xPrimeDouble, yPrimeDouble);
  }

  /**
   * Vector that is tangential to the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param relativePosition The relative position, s. Relative position must be between 0 and 1.
   * @returns {@link Vector}.
   */
  public TangentVectorByPosition(relativePosition: number): Vector {
    const xPrime = this.xPrimeByParameter(relativePosition);
    const yPrime = this.yPrimeByParameter(relativePosition);
    return Vector.UnitTangentVectorByComponents(xPrime, yPrime, this.Tolerance);
  }

  /**
   * Vector that is normal to the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param relativePosition The relative position, s. Relative position must be between 0 and 1.
   * @returns {@link Vector}.
   */
  public NormalVectorByPosition(relativePosition: number): Vector {
    const xPrime = this.xPrimeByParameter(relativePosition);
    const yPrime = this.yPrimeByParameter(relativePosition);
    return Vector.UnitTangentVectorByComponents(xPrime, yPrime, this.Tolerance);
  }

  /**
   * Length of the curve between the limits.
   * @returns {number} Length of the curve.
   */
  public Length(): number {
    return this.LengthBetween(0, 1);
  }

  /**
  * Length of the curve between two points.
  * @param {number} relativePositionStart - Relative position along the path where the length measurement starts.
  * @param {number} relativePositionEnd - Relative position along the path where the length measurement ends.
  * @returns {number} Length of the curve between two points.
  * @throws {Error} NotImplementedException.
  */
  public LengthBetween(relativePositionStart: number, relativePositionEnd: number): number {
    throw new Error('NotImplementedException');
  }

  /**
  * The length of the chord connecting the start and end limits.
  * @returns {number} Chord length.
  */
  public ChordLength(): number {
    return LinearCurve.LengthBetweenPts(this.Range.start.Limit, this.Range.end.Limit);
  }

  /**
  * The length of the chord connecting the start and end limits.
  * @param {number} relativePositionStart - Relative position along the path where the length measurement starts.
  * @param {number} relativePositionEnd - Relative position along the path where the length measurement ends.
  * @returns {number} Chord length between two points.
  */
  public ChordLengthBetween(relativePositionStart: number, relativePositionEnd: number): number {
    return LinearCurve.LengthBetweenPts(
      this.CoordinateCartesian(relativePositionStart),
      this.CoordinateCartesian(relativePositionEnd)
    );
  }

  /**
  * The chord connecting the start and end limits.
  * @returns {LinearCurve} Chord curve.
  */
  public Chord(): LinearCurve {
    return new LinearCurve(this.Range.start.Limit, this.Range.end.Limit);
  }

  /**
  * The chord connecting the start and end limits.
  * @param {number} relativePositionStart - Relative position along the path where the chord starts.
  * @param {number} relativePositionEnd - Relative position along the path where the chord ends.
  * @returns {LinearCurve} Chord curve between two points.
  */
  public ChordBetween(relativePositionStart: number, relativePositionEnd: number): LinearCurve {
    return new LinearCurve(this.CoordinateCartesian(relativePositionStart), this.CoordinateCartesian(relativePositionEnd));
  }

  /**
  * Vector that is tangential to the curve at the specified position.
  * @param {number} relativePosition - Relative position along the path.
  * @returns {Vector} Tangent vector.
  */
  public TangentVector(relativePosition: number): Vector {
    return this.TangentVectorByPosition(relativePosition);
  }

  /**
  * Vector that is normal to the curve at the specified position.
  * @param {number} relativePosition - Relative position along the path.
  * @returns {Vector} Normal vector.
  */
  public NormalVector(relativePosition: number): Vector {
    return this.NormalVectorByPosition(relativePosition);
  }

  /**
  * Coordinate of the curve at the specified position.
  * @param {number} relativePosition - Relative position along the path.
  * @returns {CartesianCoordinate} Cartesian coordinate.
  */
  public CoordinateCartesian(relativePosition: number): CartesianCoordinate {
    return this.CoordinateByPosition(relativePosition);
  }

  /**
  * Coordinate of the curve at the specified position.
  * If the shape is a closed shape, `relativePosition` = {any integer} where `relativePosition` = 0.
  * @param {number} relativePosition - Relative position along the path.
  * @returns {PolarCoordinate} Polar coordinate.
  * @throws {Error} NotImplementedException.
  */
  public CoordinatePolar(relativePosition: number): PolarCoordinate {
    throw new Error('NotImplementedException');
  }


  /**
   * X-coordinate on the line segment that corresponds to the y-coordinate given.
   * @param y Y-coordinate for which an x-coordinate is desired.
   * @returns X-coordinate.
   */
  public XatY(y: number): number {
    const coordinates = this.XsAtY(y);
    if (coordinates.length === 0) {
      return Number.POSITIVE_INFINITY;
    }
    return coordinates[0];
  }

  /**
   * Y-coordinate on the line segment that corresponds to the x-coordinate given.
   * @param x X-coordinate for which a y-coordinate is desired.
   * @returns Y-coordinate.
   */
  public YatX(x: number): number {
    const coordinates = this.YsAtX(x);
    if (coordinates.length === 0) {
      return Number.POSITIVE_INFINITY;
    }
    return coordinates[0];
  }

  /**
   * X-coordinate on the line segment that corresponds to the y-coordinate given.
   * @param {number} y - Y-coordinate for which an x-coordinate is desired.
   * @returns {number[]} Array of x-coordinates.
   * @throws {Error} NotImplementedException.
   */
  public XsAtY(y: number): number[] {
    throw new Error('NotImplementedException');
  }

  /**
  * Y-coordinate on the line segment that corresponds to the x-coordinate given.
  * @param {number} x - X-coordinate for which a y-coordinate is desired.
  * @returns {number[]} Array of y-coordinates.
  * @throws {Error} NotImplementedException.
  */
  public YsAtX(x: number): number[] {
    throw new Error('NotImplementedException');
  }

  /**
   * Determines whether the specified coordinate is intersecting.
   * @param coordinate The coordinate.
   * @returns True if intersecting, false otherwise.
   */
  public IsIntersectingCoordinate(coordinate: CartesianCoordinate): boolean {
    const tolerance = Generics.GetTolerance(coordinate, this.Tolerance);
    const yIntersections = this.YsAtX(coordinate.X);
    return yIntersections.some((element) => element === coordinate.Y);
  }

  /**
   * The cartesian coordinate on the curve in local coordinates about the local origin that corresponds to the parametric coordinate given.
   * @param {number} relativePosition - The relative position, s. Relative position must be between 0 and 1.
   * @returns {CartesianCoordinate} Cartesian coordinate.
   */
  public CoordinateByPosition(relativePosition: number): CartesianCoordinate {
    return new CartesianCoordinate(this.xByParameter(relativePosition), this.yByParameter(relativePosition));
  }

  /**
  * Returns a string representation of this instance.
  * @returns {string} A string representation of this instance.
  */
  public toString(): string {
    return `${BezierCurve.name} - `
      + `I: ${this.HandleI}, J: ${this.HandleJ}, N: ${this.NumberOfControlPoints}`;
  }

  /**
  * Gets the b0 coordinate.
  * @returns {CartesianCoordinate} B0 coordinate.
  */
  public B_0(): CartesianCoordinate {
    return this.HandleI.ControlPoint;
  }

  /**
  * Gets the b1 coordinate.
  * @returns {CartesianCoordinate} B1 coordinate.
  */
  public B_1(): CartesianCoordinate {
    return this.HandleI.getHandleTip();
  }

  /**
  * Gets the b2 coordinate.
  * @returns {CartesianCoordinate} B2 coordinate.
  */
  public B_2(): CartesianCoordinate {
    return this.HandleJ.getHandleTip();
  }

  /**
  * Gets the b3 coordinate.
  * @returns {CartesianCoordinate} B3 coordinate.
  */
  public B_3(): CartesianCoordinate {
    return this.HandleJ.ControlPoint;
  }

  /**
   * Creates a new object that is a copy of the current instance.
   * @returns {BezierCurve} A new object that is a copy of this instance.
   */
  clone(): BezierCurve {
    const curve = BezierCurve.fromHandles(
      this.HandleI.clone(),
      this.HandleJ.clone(),
      this.NumberOfControlPoints
    );
    curve._range = this.Range.clone();
    return curve;
  }
}