// ***********************************************************************
// Assembly         : MPT.GIS
// Author           : Mark Thomas
// Created          : 10-04-2017
//
// Last Modified By : Mark Thomas
// Last Modified On : 12-09-2017
// ***********************************************************************
// <copyright file="CompositeShape.cs" company="MPTinc">
//     Copyright ©  2017
// </copyright>
// <summary></summary>
// ***********************************************************************
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;



using MPT.Geometry.Tools;
using MPT.Math.Coordinates;
using GL = MPT.Geometry.GeometryLibrary;

namespace MPT.Geometry.Aggregation
{

    // TODO: For all boundary changes, clusters and holes occur when a shape is entirely outside of or inside of the shape group.
    // This is to be handled by linking the shape areas by a collinear segment, which requires duplicating coordinates.
    // All positive shapes are determined by CCW travel.
    // All negative shapes are determined by CW travel.

    /// <summary>
    /// Represents a composite shape derived from a collection of shapes.
    /// </summary>
    public class CompositeShape<T, TBoundary, TExtents> : List<CompositeShape<T, TBoundary, TExtents>>
        where TBoundary : Boundary<T>, new()
        where TExtents : Extents<T>, new()
        where T : ICoordinate
    {
        #region Properties
        /// <summary>
        /// Tolerance to use in all calculations with double types.
        /// </summary>
        /// <value>The tolerance.</value>
        public double Tolerance { get; set; } = GL.ZeroTolerance;

        /// <summary>
        /// The name of the shape.
        /// </summary>
        /// <value>The name.</value>
        public string Name { get; }

        /// <summary>
        /// The boundary
        /// </summary>
        protected readonly TBoundary _boundary;
        /// <summary>
        /// The boundary that wraps the composite shape.
        /// </summary>
        /// <value>The boundary.</value>
        public IList<T> Boundary => new ReadOnlyCollection<T>(_boundary.Coordinates);


        /// <summary>
        /// The extents
        /// </summary>
        protected readonly TExtents _extents;
        /// <summary>
        /// The extents bounding box of all components.
        /// </summary>
        /// <value>The extents.</value>
        public IList<T> Extents => _extents.Boundary();

        /// <summary>
        /// If true, the shape is considered to be a hole, otherwise it is a solid.
        /// </summary>
        public bool IsVoid { get; set; }
        #endregion


        // TODO: Determine how to handle shape derived from internals vs. manually specified
        #region Initialization

        /// <summary>
        /// Initializes a new instance of the <see cref="CompositeShape{T, TBoundary, TExtents}"/> class.
        /// </summary>
        /// <param name="name">The name.</param>
        public CompositeShape(string name = "")
        {
            Name = name;
            _boundary = new TBoundary();
            _extents = new TExtents();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CompositeShape{T, TBoundary, TExtents}"/> class.
        /// </summary>
        /// <param name="boundary">The shape boundary.</param>
        /// <param name="name">The name of the composite shape.</param>
        public CompositeShape(IList<T> boundary,
            string name = "")
        {
            Name = name;
            _boundary = new TBoundary();
            _boundary.AddRange(boundary);
            _extents = new TExtents();
            _extents.AddRange(boundary);
        }


        /// <summary>
        /// Initializes a new instance of the <see cref="CompositeShape{T, TBoundary, TExtents}"/> class.
        /// </summary>
        /// <param name="shapes">A collection of shapes.</param>
        /// <param name="name">The name of the composite shape.</param>
        public CompositeShape(IEnumerable<CompositeShape<T, TBoundary, TExtents>> shapes,
            string name = "")
        {
            Name = name;
            AddRange(shapes);
        }
        #endregion

        #region Overwrites: List
        /// <summary>
        /// Adds an object to the end of the <see cref="T:System.Collections.Generic.List`1" />.
        /// </summary>
        /// <param name="item">The object to be added to the end of the <see cref="T:System.Collections.Generic.List`1" />. The value can be null for reference types.</param>
        public new void Add(CompositeShape<T, TBoundary, TExtents> item)
        {
            addToBoundary(item);
            base.Add(item);
            _extents.AddRange(item.Extents);
        }

        /// <summary>
        /// Adds the elements of the specified collection to the end of the <see cref="T:System.Collections.Generic.List`1" />.
        /// </summary>
        /// <param name="collection">The collection of shapes.</param>
        public new void AddRange(IEnumerable<CompositeShape<T, TBoundary, TExtents>> collection)
        {
            foreach (CompositeShape<T, TBoundary, TExtents> item in collection)
            {
                base.Add(item);
            }
            updateBoundaryProperties();
        }


        /// <summary>
        /// Inserts an element into the <see cref="T:System.Collections.Generic.List`1" /> at the specified index.
        /// </summary>
        /// <param name="index">The zero-based index at which <paramref name="item" /> should be inserted.</param>
        /// <param name="item">The object to insert. The value can be null for reference types.</param>
        public new void Insert(int index, CompositeShape<T, TBoundary, TExtents> item)
        {
            addToBoundary(item);
            base.Insert(index, item);
            _extents.AddRange(item.Extents);
        }


        /// <summary>
        /// Inserts the elements of a collection into the <see cref="T:System.Collections.Generic.List`1" /> at the specified index.
        /// </summary>
        /// <param name="index">The zero-based index at which the new elements should be inserted.</param>
        /// <param name="collection">The collection of shapes to insert.</param>
        public new void InsertRange(int index, IEnumerable<CompositeShape<T, TBoundary, TExtents>> collection)
        {
            foreach (CompositeShape<T, TBoundary, TExtents> item in collection)
            {
                base.Insert(index, item);
            }
            updateBoundaryProperties();
        }


        /// <summary>
        /// Removes all elements from the <see cref="T:System.Collections.Generic.List`1" />.
        /// </summary>
        public new void Clear()
        {
            base.Clear();
            _boundary.Clear();
            _extents.Clear();
        }


        /// <summary>
        /// Removes the first occurrence of a specific object from the <see cref="T:System.Collections.Generic.List`1" />.
        /// </summary>
        /// <param name="item">The object to remove from the <see cref="T:System.Collections.Generic.List`1" />. The value can be null for reference types.</param>
        /// <returns>true if <paramref name="item" /> is successfully removed; otherwise, false.  This method also returns false if <paramref name="item" /> was not found in the <see cref="T:System.Collections.Generic.List`1" />.</returns>
        public new bool Remove(CompositeShape<T, TBoundary, TExtents> item)
        {
            if (!base.Remove(item)) return false;

            removeFromBoundary(item);
            updateExtents();
            return true;
        }

        /// <summary>
        /// Removes a range of elements from the <see cref="T:System.Collections.Generic.List`1" />.
        /// </summary>
        /// <param name="index">The zero-based starting index of the range of elements to remove.</param>
        /// <param name="count">The number of elements to remove.</param>
        public new void RemoveRange(int index, int count)
        {
            for (int i = index; i < index + count; i++)
            {
                removeFromBoundary(this[i]);
            }
            base.RemoveRange(index, count);
            updateExtents();
        }

        /// <summary>
        /// Removes the element at the specified index of the <see cref="T:System.Collections.Generic.List`1" />.
        /// </summary>
        /// <param name="index">The zero-based index of the element to remove.</param>
        public new void RemoveAt(int index)
        {
            removeFromBoundary(this[index]);
            base.RemoveAt(index);
            updateExtents();
        }

        /// <summary>
        /// Removes all the elements that match the conditions defined by the specified predicate.
        /// </summary>
        /// <param name="match">The <see cref="T:System.Predicate`1" /> delegate that defines the conditions of the elements to remove.</param>
        /// <returns>The number of elements removed from the <see cref="T:System.Collections.Generic.List`1" /> .</returns>
        public new int RemoveAll(Predicate<CompositeShape<T, TBoundary, TExtents>> match)
        {
            int result = base.RemoveAll(match);
            if (result <= 0) return result;

            updateBoundaryProperties();
            return result;
        }

        /// <summary>
        /// Returns a <see cref="string" /> that represents this instance.
        /// </summary>
        /// <returns>A <see cref="string" /> that represents this instance.</returns>
        public override string ToString()
        {
            return string.IsNullOrEmpty(Name) ? base.ToString() : Name;
        }
        #endregion

        #region Modify Shapes
        /// <summary>
        /// Determines whether shape is the lowest level defined shape.
        /// </summary>
        /// <returns><c>true</c> if the shape is the lowest level defined shape; otherwise, <c>false</c>.</returns>
        public bool IsBaseShape()
        {
            return (Count == 0);
        }

        // TODO: Consider carefully the overlapping shapes between solid/void in child shapes.
        /// <summary>
        /// The list of boundaries that wrap the composite shape voids.
        /// This is recursive to the base shape.
        /// </summary>
        /// <value>The boundary.</value>
        public IList<IList<T>> VoidBoundaries()
        {
            List<IList<T>> voidBoundaries = new List<IList<T>>();
            if (IsVoid) voidBoundaries.Add(Boundary);
            foreach (CompositeShape<T, TBoundary, TExtents> shape in this)
            {
                if (shape.IsVoid)
                {
                    voidBoundaries.Add(shape.Boundary);
                }

                if (!shape.IsBaseShape())
                {
                    voidBoundaries.AddRange(shape.VoidBoundaries());
                }
            }
            return voidBoundaries;
        }

        /// <summary>
        /// The list of boundaries that wrap the composite shape solids.
        /// This is recursive to the base shape.
        /// </summary>
        /// <value>The boundary.</value>
        public IList<IList<T>> SolidBoundaries()
        {
            List<IList<T>> solidBoundaries = new List<IList<T>>();
            if (!IsVoid) solidBoundaries.Add(Boundary);
            foreach (CompositeShape<T, TBoundary, TExtents> shape in this)
            {
                if (!shape.IsVoid)
                {
                    solidBoundaries.Add(shape.Boundary);
                }

                if (!shape.IsBaseShape())
                {
                    solidBoundaries.AddRange(shape.VoidBoundaries());
                }
            }
            return solidBoundaries;
        }

        // TODO: Finish
        /// <summary>
        /// Splits the shape and all child shapes along the specified polyline.
        /// </summary>
        /// <param name="polyline">The polyline.</param>
        /// <returns>Shape.</returns>
        /// <exception cref="System.NotImplementedException"></exception>
        public CompositeShape<T, TBoundary, TExtents> Split(IEnumerable<T> polyline)
        {
            throw new NotImplementedException();
        }

        // TODO: Finish
        /// <summary>
        /// Aligns the internal boundaries of all child shapes.
        /// This starts with the lowest child shapes and works up to the current shape.
        /// </summary>
        /// <exception cref="System.NotImplementedException"></exception>
        public void AlignInternalBoundaries()
        {
            throw new NotImplementedException();
        }

        // TODO: Finish
        /// <summary>
        /// Aligns the external boundary with the internal boundaries of all child shapes.
        /// </summary>
        /// <exception cref="System.NotImplementedException"></exception>
        public void AlignExternalToInternalBoundaries()
        {
            throw new NotImplementedException();
        }
        #endregion


        #region Private: Methods

        /// <summary>
        /// Updates the boundary properties.
        /// </summary>
        private void updateBoundaryProperties()
        {
            recalculateBoundary();
            _extents.Reset(Boundary);
        }
        #endregion

        #region Private: Extents

        /// <summary>
        /// Updates the extents.
        /// </summary>
        private void updateExtents()
        {
            _extents.Clear();
            foreach (CompositeShape<T, TBoundary, TExtents> item in this)
            {
                _extents.AddRange(item.Extents);
            }
        }
        #endregion

        #region Private: Boundaries
        /// <summary>
        /// Recalculates the boundary.
        /// </summary>
        /// <exception cref="System.NotImplementedException"></exception>
        private void recalculateBoundary()
        {
            // Simple recalculation if only shape
            if (Count == 1)
            {
                _boundary.Reset(this[0].Boundary);
            }
            else
            {
                _boundary.Clear();
                foreach (CompositeShape<T, TBoundary, TExtents> shape in this)
                {
                    if (shape.IsVoid)
                    {
                        removeFromBoundary(shape);
                    }
                    else
                    {
                        addToBoundary(shape);
                    }
                }
            }
        }

        /// <summary>
        /// Adds to boundary.
        /// </summary>
        /// <param name="item">The item.</param>
        private void addToBoundary(CompositeShape<T, TBoundary, TExtents> item)
        {
            if (IsBaseShape())
            {
                _boundary.Reset(item.Boundary);
            }
            else
            {
                _boundary.AddRange(item.Boundary);
            }
        }

        /// <summary>
        /// Removes from boundary.
        /// </summary>
        /// <param name="item">The item.</param>
        private void removeFromBoundary(CompositeShape<T, TBoundary, TExtents> item)
        {
            // Simple removal if last shape
            if (Count == 1 &&
                Contains(item))
            {
                _boundary.Clear();
            }
            else
            {
                _boundary.RemoveRange(item.Boundary);
            }
        }
        #endregion
    }
}
