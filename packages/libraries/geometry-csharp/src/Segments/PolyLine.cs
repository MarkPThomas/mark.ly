// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-20-2018
//
// Last Modified By : Mark P Thomas
// Last Modified On : 06-11-2020
// ***********************************************************************
// <copyright file="PolyLine.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Geometry.Tools;
using MPT.Math;
using MPT.Math.Coordinates;
using MPT.Math.Curves;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;

namespace MPT.Geometry.Segments
{
    /// <summary>
    /// Represents a multi-line segment.
    /// </summary>
    public class PolyLine : ITolerance, IEnumerable<IPathSegment>, ICloneable
    {
        #region Properties
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
                if (_segmentBoundary != null)
                {
                    _segmentBoundary.Tolerance = _tolerance;
                }
            }
        }

        /// <summary>
        /// Gets the count coordinates.
        /// </summary>
        /// <value>The count coordinates.</value>
        public int CountPoints => _segmentBoundary.PointBoundary().Count;
        /// <summary>
        /// Gets the coordinates.
        /// </summary>
        /// <value>The coordinates.</value>
        public IList<CartesianCoordinate> Coordinates => _segmentBoundary.PointBoundary();

        /// <summary>
        /// The segment boundary
        /// </summary>
        private SegmentsBoundary _segmentBoundary;
        /// <summary>
        /// Gets the count segments.
        /// </summary>
        /// <value>The count segments.</value>
        public int CountSegments => _segmentBoundary.Count;
        /// <summary>
        /// Gets or sets the <see cref="IPathSegment"/> at the specified index.
        /// </summary>
        /// <param name="index">The index.</param>
        /// <returns>IPathSegment.</returns>
        public IPathSegment this[int index]
        {
            get => _segmentBoundary[index];
            set
            {
                throw new ReadOnlyException();
            }
        }

        /// <summary>
        /// Gets a value indicating whether this instance is read only.
        /// </summary>
        /// <value><c>true</c> if this instance is read only; otherwise, <c>false</c>.</value>
        public bool IsReadOnly => true;


        // AKA Control points. TODO: Define tangent/control points further as additional path types are created.
        //protected IList<bool> _tangentsAreAlignedAtPointJ;
        //public bool DefaultNewTangentsAreAlignedAtPointJ { get; set; } = true;

        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="PolyLine" /> class.
        /// </summary>
        /// <param name="i">The i.</param>
        /// <param name="j">The j.</param>
        public PolyLine(CartesianCoordinate i, CartesianCoordinate j)
        {
            i.Tolerance = _tolerance;
            j.Tolerance = _tolerance;
            _segmentBoundary = new SegmentsBoundary(new List<IPathSegment>() { new LineSegment(i, j) });
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="PolyLine" /> class.
        /// </summary>
        /// <param name="segment">The segment.</param>
        public PolyLine(IPathSegment segment)
        {
            segment.Tolerance = _tolerance;
            _segmentBoundary = new SegmentsBoundary(new List<IPathSegment>() { segment });
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="PolyLine" /> class.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public PolyLine(IEnumerable<CartesianCoordinate> coordinates)
        {
            _segmentBoundary = new SegmentsBoundary();
            IList<CartesianCoordinate> boundaryCoordinates = new List<CartesianCoordinate>(coordinates);
            if (boundaryCoordinates.Count > 1)
            {
                for (int i = 0; i < boundaryCoordinates.Count - 1; i++)
                {
                    _segmentBoundary.AddLast(new LineSegment(boundaryCoordinates[i], boundaryCoordinates[i + 1]));
                }
            }
            _segmentBoundary.Tolerance = _tolerance;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="PolyLine"/> class.
        /// </summary>
        /// <param name="segmentBoundary">The segment boundary.</param>
        public PolyLine(SegmentsBoundary segmentBoundary)
        {
            _segmentBoundary = segmentBoundary;
            _segmentBoundary.Tolerance = _tolerance;
        }
        #endregion

        #region Methods: Query
        /// <summary>
        /// Returns the points that define the boundary between segments.
        /// </summary>
        /// <returns>PointBoundary.</returns>
        public PointBoundary PointBoundary()
        {
            return _segmentBoundary.PointBoundary();
        }

        /// <summary>
        /// Returns the overall extents of the polyline.
        /// This includes extents for curve shapes in between vertices.
        /// </summary>
        /// <returns>PointExtents.</returns>
        public PointExtents Extents()
        {
            return _segmentBoundary.Extents();
        }
        #endregion

        #region Points
        /// <summary>
        /// Coordinates the specified index.
        /// </summary>
        /// <param name="index">The index.</param>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate Coordinate(int index)
        {
            return _segmentBoundary.PointBoundary()[index];
        }

        /// <summary>
        /// Returns the first point of the polyline.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate FirstPoint()
        {
            return _segmentBoundary.FirstPoint();
        }

        /// <summary>
        /// Returns the last point of the polyline.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate LastPoint()
        {
            return _segmentBoundary.LastPoint();
        }

        /// <summary>
        /// Determines whether the <see cref="T:System.Collections.Generic.ICollection`1"></see> contains a specific value.
        /// </summary>
        /// <param name="point">The object to locate in the <see cref="T:System.Collections.Generic.ICollection`1"></see>.</param>
        /// <returns>true if <paramref name="point">item</paramref> is found in the <see cref="T:System.Collections.Generic.ICollection`1"></see>; otherwise, false.</returns>
        public bool ContainsPoint(CartesianCoordinate point)
        {
            return _segmentBoundary.PointBoundary().Contains(point);
        }

        /// <summary>
        /// Adds the point as the first point in the polyline.
        /// Segment created will be of the same type as the prior first segment.
        /// </summary>
        /// <param name="point">The point.</param>
        public bool AddFirstPoint(CartesianCoordinate point)
        {
            IPathSegment firstSegment = _segmentBoundary[0];
            IPathSegment newSegment = firstSegment.UpdateI(point);
            newSegment = newSegment.UpdateJ(firstSegment.I);
            return _segmentBoundary.AddFirst(newSegment);
        }

        /// <summary>
        /// Adds the point as the last point in the polyline.
        /// Segment created will be the same type as the prior last segment.
        /// </summary>
        /// <param name="point">The point.</param>
        public bool AddLastPoint(CartesianCoordinate point)
        {
            IPathSegment lastSegment = _segmentBoundary[CountSegments - 1];
            IPathSegment newSegment = lastSegment.UpdateJ(point);
            newSegment = newSegment.UpdateI(lastSegment.J);
            return _segmentBoundary.AddLast(newSegment);
        }

        /// <summary>
        /// Removes the first point and corresponding segment.
        /// </summary>
        public bool RemoveFirstPoint()
        {
            return _segmentBoundary.RemoveFirst();
        }

        /// <summary>
        /// Removes the last point and corresponding segment.
        /// </summary>
        public bool RemoveLastPoint()
        {
            return _segmentBoundary.RemoveLast();
        }

        /// <summary>
        /// Removes the specified point if it is present.
        /// </summary>
        /// <param name="point">The coordinate of the point to remove.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        public bool RemovePoint(CartesianCoordinate point)
        {
            return _segmentBoundary.RemovePoint(point);
        }

        /// <summary>
        /// Moves the specified point to the provided coordinate.
        /// </summary>
        /// <param name="originalPoint">The original point.</param>
        /// <param name="newPoint">The new point to move the original point to.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        public bool MovePoint(CartesianCoordinate originalPoint, CartesianCoordinate newPoint)
        {
            return _segmentBoundary.MovePoint(originalPoint, newPoint);
        }
        #endregion

        #region Point Tangents
        //public void AlignPointTangents(int index)
        //{

        //}
        //public void AlignPointTangentsToLeadingSegment(int index)
        //{

        //}
        //public void AlignPointTangentsToFollowingSegment(int index)
        //{

        //}
        #endregion

        #region Segments
        /// <summary>
        /// Returns the segment at the specified index.
        /// </summary>
        /// <param name="index">The index.</param>
        /// <returns>IPathSegment.</returns>
        public IPathSegment Segment(int index)
        {
            return _segmentBoundary[index];
        }

        /// <summary>
        /// Returns the pair of segments that join at the provided point index.
        /// If the point is the first or last point, the leading or following segment will be null.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <returns>Tuple&lt;IPathSegment, IPathSegment&gt;.</returns>
        public Tuple<IPathSegment, IPathSegment> AdjacentSegmentsAt(int pointIndex)
        {
            return _segmentBoundary.AdjacentSegmentsAt(pointIndex);
        }

        /// <summary>
        /// Determines whether the specified polyline contains the specified segment.
        /// </summary>
        /// <param name="segment">The segment.</param>
        /// <returns><c>true</c> if the polyline contains the specified segment; otherwise, <c>false</c>.</returns>
        public bool ContainsSegment(IPathSegment segment)
        {
            return _segmentBoundary.Contains(segment);
        }

        /// <summary>
        /// Adds the segment as the first segment in the polyline.
        /// Segment created will be of the same type as the prior first segment.
        /// </summary>
        /// <param name="segment">The segment.</param>
        public bool AddFirstSegment(IPathSegment segment)
        {
            if (!_segmentBoundary.IsValidFirstSegment(segment))
            {
                throw new ArgumentException(
                    "Segment provided is invalid for adding to the beginning of the polyline. " +
                    "Point J must be the same as the first point of the polyline");
            }
            return _segmentBoundary.AddFirst(segment);
        }

        /// <summary>
        /// Adds the segment as the last segment in the polyline.
        /// Segment created will be the same type as the prior last segment.
        /// </summary>
        /// <param name="segment">The segment.</param>
        public bool AddLastSegment(IPathSegment segment)
        {
            if (!_segmentBoundary.IsValidLastSegment(segment))
            {
                throw new ArgumentException(
                    "Segment provided is invalid for adding to the end of the polyline. " +
                    "Point I must be the same as the last point of the polyline");
            }
            return _segmentBoundary.AddLast(segment);
        }

        /// <summary>
        /// Splits the segment at the specified relative location.
        /// </summary>
        /// <param name="segment">The segment.</param>
        /// <param name="sRelative">The relative.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        public bool SplitSegment(IPathSegment segment, double sRelative)
        {
            return _segmentBoundary.SplitSegment(segment, sRelative);
        }

        /// <summary>
        /// Removes the first segment and corresponding point.
        /// </summary>
        public bool RemoveFirstSegment()
        {
            return _segmentBoundary.RemoveFirst();
        }

        /// <summary>
        /// Removes the last segment and corresponding point.
        /// </summary>
        public bool RemoveLastSegment()
        {
            return _segmentBoundary.RemoveLast();
        }

        // TODO: Unhide and test these once more than one segment type is available.
        ///// <summary>
        ///// Resets the segment to the default <see cref="LineSegment"></see>.
        ///// </summary>
        ///// <param name="segment">The segment.</param>
        ///// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        //public bool ResetSegmentToDefault(IPathSegment segment)
        //{
        //    int index = _segmentBoundary.IndexOf(segment);
        //    if (index < 0)
        //    {
        //        return false;
        //    }

        //    IPathSegment existingSegment = _segmentBoundary[index];
        //    _segmentBoundary[index] = new LineSegment(existingSegment.I, existingSegment.J);
        //    return true;
        //}

        ///// <summary>
        ///// Changes the segment in the polyine to the provided segment if they have matching starting and ending coordinates.
        ///// </summary>
        ///// <param name="segment">The segment.</param>
        ///// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        //public bool ChangeSegment(IPathSegment segment)
        //{
        //    int index = _segmentBoundary.IndexOf(segment);
        //    if (index < 0)
        //    {
        //        return false;
        //    }

        //    _segmentBoundary[index] = segment;
        //    return true;
        //}
        #endregion

        #region Methods: IPathTransform
        /// <summary>
        /// Translates the polyline.
        /// </summary>
        /// <param name="translation">The amount to translate by.</param>
        /// <returns>IPathSegment.</returns>
        public PolyLine Translate(CartesianOffset translation)
        {
            SegmentsBoundary segmentBoundary = new SegmentsBoundary();
            foreach (IPathSegment segment in _segmentBoundary)
            {
                segmentBoundary.AddLast(segment.Translate(translation));
            }
            return new PolyLine(segmentBoundary);
        }

        /// <summary>
        /// Scales the polyline from the provided reference point.
        /// </summary>
        /// <param name="scale">The amount to scale relative to the reference point.</param>
        /// <param name="referencePoint">The reference point.</param>
        /// <returns>IPathSegment.</returns>
        public PolyLine ScaleFromPoint(double scale, CartesianCoordinate referencePoint)
        {
            SegmentsBoundary segmentBoundary = new SegmentsBoundary();
            foreach (IPathSegment segment in _segmentBoundary)
            {
                segmentBoundary.AddLast(segment.ScaleFromPoint(scale, referencePoint));
            }
            return new PolyLine(segmentBoundary);
        }

        /// <summary>
        /// Rotates the polyline about the reference point.
        /// </summary>
        /// <param name="rotation">The amount of rotation. [rad]</param>
        /// <param name="referencePoint">The center of rotation reference point.</param>
        /// <returns>IPathSegment.</returns>
        public PolyLine RotateAboutPoint(Angle rotation, CartesianCoordinate referencePoint)
        {
            SegmentsBoundary segmentBoundary = new SegmentsBoundary();
            foreach (IPathSegment segment in _segmentBoundary)
            {
                segmentBoundary.AddLast(segment.RotateAboutPoint(rotation, referencePoint));
            }
            return new PolyLine(segmentBoundary);
        }

        /// <summary>
        /// Skews the specified polyline to the skewing of a containing box.
        /// </summary>
        /// <param name="stationaryReferencePoint">The stationary reference point of the skew box.</param>
        /// <param name="skewingReferencePoint">The skewing reference point of the skew box.</param>
        /// <param name="magnitude">The magnitude to skew along the x-axis and y-axis.</param>
        /// <returns>IPathSegment.</returns>
        public PolyLine Skew(
            CartesianCoordinate stationaryReferencePoint,
            CartesianCoordinate skewingReferencePoint,
            CartesianOffset magnitude)
        {
            SegmentsBoundary segmentBoundary = new SegmentsBoundary();
            foreach (IPathSegment segment in _segmentBoundary)
            {
                segmentBoundary.AddLast(segment.Skew(stationaryReferencePoint, skewingReferencePoint, magnitude));
            }
            return new PolyLine(segmentBoundary);
        }

        /// <summary>
        /// Mirrors the specified polyline about the specified reference line.
        /// </summary>
        /// <param name="referenceLine">The reference line.</param>
        /// <returns>IPathSegment.</returns>
        public PolyLine MirrorAboutLine(LinearCurve referenceLine)
        {
            SegmentsBoundary segmentBoundary = new SegmentsBoundary();
            foreach (IPathSegment segment in _segmentBoundary)
            {
                segmentBoundary.AddLast(segment.MirrorAboutLine(referenceLine));
            }
            return new PolyLine(segmentBoundary);
        }

        /// <summary>
        /// Mirrors the specified polyline about the x-axis.
        /// </summary>
        /// <returns>IPathSegment.</returns>
        public PolyLine MirrorAboutAxisX()
        {
            SegmentsBoundary segmentBoundary = new SegmentsBoundary();
            foreach (IPathSegment segment in _segmentBoundary)
            {
                segmentBoundary.AddLast(segment.MirrorAboutAxisX());
            }
            return new PolyLine(segmentBoundary);
        }

        /// <summary>
        /// Mirrors the specified polyline about the y-axis.
        /// </summary>
        /// <returns>IPathSegment.</returns>
        public PolyLine MirrorAboutAxisY()
        {
            SegmentsBoundary segmentBoundary = new SegmentsBoundary();
            foreach (IPathSegment segment in _segmentBoundary)
            {
                segmentBoundary.AddLast(segment.MirrorAboutAxisY());
            }
            return new PolyLine(segmentBoundary);
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
        public PolyLine ChamferPoint(int pointIndex, double depth)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Chamfers all intermediate points in the polyline.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <param name="depth">The depth.</param>
        /// <returns>PolyLine.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public PolyLine ChamferAll(int pointIndex, double depth)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Chamfers between polyline and specified segment.
        /// Returns the new polyline &amp; segment with updated bounding segments and joining chamfer segment.
        /// </summary>
        /// <param name="segment">The segment to chamfer to.</param>
        /// <param name="depth">The depth.</param>
        /// <returns>PolyLine.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public Tuple<PolyLine, LineSegment, IPathSegment> ChamferToSegment(IPathSegment segment, double depth)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Chamfers between two polylines.
        /// Returns the new polylines with updated bounding segments and joining chamfer segment.
        /// </summary>
        /// <param name="polyline">The polyline to chamfer to.</param>
        /// <param name="depth">The depth.</param>
        /// <returns>PolyLine.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public Tuple<PolyLine, LineSegment, PolyLine> ChamferToPolyline(PolyLine polyline, double depth)
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
        public PolyLine FilletPoint(int pointIndex, double radius)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Fillets all intermediate points in the polyline.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <param name="radius">The radius.</param>
        /// <returns>PolyLine.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public PolyLine FilletAll(int pointIndex, double radius)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Fillets between polyline and specified segment.
        /// Returns the new polyline &amp; segment with updated bounding segments and joining fillet segment.
        /// </summary>
        /// <param name="segment">The segment to fillet to.</param>
        /// <param name="radius">The radius.</param>
        /// <returns>PolyLine.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public Tuple<PolyLine, LineSegment, IPathSegment> FilletToSegment(IPathSegment segment, double radius)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Fillets between two polylines.
        /// Returns the new polylines with updated bounding segments and joining fillet segment.
        /// </summary>
        /// <param name="polyline">The polyline to fillet to.</param>
        /// <param name="radius">The radius.</param>
        /// <returns>PolyLine.</returns>
        /// <exception cref="NotImplementedException"></exception>
        public Tuple<PolyLine, LineSegment, PolyLine> FilletToPolyline(PolyLine polyline, double radius)
        {
            throw new NotImplementedException();
        }
        #endregion

        #region ICloneable
        /// <summary>
        /// Clones the line.
        /// </summary>
        /// <returns>PolyLine.</returns>
        public PolyLine CloneLine()
        {
            return new PolyLine(_segmentBoundary);
        }

        /// <summary>
        /// Creates a new object that is a copy of the current instance.
        /// </summary>
        /// <returns>A new object that is a copy of this instance.</returns>
        public object Clone()
        {
            return CloneLine();
        }
        #endregion

        #region Enumerator
        /// <summary>
        /// Gets the coordinate enumerator.
        /// </summary>
        /// <value>The coordinate enumerator.</value>
        public IEnumerator<CartesianCoordinate> GetCoordinateEnumerator()
        {
            return _segmentBoundary.PointBoundary().GetEnumerator();
        }
        /// <summary>
        /// Gets the segment enumerator.
        /// </summary>
        /// <value>The segment enumerator.</value>
        public IEnumerator<IPathSegment> GetSegmentEnumerator()
        {
            return _segmentBoundary.GetEnumerator();
        }

        /// <summary>
        /// Returns an enumerator that iterates through the collection.
        /// </summary>
        /// <returns>An enumerator that can be used to iterate through the collection.</returns>
        public IEnumerator<IPathSegment> GetEnumerator()
        {
            return _segmentBoundary.GetEnumerator();
        }

        // ncrunch: no coverage start
        /// <summary>
        /// Returns an enumerator that iterates through a collection.
        /// </summary>
        /// <returns>An <see cref="System.Collections.IEnumerator"></see> object that can be used to iterate through the collection.</returns>
        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        // ncrunch: no coverage end
        #endregion

        #region Methods: Private

        #endregion
    }
}