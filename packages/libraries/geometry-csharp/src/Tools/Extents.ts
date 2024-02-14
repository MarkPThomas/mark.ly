import { ICoordinate } from "@markpthomas/math/Coordinates";

/**
 * Represents the coordinate bounds of a shape or line, or cluster of points.
 *
 * @export
 * @abstract
 * @class Extents
 * @template T
 */
export abstract class Extents<T extends ICoordinate>
{
  /// <summary>
  /// The original coordinates
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @type {T[]}
 */
  protected _originalCoordinates: T[] = [];

  /// <summary>
  /// The maximum allowed Y-coordinate
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @type {number}
 */
  protected _maxYLimit: number = Infinity;
  /// <summary>
  /// The minimum allowed Y-coordinate
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @type {number}
 */
  protected _minYLimit: number = -Infinity;
  /// <summary>
  /// The maximum allowed X-coordinate
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @type {number}
 */
  protected _maxXLimit: number = Infinity;
  /// <summary>
  /// The minimum allowed X-coordinate
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @type {number}
 */
  protected _minXLimit: number = -Infinity;

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @type {number}
 */
  protected _maxY: number;
  /// <summary>
  /// Gets the maximum Y-coordinate.
  /// </summary>
  /// <value>The maximum Y-coordinate.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @readonly
 * @type {number}
 */
  public get MaxY(): number {
    return this._maxY;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @type {number}
 */
  protected _minY: number;
  /// <summary>
  /// Gets the minimum Y-coordinate.
  /// </summary>
  /// <value>The minimum Y-coordinate.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @readonly
 * @type {number}
 */
  public get MinY(): number {
    return this._minY;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @type {number}
 */
  protected _maxX: number;
  /// <summary>
  /// Gets the maximum X-coordinate.
  /// </summary>
  /// <value>The maximum X-coordinate.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @readonly
 * @type {number}
 */
  public get MaxX(): number {
    return this._maxX;
  }

  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @type {number}
 */
  protected _minX: number;
  /// <summary>
  /// Gets the minimum X-coordinate.
  /// </summary>
  /// <value>The minimum X-coordinate.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @readonly
 * @type {number}
 */
  public get MinX(): number {
    return this._minX;
  }

  /// <summary>
  /// Gets the width.
  /// </summary>
  /// <value>The width.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @readonly
 * @type {number}
 */
  public get Width(): number {
    return this.MaxX - this.MinX;
  }

  /// <summary>
  /// Gets the height.
  /// </summary>
  /// <value>The height.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @readonly
 * @type {number}
 */
  public get Height(): number {
    return this.MaxY - this.MinY;
  }


  /// <summary>
  /// Initializes a new empty instance of the <see cref="Extents{T}" /> class.
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 */
  protected Extents() {
    this.initializeEmpty();
  }

  /// <summary>
  /// Initializes a new instance of the <see cref="Extents{T}"/> class for a path segment.
  /// </summary>
  /// <param name="pointI">The first point forming a path.</param>
  /// <param name="pointJ">The second point forming a path.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @param {T} pointI
 * @param {T} pointJ
 */
  protected fromCornerPoints(pointI: T, pointJ: T) {
    this.initializeForSetting();
    this.Add(pointI);
    this.Add(pointJ);
  }

  /// <summary>
  /// Initializes a new instance of the <see cref="Extents{T}" /> class for a polyline or a shape.
  /// </summary>
  /// <param name="coordinates">The coordinates.</param>
  /// <param name="maxYLimit">The maximum y limit.</param>
  /// <param name="minYLimit">The minimum y limit.</param>
  /// <param name="maxXLimit">The maximum x limit.</param>
  /// <param name="minXLimit">The minimum x limit.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @param {T[]} coordinates
 * @param {number} [maxYLimit=Infinity]
 * @param {number} [minYLimit=-Infinity]
 * @param {number} [maxXLimit=Infinity]
 * @param {number} [minXLimit=-Infinity]
 */
  protected fromCoordinates(
    coordinates: T[],
    maxYLimit: number = Infinity,
    minYLimit: number = -Infinity,
    maxXLimit: number = Infinity,
    minXLimit: number = -Infinity
  ) {
    this.initializeLimits(
      maxYLimit, minYLimit,
      maxXLimit, minXLimit);
    if (coordinates.length > 1) {
      this.initializeForSetting();
    }
    else {
      this.initializeEmpty();
    }
    this.AddRange(coordinates);
  }

  /// <summary>
  /// Initializes a new instance of the <see cref="Extents{T}" /> class for cloning.
  /// </summary>
  /// <param name="extents">The extents.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @param {Extents<T>} extents
 */
  protected fromExtents(extents: Extents<T>) {
    this.initializeLimits(
      extents._maxYLimit, extents._minYLimit,
      extents._maxXLimit, extents._minXLimit);
    this.initializeForSetting();
    this.AddExtents(extents);
  }

  /// <summary>
  /// Initializes the limits.
  /// </summary>
  /// <param name="maxYLimit">The maximum y limit.</param>
  /// <param name="minYLimit">The minimum y limit.</param>
  /// <param name="maxXLimit">The maximum x limit.</param>
  /// <param name="minXLimit">The minimum x limit.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @param {number} [maxYLimit=Infinity]
 * @param {number} [minYLimit=-Infinity]
 * @param {number} [maxXLimit=Infinity]
 * @param {number} [minXLimit=-Infinity]
 */
  protected initializeLimits(
    maxYLimit: number = Infinity,
    minYLimit: number = -Infinity,
    maxXLimit: number = Infinity,
    minXLimit: number = -Infinity) {
    this._maxYLimit = maxYLimit;
    this._minYLimit = minYLimit;
    this._maxXLimit = maxXLimit;
    this._minXLimit = minXLimit;
  }

  /// <summary>
  /// Initializes this instance.
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 */
  protected initializeEmpty() {
    this._maxY = this._maxYLimit;
    this._minY = this._minYLimit;
    this._maxX = this._maxXLimit;
    this._minX = this._minXLimit;
  }

  /// <summary>
  /// Initializes for setting.
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 */
  protected initializeForSetting() {
    this._maxY = this._minYLimit;
    this._minY = this._maxYLimit;
    this._maxX = this._minXLimit;
    this._minX = this._maxXLimit;
  }

  /// <summary>
  /// Determines whether [is extents width set].
  /// </summary>
  /// <returns><c>true</c> if [is extents width set]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @returns {boolean}
 */
  protected isExtentsWidthSet(): boolean {
    return (this.MaxX !== this._maxXLimit && this.MinX !== this._minXLimit);
  }

  /// <summary>
  /// Determines whether [is extents height set].
  /// </summary>
  /// <returns><c>true</c> if [is extents height set]; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @returns {boolean}
 */
  protected isExtentsHeightSet(): boolean {
    return (this.MaxY !== this._maxYLimit && this.MinY !== this._minYLimit);
  }


  /// <summary>
  /// Adds the specified coordinate.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {T} coordinate
 */
  public Add(coordinate: T) {
    const xIsInitialized = this.isExtentsWidthSet();
    const yIsInitialized = this.isExtentsHeightSet();
    if (!xIsInitialized && !yIsInitialized) {
      if (this._originalCoordinates.length < 1) {
        // Save coordinate in case a second is added later. These will be enough to then establish extents.
        this._originalCoordinates.push(coordinate);
        return;
      }
      this.initializeForSetting();
      this.addCoordinate(this._originalCoordinates[0]);
      this._originalCoordinates = [];
    }
    this.addCoordinate(coordinate);
  }

  /// <summary>
  /// Updates the extents to include the specified coordinates.
  /// </summary>
  /// <param name="coordinates">The coordinates.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {T[]} coordinates
 */
  public AddRange(coordinates: T[]) {
    coordinates.forEach((coordinate) => {
      this.Add(coordinate);
    });
  }

  /// <summary>
  /// Updates the extents to include the specified extents.
  /// </summary>
  /// <param name="extents">The extents.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {Extents<T>} extents
 */
  public AddExtents(extents: Extents<T>) {
    const xIsInitialized = this.isExtentsWidthSet();
    const yIsInitialized = this.isExtentsHeightSet();
    if (!xIsInitialized && !yIsInitialized) {
      this.initializeForSetting();
    }

    if (extents.MaxY > this.MaxY) {
      this._maxY = extents.MaxY;
    }
    if (extents.MinY < this.MinY) {
      this._minY = extents.MinY;
    }
    if (extents.MaxX > this.MaxX) {
      this._maxX = extents.MaxX;
    }
    if (extents.MinX < this.MinX) {
      this._minX = extents.MinX;
    }
  }

  /// <summary>
  /// Clears this instance.
  /// </summary>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 */
  public Clear() {
    this.initializeEmpty();
    this.initializeLimits();
  }

  /// <summary>
  /// Resets the specified coordinates.
  /// </summary>
  /// <param name="coordinates">The coordinates.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @param {T[]} coordinates
 */
  public Reset(coordinates: T[]) {
    this.Clear();
    this.AddRange(coordinates);
  }

  /// <summary>
  /// Determines whether the coordinate lies within the extents.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /// <returns><c>true</c> if the specified coordinates are within the extents; otherwise, <c>false</c>.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @abstract
 * @param {T} coordinate
 * @returns {boolean}
 */
  public abstract IsWithinExtents(coordinate: T): boolean;

  /// <summary>
  /// Returns a rectangle boundary of this instance.
  /// </summary>
  /// <returns>NRectangle.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @abstract
 * @returns {T[]}
 */
  public abstract Boundary(): T[];

  /// <summary>
  /// Gets the geometric center.
  /// </summary>
  /// <returns>T.</returns>
  /// <value>The geometric center.</value>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @abstract
 * @returns {T}
 */
  public abstract GeometricCenter(): T;

  /// <summary>
  /// Translates points that define the extents.
  /// </summary>
  /// <param name="x">The x-coordinate.</param>
  /// <param name="y">The y-coordinate.</param>
  /// <returns>Extents&lt;T&gt;.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @abstract
 * @param {number} x
 * @param {number} y
 * @returns {Extents<T>}
 */
  public abstract Translate(x: number, y: number): Extents<T>;

  /// <summary>
  /// Rotates points that define the extents.
  /// </summary>
  /// <param name="angle">The angle [radians].</param>
  /// <returns>Extents&lt;T&gt;.</returns>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @public
 * @abstract
 * @param {number} angle
 * @returns {Extents<T>}
 */
  public abstract Rotate(angle: number): Extents<T>;


  /// <summary>
  /// Adds the coordinate.
  /// </summary>
  /// <param name="coordinate">The coordinate.</param>
  /**
 * ${1:Description placeholder}
 * @date 2/11/2024 - 6:35:05 PM
 *
 * @protected
 * @abstract
 * @param {T} coordinate
 */
  protected abstract addCoordinate(coordinate: T): void;
}