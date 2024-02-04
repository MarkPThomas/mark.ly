// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 12-09-2017
//
// Last Modified By : Mark P Thomas
// Last Modified On : 12-09-2017
// ***********************************************************************
// <copyright file="Shape.cs" company="Mark P Thomas, Inc.">
//     Copyright ©  2017
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Geometry.Intersections;
using MPT.Geometry.Segments;
using MPT.Geometry.Tools;
using MPT.Math;
using MPT.Math.Coordinates;
using MPT.Math.Curves;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Base abstract Shape.
    /// </summary>
    public abstract class Shape : IShapeProperties, ITransform<Shape>
    {
        #region Properties
        /// <summary>
        /// The polyline that describes the shape.
        /// </summary>
        protected PolyLine _polyline;

        /// <summary>
        /// The offset of the shape from it's default local coordinates.
        /// </summary>
        protected CartesianCoordinate _translation;

        /// <summary>
        /// The rotation of the shape from it's default local orientation.
        /// </summary>
        protected Angle _rotation;


        /// <summary>
        /// The tolerance
        /// </summary>
        protected double _tolerance = GeometryLibrary.ZeroTolerance;
        /// <summary>
        /// Tolerance to use in all calculations with double types.
        /// </summary>
        public double Tolerance
        {
            get { return _tolerance; }
            set
            {
                _tolerance = value;
                if (_polyline != null)
                {
                    _polyline.Tolerance = _tolerance;
                }
            }
        }

        /// <summary>
        /// The name of the shape.
        /// </summary>
        /// <value>The name.</value>
        public string Name { get; private set; }

        /// <summary>
        /// If true, the shape is considered to be a hole, otherwise it is a solid.
        /// </summary>
        public bool IsHole { get; set; } = false;

        /// <summary>
        /// The centroid of the shape.
        /// </summary>
        /// <value>The centroid.</value>
        public virtual CartesianCoordinate Centroid => new CartesianCoordinate(Xo(), Yo(), _tolerance);
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Shape"/> class.
        /// </summary>
        protected Shape()
        {

        }
        #endregion

        #region Validation
        /// <summary>
        /// Determines whether shape is properly formed.
        /// </summary>
        /// <returns><c>true</c> if [is valid shape]; otherwise, <c>false</c>.</returns>
        public abstract bool CheckValidShape();

        /// <summary>
        /// Determines whether the specified polyline is a valid shape.
        /// </summary>
        /// <param name="polyline">The polyline.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        /// <exception cref="ArgumentException">Invalid shape: Polyline does not form a closed shape.</exception>
        /// <exception cref="ArgumentException">Invalid shape: Polyline has a point intersecting another segment.</exception>
        /// <exception cref="ArgumentException">Invalid shape: Polyline has crossing segments.</exception>
        /// <exception cref="ArgumentException">Invalid shape: Polyline joins back in on itself, which is only allowed for composite shapes.</exception>
        public static bool CheckValidShape(PolyLine polyline)
        {
            if (!IsClosedShape(polyline))
            {
                throw new ArgumentException("Invalid shape: Polyline does not form a closed shape.");
            }
            if (IsJoiningPointOnAnotherSegment(polyline))
            {
                throw new ArgumentException("Invalid shape: Polyline has a point intersecting another segment.");
            }
            if (IsAnySegmentCrossingAnotherSegment(polyline))
            {
                throw new ArgumentException("Invalid shape: Polyline has crossing segments.");
            }
            if (!IsValidPointOccurrences(polyline))
            {
                throw new ArgumentException("Invalid shape: Polyline joins back in on itself, which is only allowed for composite shapes.");
            }
            return true;
        }

        /// <summary>
        /// Determines whether [is closed shape].
        /// </summary>
        /// <returns>System.Boolean.</returns>
        public static bool IsClosedShape(PolyLine polyline)
        {
            return polyline.FirstPoint() == polyline.LastPoint();
        }

        /// <summary>
        /// Closes the shape if needed.
        /// </summary>
        protected void closeShapeIfNeeded()
        {
            if (!IsClosedShape(_polyline))
            {
                _polyline.AddLastPoint(_polyline.FirstPoint());
            }
        }

        /// <summary>
        /// Determines whether [is any segment crossing another segment] [the specified polyline].
        /// </summary>
        /// <param name="polyline">The polyline.</param>
        /// <returns><c>true</c> if [is any segment crossing another segment] [the specified polyline]; otherwise, <c>false</c>.</returns>
        public static bool IsAnySegmentCrossingAnotherSegment(PolyLine polyline)
        {
            for (int i = 0; i < polyline.CountSegments - 1; i++)
            {   // Skips last segment since it will be compared in the inner loop
                if (polyline[i] is LineSegment)
                {
                    LineSegment segmentI = polyline[i] as LineSegment;
                    for (int j = i + 1; j < polyline.CountSegments; j++)
                    {   // Gets next segment and every other remaining segment to check
                        if (polyline[j] is LineSegment)
                        {
                            LineSegment segmentJ = polyline[j] as LineSegment;
                            if (segmentI.IsIntersecting(segmentJ) &&
                            segmentI.I != segmentJ.I &&
                            segmentI.I != segmentJ.J &&
                            segmentI.J != segmentJ.I &&
                            segmentI.J != segmentJ.J)
                            {
                                return true;
                            }
                        }
                    }
                }

            }
            return false;
        }

        /// <summary>
        /// Determines whether [is any point on segment and not ends] [the specified polyline].
        /// </summary>
        /// <param name="polyline">The polyline.</param>
        /// <returns><c>true</c> if [is any point on segment and not ends] [the specified polyline]; otherwise, <c>false</c>.</returns>
        public static bool IsJoiningPointOnAnotherSegment(PolyLine polyline)
        {
            CartesianCoordinate firstPoint = polyline.FirstPoint();
            CartesianCoordinate lastPoint = polyline.LastPoint();
            for (int i = 1; i < polyline.CountSegments - 1; i++)
            {   // Loop is skipping first and last segments
                if (polyline[i] is LineSegment)
                {
                    LineSegment segment = (LineSegment)polyline[i];
                    if ((segment.IncludesCoordinate(firstPoint) &&
                        !PointIntersection.IsOnPoint(firstPoint, segment.I) &&
                        !PointIntersection.IsOnPoint(firstPoint, segment.J))
                        || (segment.IncludesCoordinate(lastPoint) &&
                        !PointIntersection.IsOnPoint(lastPoint, segment.I) &&
                        !PointIntersection.IsOnPoint(lastPoint, segment.J)))
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        /// <summary>
        /// Determines whether the specified polyline has valid point occurrences.
        /// If a point occurs once, the point connects a chain of segments.
        /// If a point occurs twice, and this only occurs for one point, this point is the point that closes the polyline to form a shape.
        /// If a point occurs more than twice, the shape is connecting back on itself. This case is best handled as a composite shape.
        /// </summary>
        /// <param name="polyline">The polyline.</param>
        /// <returns><c>true</c> if [is valid point ordering] [the specified polyline]; otherwise, <c>false</c>.</returns>
        public static bool IsValidPointOccurrences(PolyLine polyline)
        {

            PointBoundary points = polyline.PointBoundary();
            bool closureCounted = false;
            var selectQuery =
                from point in points
                group point by point into g
                select new { Point = g.Key, Count = g.Count() };
            foreach (var point in selectQuery)
            {
                if (point.Count == 2 && !closureCounted)
                {
                    closureCounted = true;
                    continue;
                }
                if (point.Count > 1)
                {
                    return false;
                }
            }

                return true;
        }
        #endregion

        #region Methods
        /// <summary>
        /// Returns a <see cref="string" /> that represents this instance.
        /// </summary>
        /// <returns>A <see cref="string" /> that represents this instance.</returns>
        public override string ToString()
        {
            return string.IsNullOrEmpty(Name) ? base.ToString() : Name;
        }

        /// <summary>
        /// Gets the perimeter length from polyline.
        /// </summary>
        /// <returns>System.Double.</returns>
        public double GetPerimeterFromPolyline()
        {
            double length = 0;
            foreach (IPathSegment segment in _polyline)
            {
                length += segment.Length();
            }
            return length;
        }

        /// <summary>
        /// Returns a copy of the polyline that forms the shape.
        /// </summary>
        /// <returns>PolyLine.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public PolyLine PolyLine()
        {
            return _polyline.CloneLine();
        }

        /// <summary>
        /// Returns the points that define the shape.
        /// </summary>
        /// <returns>PointBoundary.</returns>
        public PointBoundary PointBoundary()
        {
            return _polyline.PointBoundary();
        }

        /// <summary>
        /// Returns the overall extents of the shape.
        /// This includes extents for curve segments in between vertices.
        /// </summary>
        /// <returns>PointExtents.</returns>
        public PointExtents Extents()
        {
            return _polyline.Extents();
        }
        #endregion

        #region IShapeProperties
        /// <summary>
        /// Area of the shape.
        /// </summary>
        /// <returns></returns>
        public abstract double Area();

        /// <summary>
        /// Length of all sides of the shape.
        /// </summary>
        /// <returns></returns>
        public virtual double Perimeter()
        {
            return GetPerimeterFromPolyline();
        }

        /// <summary>
        /// X-coordinate of the centroid of the shape.
        /// </summary>
        /// <returns></returns>
        public abstract double Xo();

        /// <summary>
        /// Y-coordinate of the centroid of the shape.
        /// </summary>
        /// <returns></returns>
        public abstract double Yo();
        #endregion

        #region ITransform
        /// <summary>
        /// Translates the object.
        /// </summary>
        /// <param name="translation">The amount to translate by.</param>
        /// <returns>IPathSegment.</returns>
        public Shape Translate(CartesianOffset translation)
        {
            _polyline = new PolyLine(translateSegments(translation));
            _translation += translation;
            return this;
        }

        /// <summary>
        /// Translates the segments.
        /// </summary>
        /// <param name="translation">The amount to translate by.</param>
        /// <returns>IList&lt;IPathSegment&gt;.</returns>
        protected SegmentsBoundary translateSegments(CartesianOffset translation)
        {
            IList<IPathSegment> segments = new List<IPathSegment>();
            foreach (IPathSegment segment in _polyline)
            {
                segments.Add(segment.Translate(translation));
            }
            return new SegmentsBoundary(segments);
        }

        /// <summary>
        /// Scales the object from the provided reference point.
        /// </summary>
        /// <param name="scale">The amount to scale relative to the reference point.</param>
        /// <param name="referencePoint">The reference point.</param>
        /// <returns>IPathSegment.</returns>
        public Shape ScaleFromPoint(double scale, CartesianCoordinate referencePoint)
        {
            _polyline = new PolyLine(scaleSegmentsFromPoint(scale, referencePoint));
            _translation += scale * Centroid;
            return this;
        }

        /// <summary>
        /// Scales the segments from the provided reference point.
        /// </summary>
        /// <param name="scale">The amount to scale relative to the reference point.</param>
        /// <param name="referencePoint">The reference point.</param>
        /// <returns>IList&lt;IPathSegment&gt;.</returns>
        protected SegmentsBoundary scaleSegmentsFromPoint(double scale, CartesianCoordinate referencePoint)
        {
            IList<IPathSegment> segments = new List<IPathSegment>();
            foreach (IPathSegment segment in _polyline)
            {
                segments.Add(segment.ScaleFromPoint(scale, referencePoint));
            }
            return new SegmentsBoundary(segments);
        }

        /// <summary>
        /// Rotates the object about the reference point.
        /// </summary>
        /// <param name="rotation">The amount of rotation. [rad]</param>
        /// <param name="referencePoint">The center of rotation reference point.</param>
        /// <returns>IPathSegment.</returns>
        public Shape RotateAboutPoint(Angle rotation, CartesianCoordinate referencePoint)
        {
            _polyline = new PolyLine(rotateSegmentsAboutPoint(rotation, referencePoint));
            _rotation += rotation;
            CartesianCoordinate newCentroid = CartesianCoordinate.RotateAboutPoint(Centroid, referencePoint, rotation.Radians);
            _translation += newCentroid - Centroid;
            return this;
        }

        /// <summary>
        /// Rotates the segments about the reference point.
        /// </summary>
        /// <param name="rotation">The amount of rotation. [rad]</param>
        /// <param name="referencePoint">The center of rotation reference point.</param>
        /// <returns>IList&lt;IPathSegment&gt;.</returns>
        protected SegmentsBoundary rotateSegmentsAboutPoint(Angle rotation, CartesianCoordinate referencePoint)
        {
            IList<IPathSegment> segments = new List<IPathSegment>();
            foreach (IPathSegment segment in _polyline)
            {
                segments.Add(segment.RotateAboutPoint(rotation, referencePoint));
            }
            return new SegmentsBoundary(segments);
        }


        /// <summary>
        /// Skews the specified shape to the skewing of a containing box.
        /// </summary>
        /// <param name="stationaryReferencePoint">The stationary reference point of the skew box.</param>
        /// <param name="skewingReferencePoint">The skewing reference point of the skew box.</param>
        /// <param name="magnitude">The magnitude to skew along the x-axis and y-axis.</param>
        /// <returns>IPathSegment.</returns>
        public Shape Skew(
            CartesianCoordinate stationaryReferencePoint,
            CartesianCoordinate skewingReferencePoint,
            CartesianOffset magnitude)
        {
            _polyline = new PolyLine(skew(stationaryReferencePoint, skewingReferencePoint, magnitude));
            return this;
        }

        /// <summary>
        /// Skews the specified shape to the skewing of a containing box.
        /// </summary>
        /// <param name="stationaryReferencePoint">The stationary reference point of the skew box.</param>
        /// <param name="skewingReferencePoint">The skewing reference point of the skew box.</param>
        /// <param name="magnitude">The magnitude to skew along the x-axis and y-axis.</param>
        /// <returns>IList&lt;IPathSegment&gt;.</returns>
        protected SegmentsBoundary skew(
            CartesianCoordinate stationaryReferencePoint,
            CartesianCoordinate skewingReferencePoint,
            CartesianOffset magnitude)
        {
            IList<IPathSegment> segments = new List<IPathSegment>();
            foreach (IPathSegment segment in _polyline)
            {
                segments.Add(segment.Skew(stationaryReferencePoint, skewingReferencePoint, magnitude));
            }
            return new SegmentsBoundary(segments);
        }

        /// <summary>
        /// Mirrors the specified shape about the specified reference line.
        /// </summary>
        /// <param name="referenceLine">The reference line.</param>
        /// <returns>IPathSegment.</returns>
        public Shape MirrorAboutLine(LinearCurve referenceLine)
        {
            _polyline = new PolyLine(mirrorAboutLine(referenceLine));
            return this;
        }

        /// <summary>
        /// Mirrors the specified shape about the specified reference line.
        /// </summary>
        /// <param name="referenceLine">The reference line.</param>
        /// <returns>IList&lt;IPathSegment&gt;.</returns>
        protected SegmentsBoundary mirrorAboutLine(LinearCurve referenceLine)
        {
            IList<IPathSegment> segments = new List<IPathSegment>();
            foreach (IPathSegment segment in _polyline)
            {
                segments.Add(segment.MirrorAboutLine(referenceLine));
            }
            return new SegmentsBoundary(segments);
        }

        /// <summary>
        /// Mirrors the specified shape about the x-axis.
        /// </summary>
        /// <returns>IPathSegment.</returns>
        public Shape MirrorAboutAxisX()
        {
            _polyline = new PolyLine(mirrorAboutAxisX());
            return this;
        }

        /// <summary>
        /// Mirrors the specified shape about the x-axis.
        /// </summary>
        /// <returns>IList&lt;IPathSegment&gt;.</returns>
        protected SegmentsBoundary mirrorAboutAxisX()
        {
            IList<IPathSegment> segments = new List<IPathSegment>();
            foreach (IPathSegment segment in _polyline)
            {
                segments.Add(segment.MirrorAboutAxisX());
            }
            return new SegmentsBoundary(segments);
        }

        /// <summary>
        /// Mirrors the specified shape about the y-axis.
        /// </summary>
        /// <returns>IPathSegment.</returns>
        public Shape MirrorAboutAxisY()
        {
            _polyline = new PolyLine(mirrorAboutAxisY());
            return this;
        }

        /// <summary>
        /// Mirrors the specified shape about the y-axis.
        /// </summary>
        /// <returns>IList&lt;IPathSegment&gt;.</returns>
        protected SegmentsBoundary mirrorAboutAxisY()
        {
            IList<IPathSegment> segments = new List<IPathSegment>();
            foreach (IPathSegment segment in _polyline)
            {
                segments.Add(segment.MirrorAboutAxisY());
            }
            return new SegmentsBoundary(segments);
        }
        #endregion
    }
}