// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-20-2018
//
// Last Modified By : Mark P Thomas
// Last Modified On : 06-30-2020
// ***********************************************************************
// <copyright file="Polygon.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Geometry.Segments;
using MPT.Math;
using MPT.Math.Coordinates;
using MPT.Math.NumberTypeExtensions;
using MPT.Math.Vectors;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Represents a polygon shape.
    /// A plane figure that is described by a finite number of straight line segments connected to form a closed polygonal chain or polygonal circuit.
    /// </summary>
    public class Polygon : Shape
    {
        #region Properties
        /// <summary>
        /// The points that define the polygon.
        /// </summary>
        /// <value>The points.</value>
        public List<CartesianCoordinate> Points => getAllCoordinates();

        /// <summary>
        /// The sides that define the polygon.
        /// </summary>
        /// <value>The sides.</value>
        public List<LineSegment> Sides => getAllSides();

        /// <summary>
        /// The interior angles that are formed within the polygon.
        /// </summary>
        /// <value>The angles.</value>
        public List<Angle> Angles => getAnglesBetweenAllSides();
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Polygon" /> class.
        /// </summary>
        public Polygon()
        {

        }

        /// <summary>
        /// Initializes a new instance of the <see cref="PolyLine" /> class.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public Polygon(IEnumerable<CartesianCoordinate> coordinates)
        {
            SetCoordinates(coordinates);
            Tolerance = _tolerance;
        }
        #endregion

        #region Validation
        /// <summary>
        /// Determines whether shape is properly formed.
        /// </summary>
        /// <returns><c>true</c> if [is valid shape]; otherwise, <c>false</c>.</returns>
        public override bool CheckValidShape()
        {
            return CheckValidPolygon(_polyline);
        }

        /// <summary>
        /// Determines whether the specified polyline forms a valid polygon.
        /// </summary>
        /// <param name="polyline">The polyline.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        /// <exception cref="ArgumentException">Invalid shape: Polygon must have at least 3 coordinates + 1 for closure = 4.</exception>
        public static bool CheckValidPolygon(PolyLine polyline)
        {
            if (polyline.CountPoints < 4)
            {
                throw new ArgumentException("Invalid shape: Polygon must have at least 3 coordinates + 1 for closure = 4.");
            }
            return CheckValidShape(polyline);
        }
        #endregion

        #region Query
        /// <summary>
        /// Returns the point at the specified point index.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate PointAt(int pointIndex)
        {
            return _polyline.Coordinate(pointIndex);
        }

        /// <summary>
        /// Returns the side at the specified side index.
        /// </summary>
        /// <param name="sideIndex">Index of the side.</param>
        /// <returns>LineSegment.</returns>
        public LineSegment SideAt(int sideIndex)
        {
            return _polyline[sideIndex] as LineSegment;
        }

        /// <summary>
        /// Returns the pair of sides that join at the provided point index.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <returns>Tuple&lt;IPathSegment, IPathSegment&gt;.</returns>
        public Tuple<LineSegment, LineSegment> SidesAdjacentAt(int pointIndex)
        {
            return new Tuple<LineSegment, LineSegment>(SideAt(indexPreceding(pointIndex)), SideAt(pointIndex));
        }

        /// <summary>
        /// Returns the interior angle at the specified point index.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <returns>Angle.</returns>
        public Angle AngleInteriorAt(int pointIndex)
        {
            return getAngleBetweenSides(_polyline[indexPreceding(pointIndex)] as LineSegment, _polyline[pointIndex] as LineSegment);
        }

        /// <summary>
        /// Unit normal vectors of the sides meeting at the specified point index are rotated counter-clockwise relative to each other.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        public bool NormalsRotateCounterClockwiseAt(int pointIndex)
        {
            Tuple<LineSegment, LineSegment> segments = SidesAdjacentAt(pointIndex);
            return normalsRotateCounterClockwise(segments.Item1, segments.Item2);
        }

        /// <summary>
        /// Determines whether the polygon has reentrant corners.
        /// </summary>
        /// <returns><c>true</c> if [has reentrant corners]; otherwise, <c>false</c>.</returns>
        public bool HasReentrantCorners()
        {
            bool normalsRotateCounterClockwise = !IsHole;
            for (int i = 0; i < _polyline.CountPoints - 1; i++)
            {
                if ((!NormalsRotateCounterClockwiseAt(i) && normalsRotateCounterClockwise) ||
                    NormalsRotateCounterClockwiseAt(i) && !normalsRotateCounterClockwise)
                {
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// Gets the preceding index, handling the wrap-around case.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <returns>System.Int32.</returns>
        protected int indexPreceding(int pointIndex)
        {
            return (pointIndex == 0) ? _polyline.CountSegments - 1 : pointIndex - 1;
        }

        /// <summary>
        /// Gets all coordinates defining the polygon.
        /// This does not include the wrap-around coordinate used for closure.
        /// </summary>
        /// <returns>List&lt;CartesianCoordinate&gt;.</returns>
        protected List<CartesianCoordinate> getAllCoordinates()
        {
            if (_polyline == null)
            {
                return new List<CartesianCoordinate>();
            }
            List<CartesianCoordinate> coordinates = _polyline.PointBoundary().ToList();
            coordinates.RemoveAt(coordinates.Count - 1);
            return coordinates;
        }

        /// <summary>
        /// Gets all sides defining the polygon.
        /// </summary>
        /// <returns>List&lt;LineSegment&gt;.</returns>
        protected List<LineSegment> getAllSides()
        {
            List<LineSegment> sides = new List<LineSegment>();
            if (_polyline == null)
            {
                return sides;
            }
            foreach (IPathSegment item in _polyline)
            {
                sides.Add(item as LineSegment);
            }
            return sides;
        }

        /// <summary>
        /// Gets all of the interior angles of the polygon.
        /// </summary>
        /// <returns>List&lt;Angle&gt;.</returns>
        protected List<Angle> getAnglesBetweenAllSides()
        {
            List<Angle> angles = new List<Angle>();
            if (_polyline == null)
            {
                return angles;
            }
            for (int i = 0; i < _polyline.CountSegments; i++)
            {
                angles.Add(AngleInteriorAt(i));
            }
            return angles;
        }

        /// <summary>
        /// Unit normal vectors of the provided segments are rotated counter-clockwise relative to each other.
        /// </summary>
        /// <param name="side1">The side1.</param>
        /// <param name="side2">The side2.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        protected bool normalsRotateCounterClockwise(LineSegment side1, LineSegment side2)
        {
            Angle normal1Angle = side1.NormalVector(1).Angle();
            Angle normal2Angle = side2.NormalVector(0).Angle();

            // Account for case where normal 2 is either 0 or 360, depending on rotation of normal 1
            double normal2AngleDegreesRaw =
                (normal2Angle.DegreesRaw.IsZeroSign() && normal1Angle.DegreesRaw.IsPositiveSign()) ?
                360 :
                normal2Angle.DegreesRaw;

            double normalRotationRaw = normal2AngleDegreesRaw - normal1Angle.DegreesRaw;
            return normalRotationRaw.IsPositiveSign();
        }

        /// <summary>
        /// Gets the angle between two adjacent sides of the shape.
        /// </summary>
        /// <param name="side1">The side1.</param>
        /// <param name="side2">The side2.</param>
        /// <returns>Angle.</returns>
        protected Angle getAngleBetweenSides(LineSegment side1, LineSegment side2)
        {
            Angle theta = Vector.Angle(side1.TangentVector(), side2.TangentVector());

            if (normalsRotateCounterClockwise(side1, side2))
            {
                return new Angle(Numbers.Pi - theta.Radians);
            }
            else
            {
                return new Angle(Numbers.Pi + theta.Radians);
            }
        }
        #endregion

        #region Methods: IShapeProperties
        /// <summary>
        /// Area of the shape.
        /// + if points are ordered counter-clockwise.
        /// </summary>
        /// <returns></returns>
        public override double Area()
        {
            if (_polyline == null)
            {
                return 0;
            }
            double area = 0;
            foreach (IPathSegment segment in _polyline)
            {
                area += Area_i(segment);
            }
            return 0.5 * area;
        }

        /// <summary>
        /// X-coordinate of the centroid of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Xo()
        {
            if (_polyline == null)
            {
                return 0;
            }
            double area = Area();
            if (area == 0 && _polyline.CountPoints > 0)
            {   // if polygon is a point
                return _polyline[0].I.X;
            }

            double centroidWeight = 0;
            foreach (IPathSegment segment in _polyline)
            {
                centroidWeight += (segment.I.X + segment.J.X) * Area_i(segment);
            }
            return centroidWeight / (6 * area);
        }

        /// <summary>
        /// Y-coordinate of the centroid of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Yo()
        {
            if (_polyline == null)
            {
                return 0;
            }
            double area = Area();
            if (area == 0 && _polyline.CountPoints > 0)
            {   // if polygon is a point
                return _polyline[0].I.Y;
            }

            double centroidWeight = 0;
            foreach (IPathSegment segment in _polyline)
            {
                centroidWeight += (segment.I.Y + segment.J.Y) * Area_i(segment);
            }
            return centroidWeight / (6 * Area());
        }

        /// <summary>
        /// Returns twice the area under the quadrilateral formed between the segment and the y-axis.
        /// + if points are ordered counter-clockwise.
        /// </summary>
        /// <param name="segment">The segment.</param>
        /// <returns>System.Double.</returns>
        protected double Area_i(IPathSegment segment)
        {
            CartesianCoordinate pt1 = segment.I;
            CartesianCoordinate pt2 = segment.J;
            return (pt1.X * pt2.Y - pt2.X * pt1.Y);
        }
        #endregion

        #region Methods: Chamfers & Fillets
        /// <summary>
        /// Chamfers the segments at the specified point.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <param name="depth">The depth.</param>
        /// <returns>PolyLine.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public Polygon ChamferPoint(int pointIndex, double depth)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Chamfers all intermediate points in the polygon.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <param name="depth">The depth.</param>
        /// <returns>PolyLine.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public Polygon ChamferAll(int pointIndex, double depth)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Fillets the segments at the specified point.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <param name="radius">The radius.</param>
        /// <returns>PolyLine.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public Polygon FilletPoint(int pointIndex, double radius)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Fillets all intermediate points in the polygon.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <param name="radius">The radius.</param>
        /// <returns>PolyLine.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public Polygon FilletAll(int pointIndex, double radius)
        {
            throw new NotImplementedException();
        }
        #endregion

        #region Methods: Internal
        /// <summary>
        /// Sets the coordinates and ensures that a valid shape is formed.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        internal void SetCoordinates(IEnumerable<CartesianCoordinate> coordinates)
        {
            _polyline = new PolyLine(coordinates);
            closeShapeIfNeeded();
        }
        #endregion

    }
}