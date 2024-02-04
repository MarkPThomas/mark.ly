// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-11-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 06-11-2020
// ***********************************************************************
// <copyright file="SegmentsBoundary.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Geometry.Segments;
using MPT.Math;
using MPT.Math.Coordinates;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using GL = MPT.Geometry.GeometryLibrary;
using NMath = System.Math;

namespace MPT.Geometry.Tools
{
    /// <summary>
    /// Represents a boundary defined by contiguous segments.
    /// Implements the <see cref="MPT.Math.ITolerance" />
    /// Implements the <see cref="System.Collections.Generic.IEnumerable{IPathSegment}" />
    /// </summary>
    /// <seealso cref="MPT.Math.ITolerance" />
    /// <seealso cref="System.Collections.Generic.IEnumerable{IPathSegment}" />
    public class SegmentsBoundary : ITolerance, IEnumerable<IPathSegment>
    {
        #region Properties
        /// <summary>
        /// The tolerance
        /// </summary>
        protected double _tolerance = GL.ZeroTolerance;
        /// <summary>
        /// Tolerance to use in all calculations with double types.
        /// </summary>
        public double Tolerance
        {
            get { return _tolerance; }
            set
            {
                _tolerance = value;
                foreach (IPathSegment segment in _contents)
                {
                    if (segment != null)
                    {
                        segment.Tolerance = _tolerance;
                    }
                }
            }
        }

        /// <summary>
        /// The contents
        /// </summary>
        private IPathSegment[] _contents = new IPathSegment[_minArraySize];


        /// <summary>
        /// Gets the count.
        /// </summary>
        /// <value>The count.</value>
        public int Count { get; private set; }

        /// <summary>
        /// Gets a value indicating whether the <see cref="T:System.Collections.Generic.ICollection`1"></see> is read-only.
        /// </summary>
        /// <value><c>true</c> if this instance is read only; otherwise, <c>false</c>.</value>
        public bool IsReadOnly => true;

        /// <summary>
        /// Gets or sets the <see cref="IPathSegment"/> at the specified index.
        /// </summary>
        /// <param name="index">The index.</param>
        /// <returns>IPathSegment.</returns>
        public IPathSegment this[int index]
        {
            get
            {
                if (index >= Count)
                {
                    throw new IndexOutOfRangeException();
                }
                return _contents[index];
            }
            set
            {
                throw new ReadOnlyException();
            }
        }
        #endregion

        #region Initialization

        /// <summary>
        /// Initializes a new instance of the <see cref="CoordinatesBoundary{T}" /> class.
        /// </summary>
        public SegmentsBoundary()
        {
            Count = 0;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="SegmentsBoundary"/> class.
        /// </summary>
        /// <param name="segments">The segments.</param>
        public SegmentsBoundary(IPathSegment[] segments)
        {
            Count = segments.Length;
            _contents = new IPathSegment[Count];
            for (int i = 0; i < Count; i++)
            {
                _contents[i] = segments[i];
            }
            Tolerance = _tolerance;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CoordinatesBoundary{T}" /> class.
        /// </summary>
        /// <param name="segments">The segments.</param>
        public SegmentsBoundary(IEnumerable<IPathSegment> segments)
        {
            Count = 0;
            foreach (IPathSegment coordinate in segments)
            {
                Count++;
            }

            _contents = new IPathSegment[Count];
            int i = 0;
            foreach (IPathSegment coordinate in segments)
            {
                _contents[i] = coordinate;
                i++;
            }
            Tolerance = _tolerance;
        }
        #endregion

        #region Methods: List
        /// <summary>
        /// Adds the segment as the first segment in the boundary.
        /// </summary>
        /// <param name="item">The item.</param>
        public bool AddFirst(IPathSegment item)
        {
            if (IsValidFirstSegment(item))
            {
                if (Count == 0)
                {
                    _contents[Count] = item;
                    Count++;
                }
                else
                {
                    insert(0, item);
                }
                return true;
            }
            return false;
        }

        /// <summary>
        /// Adds the segment as the last segment in the boundary.
        /// </summary>
        /// <param name="item">The item.</param>
        public bool AddLast(IPathSegment item)
        {
            if (IsValidLastSegment(item))
            {
                resizeArraySizeIfNecessary();
                _contents[Count] = item;
                Count++;
                return true;
            }
            return false;
        }

        /// <summary>
        /// Inserts the specified index.
        /// </summary>
        /// <param name="index">The index.</param>
        /// <param name="item">The item.</param>
        private void insert(int index, IPathSegment item)
        {
            if (index >= 0)
            {
                resizeArraySizeIfNecessary();
                Count++;

                for (int i = Count - 1; i > index; i--)
                {
                    _contents[i] = _contents[i - 1];
                }
                _contents[index] = item;
            }
        }

        /// <summary>
        /// Removes the first segment.
        /// </summary>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        public bool RemoveFirst()
        {
            int lastCount = Count;
            removeAt(0);
            return (Count < lastCount);
        }


        /// <summary>
        /// Removes the last segment.
        /// </summary>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        public bool RemoveLast()
        {
            int lastCount = Count;
            removeAt(Count - 1);
            return (Count < lastCount);
        }

        /// <summary>
        /// Removes segment at the specified index.
        /// </summary>
        /// <param name="index">The index.</param>
        private void removeAt(int index)
        {
            if ((index >= 0) && (index < Count))
            {
                if (index == Count - 1)
                {
                    _contents[index] = null;
                }
                else
                {
                    for (int i = index; i < Count - 1; i++)
                    {
                        _contents[i] = _contents[i + 1];
                    }
                }
                Count--;
            }
            else
            {
                throw new IndexOutOfRangeException();
            }
            reduceArraySizeIfNecessary();
        }


        /// <summary>
        /// Clears this instance.
        /// </summary>
        public void Clear()
        {
            _contents = new IPathSegment[_minArraySize];
            Count = 0;
        }

        // TODO: Make Replace internal
        /// <summary>
        /// Replaces the specified original segment with the provided segment.
        /// Coordinates defining the segments must match.
        /// </summary>
        /// <param name="originalItem">The original item.</param>
        /// <param name="newItem">The new item.</param>
        public bool Replace(IPathSegment originalItem, IPathSegment newItem)
        {
            int index = IndexOf(originalItem);
            if (index > -1)
            {
                return ReplaceAt(index, newItem);
            }
            return false;
        }

        // TODO: Make ReplaceAt internal
        /// <summary>
        /// Replaces the segment at the specified index with the provided segment.
        /// Coordinates defining the segments must match.
        /// </summary>
        /// <param name="index">The index.</param>
        /// <param name="item">The item.</param>
        public bool ReplaceAt(int index, IPathSegment item)
        {
            IPathSegment segment = _contents[index];
            if (segment.HasSameCoordinates(item))
            {
                _contents[index] = item;
                return true;
            }
            return false;
        }

        /// <summary>
        /// Gets the index of the specified segment.
        /// Returns -1 if the segment is not found.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <returns>System.Int32.</returns>
        public int IndexOf(IPathSegment item)
        {
            if (item == null)
            {
                return -1;
            }
            for (int i = 0; i < Count; i++)
            {
                if (_contents[i].Equals(item))
                {
                    return i;
                }
            }
            return -1;
        }


        /// <summary>
        /// Determines whether this instance contains the segment.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <returns><c>true</c> if [contains] [the specified item]; otherwise, <c>false</c>.</returns>
        public bool Contains(IPathSegment item)
        {
            for (int i = 0; i < Count; i++)
            {
                if (_contents[i].Equals(item))
                {
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// Copies to array.
        /// </summary>
        /// <param name="array">The array.</param>
        /// <param name="arrayIndex">Index of the array.</param>
        public void CopyTo(IPathSegment[] array, int arrayIndex)
        {
            for (int i = 0; i < Count; i++)
            {
                array.SetValue(_contents[i], arrayIndex++);
            }
        }
        #endregion

        #region Methods: Query
        /// <summary>
        /// The first point defining the segment boundary.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate FirstPoint()
        {
            return _contents[0].I;
        }

        /// <summary>
        /// The last point defining the segment boundary.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public CartesianCoordinate LastPoint()
        {
            return _contents[Count - 1].J;
        }

        /// <summary>
        /// The first segment defining the segment boundary.
        /// </summary>
        /// <returns>IPathSegment.</returns>
        public IPathSegment FirstSegment()
        {
            return _contents[0];
        }

        /// <summary>
        /// The last segment defining the segment boundary.
        /// </summary>
        /// <returns>IPathSegment.</returns>
        public IPathSegment LastSegment()
        {
            return _contents[Count - 1];
        }

        /// <summary>
        /// Returns the pair of segments that join at the point specified by index.
        /// If the point is the first or last point, the leading or following segment will be null.
        /// </summary>
        /// <param name="pointIndex">Index of the point.</param>
        /// <returns>Tuple&lt;IPathSegment, IPathSegment&gt;.</returns>
        public Tuple<IPathSegment, IPathSegment> AdjacentSegmentsAt(int pointIndex)
        {
            PointBoundary boundary = PointBoundary();
            if (pointIndex < 0 || pointIndex > boundary.Count - 1)
            {
                throw new IndexOutOfRangeException();
            }
            return AdjacentSegments(boundary[pointIndex]);
        }

        /// <summary>
        /// Returns the pair of segments that join at the provided coordinate.
        /// If the point is the first or last point, the leading or following segment will be null.
        /// </summary>
        /// <param name="point">The point.</param>
        /// <returns>Tuple&lt;IPathSegment, IPathSegment&gt;.</returns>
        public Tuple<IPathSegment, IPathSegment> AdjacentSegments(CartesianCoordinate point)
        {
            if (!PointBoundary().Contains(point))
            {
                return new Tuple<IPathSegment, IPathSegment>(null, null);
            }

            IPathSegment itemI = null;
            IPathSegment itemJ = null;
            foreach (IPathSegment segment in this)
            {
                if (segment.I == point)
                {
                    itemJ = segment;
                    continue;
                }
                if (segment.J == point)
                {
                    itemI = segment;
                    continue;
                }
                if (itemI != null && itemJ != null)
                {
                    break;
                }
            }
            return new Tuple<IPathSegment, IPathSegment>(itemI, itemJ);
        }

        /// <summary>
        /// Returns the points that define the boundary between segments.
        /// </summary>
        /// <returns>PointBoundary.</returns>
        public PointBoundary PointBoundary()
        {
            PointBoundary pointBoundary = new PointBoundary();
            for (int i = 0; i < Count; i++)
            {
                pointBoundary.Add(_contents[i].I);
            }
            pointBoundary.Add(LastPoint());
            return pointBoundary;
        }

        /// <summary>
        /// Returns the overall extents of the segments boundary.
        /// This includes extents for curve shapes in between vertices.
        /// </summary>
        /// <returns>PointExtents.</returns>
        public PointExtents Extents()
        {
            PointExtents extents = new PointExtents();
            for (int i = 0; i < Count; i++)
            {
                extents.AddExtents(_contents[i].Extents);
            }
            return extents;
        }
        #endregion

        #region Methods: Modify Points
        /// <summary>
        /// Splits the segment at the relative position.
        /// </summary>
        /// <param name="segment">The segment.</param>
        /// <param name="sRelative">The relative position along the path.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        internal bool SplitSegment(IPathSegment segment, double sRelative)
        {
            int index = IndexOf(segment);
            if (index < 0)
            {
                return false;
            }
            return SplitSegment(index, sRelative);
        }

        /// <summary>
        /// Splits the segment at the relative position.
        /// </summary>
        /// <param name="index">The index of the segment to split.</param>
        /// <param name="sRelative">The relative position along the path.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        internal bool SplitSegment(int index, double sRelative)
        {
            IPathSegment segment = _contents[index];
            Tuple<IPathSegment, IPathSegment> splitSegments = segment.SplitBySegmentPosition(sRelative);
            removeAt(index);
            insert(index, splitSegments.Item1);
            insert(index + 1, splitSegments.Item2);

            return true;
        }

        /// <summary>
        /// Removes the point, if present.
        /// </summary>
        /// <param name="point">The point.</param>
        /// <returns><c>true</c> if XXXX, <c>false</c> otherwise.</returns>
        internal bool RemovePoint(CartesianCoordinate point)
        {
            Tuple<IPathSegment, IPathSegment> adjacentSegments = AdjacentSegments(point);
            if (adjacentSegments.Item1 == null && adjacentSegments.Item2 == null)
            {
                return false;
            }
            if (adjacentSegments.Item1 == null && adjacentSegments.Item2 != null)
            {   // First segment
                return RemoveFirst();
            }
            if (adjacentSegments.Item1 != null && adjacentSegments.Item2 == null)
            {   // Last segment
                return RemoveLast();
            }

            IPathSegment newPathSegment;
            if (areOfSamePathSegmentType(adjacentSegments.Item1, adjacentSegments.Item2))
            {
                newPathSegment = adjacentSegments.Item1.MergeWithFollowingSegment(adjacentSegments.Item2);
            }
            else
            {   // TODO: Test once other line segment types available
                newPathSegment = new LineSegment(adjacentSegments.Item1.I, adjacentSegments.Item2.J);
            }

            // Insert new segment and remove the two original ones.
            int leadingSegmentIndex = IndexOf(adjacentSegments.Item1);
            removeAt(leadingSegmentIndex); // Remove leading segment
            removeAt(leadingSegmentIndex); // Remove following segment
            insert(leadingSegmentIndex, newPathSegment);

            return true;
        }

        /// <summary>
        /// Determines if the path segments are of the same type.
        /// </summary>
        /// <param name="segment1">The segment1.</param>
        /// <param name="segment2">The segment2.</param>
        /// <returns>System.Boolean.</returns>
        private bool areOfSamePathSegmentType(IPathSegment segment1, IPathSegment segment2)
        {
            var t = segment1.GetType();
            var u = segment2.GetType();

            return (t.IsAssignableFrom(u) || u.IsAssignableFrom(t));
        }


        internal bool MovePoint(CartesianCoordinate originalPoint, CartesianCoordinate newPoint)
        {
            Tuple<IPathSegment, IPathSegment> adjacentSegments = AdjacentSegments(originalPoint);
            int leadingSegmentIndex = IndexOf(adjacentSegments.Item1);
            if (leadingSegmentIndex >= 0)
            {
                removeAt(leadingSegmentIndex);
                insert(leadingSegmentIndex, adjacentSegments.Item1.UpdateJ(newPoint));
            }

            int followingSegmentIndex = IndexOf(adjacentSegments.Item2);
            if (followingSegmentIndex >= 0)
            {
                removeAt(followingSegmentIndex);
                insert(followingSegmentIndex, adjacentSegments.Item2.UpdateI(newPoint));
            }

            return !(leadingSegmentIndex < 0 && followingSegmentIndex < 0);
        }
        #endregion

        #region Methods: Validation
        /// <summary>
        /// Determines whether [is valid first segment] [the specified segment].
        /// </summary>
        /// <param name="segment">The segment.</param>
        /// <returns><c>true</c> if [is valid first segment] [the specified segment]; otherwise, <c>false</c>.</returns>
        internal bool IsValidFirstSegment(IPathSegment segment)
        {
            return Count == 0? true : (segment.J == FirstPoint());
        }

        /// <summary>
        /// Determines whether [is valid last segment] [the specified segment].
        /// </summary>
        /// <param name="segment">The segment.</param>
        /// <returns><c>true</c> if [is valid last segment] [the specified segment]; otherwise, <c>false</c>.</returns>
        internal bool IsValidLastSegment(IPathSegment segment)
        {
            return Count == 0 ? true : (segment.I == LastPoint());
        }
        #endregion

        #region Array
        /// <summary>
        /// The array resize ratio
        /// </summary>
        private static int _arrayResizeRatio = 2;
        /// <summary>
        /// The minimum array size
        /// </summary>
        private static int _minArraySize = 8;
        /// <summary>
        /// Resizes the array size if necessary.
        /// </summary>
        private void resizeArraySizeIfNecessary()
        {
            if (Count == _contents.Length)
            {
                int newLength = _arrayResizeRatio * Count;
                resizeArray(newLength);
            }
        }
        /// <summary>
        /// Reduces the array size if necessary.
        /// </summary>
        private void reduceArraySizeIfNecessary()
        {
            int newLength = NMath.Max((int)NMath.Round(_contents.Length / (double)_arrayResizeRatio), _minArraySize);
            if (Count < newLength)
            {
                resizeArray(newLength);
            }
        }
        /// <summary>
        /// Resizes the array.
        /// </summary>
        /// <param name="newSize">The new size.</param>
        private void resizeArray(int newSize)
        {
            Array.Resize(ref _contents, newSize);
        }
        #endregion

        #region Enumerator
        /// <summary>
        /// Returns an enumerator that iterates through the collection.
        /// </summary>
        /// <returns>An enumerator that can be used to iterate through the collection.</returns>
        public IEnumerator<IPathSegment> GetEnumerator()
        {
            IPathSegment[] segments = new IPathSegment[Count];
            for (int i = 0; i < Count; i++)
            {
                segments[i] = _contents[i];
            }
            return new SegmentsEnumerator<IPathSegment>(segments);
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

        /// <summary>
        /// Class SegmentsEnumerator.
        /// Implements the <see cref="System.Collections.Generic.IEnumerator{T}" />
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <seealso cref="System.Collections.Generic.IEnumerator{T}" />
        internal class SegmentsEnumerator<T> : IEnumerator<T>
        where T : IPathSegment
        {
            /// <summary>
            /// The position
            /// </summary>
            private int _position = -1;

            /// <summary>
            /// The contents
            /// </summary>
            public T[] _contents;

            /// <summary>
            /// Gets the element in the collection at the current position of the enumerator.
            /// </summary>
            /// <value>The current.</value>
            object IEnumerator.Current => Current;
            /// <summary>
            /// Gets the element in the collection at the current position of the enumerator.
            /// </summary>
            /// <value>The current.</value>
            /// <exception cref="InvalidOperationException"></exception>
            public T Current
            {
                get
                {
                    try
                    {
                        return _contents[_position];
                    }
                    catch (IndexOutOfRangeException)
                    {
                        throw new InvalidOperationException();
                    }
                }
            }


            /// <summary>
            /// Initializes a new instance of the <see cref="SegmentsEnumerator{T}"/> class.
            /// </summary>
            /// <param name="list">The list.</param>
            public SegmentsEnumerator(T[] list)
            {
                _contents = list;
            }

            /// <summary>
            /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
            /// </summary>
            public void Dispose()
            {
                // No code needed
            }

            /// <summary>
            /// Advances the enumerator to the next element of the collection.
            /// </summary>
            /// <returns>true if the enumerator was successfully advanced to the next element; false if the enumerator has passed the end of the collection.</returns>
            public bool MoveNext()
            {
                _position++;
                return (_position < _contents.Length);
            }

            /// <summary>
            /// Sets the enumerator to its initial position, which is before the first element in the collection.
            /// </summary>
            public void Reset()
            {
                _position = -1;
            }
        }
        #endregion
    }
}