// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark Thomas
// Created          : 12-09-2017
//
// Last Modified By : Mark Thomas
// Last Modified On : 12-09-2017
// ***********************************************************************
// <copyright file="Extents.cs" company="MPTinc">
//     Copyright ©  2017
// </copyright>
// <summary></summary>
// ***********************************************************************
using System.Collections.Generic;
using NMath = System.Math;

using MPT.Math.Coordinates3D;
using MPT.Math.Coordinates;

namespace MPT.Geometry.Tools
{
    /// <summary>
    /// Represents the coordinate bounds of a shape or line, or cluster of points in 3D-space.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="U"></typeparam>
    /// <typeparam name="TExtents">The type of the t extents.</typeparam>
    public abstract class Extents3D<T, U, TExtents>
         where TExtents : Extents<U>, new()
         where T : ICoordinate3D
         where U : ICoordinate
    {
        /// <summary>
        /// The maximum Y-coordinate
        /// </summary>
        protected double _maxY = double.NegativeInfinity;
        /// <summary>
        /// The minimum Y-coordinate
        ///
        /// </summary>
        protected double _minY = double.PositiveInfinity;

        /// <summary>
        /// The maximum X-coordinate
        /// </summary>
        protected double _maxX = double.NegativeInfinity;
        /// <summary>
        /// The minimum X-coordinate
        /// </summary>
        protected double _minX = double.PositiveInfinity;

        /// <summary>
        /// The maximum Z-coordinate
        /// </summary>
        protected double _maxZ = double.NegativeInfinity;
        /// <summary>
        /// The minimum Z-coordinate
        /// </summary>
        protected double _minZ = double.PositiveInfinity;

        /// <summary>
        /// Gets the maximum Y-coordinate.
        /// </summary>
        /// <value>The maximum Y-coordinate.</value>
        public double MaxY { get; protected set; }
        /// <summary>
        /// Gets the minimum Y-coordinate.
        /// </summary>
        /// <value>The minimum Y-coordinate.</value>
        public double MinY { get; protected set; }

        /// <summary>
        /// Gets the maximum X-coordinate.
        /// </summary>
        /// <value>The maximum X-coordinate.</value>
        public double MaxX { get; protected set; }
        /// <summary>
        /// Gets the minimum X-coordinate.
        /// </summary>
        /// <value>The minimum X-coordinate.</value>
        public double MinX { get; protected set; }

        /// <summary>
        /// Gets the maximum Z-coordinate.
        /// </summary>
        /// <value>The maximum Z-coordinate.</value>
        public double MaxZ { get; protected set; }
        /// <summary>
        /// Gets the minimum Z-coordinate.
        /// </summary>
        /// <value>The minimum Z-coordinate.</value>
        public double MinZ { get; protected set; }


        /// <summary>
        /// Initializes a new instance of the <see cref="Extents3D{T, U, TExtents}"/> class.
        /// </summary>
        protected Extents3D()
        {
            initialize();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Extents3D{T, U, TExtents}"/> class.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        protected Extents3D(IEnumerable<T> coordinates)
        {
            initialize();
            Add(coordinates);
        }


        /// <summary>
        /// Initializes a new instance of the <see cref="Extents3D{T, U, TExtents}"/> class.
        /// </summary>
        /// <param name="extents">The extents.</param>
        protected Extents3D(Extents3D<T, U, TExtents> extents)
        {
            initialize();
            Add(extents.Boundary());
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Extents3D{T, U, TExtents}"/> class.
        /// </summary>
        /// <param name="extents">The extents.</param>
        /// <param name="offsetZ">The vertical to project the extents object from.</param>
        protected Extents3D(Extents<U> extents, double offsetZ)
        {
            initialize();
            Add(extents, offsetZ);
        }



        /// <summary>
        /// Initializes this instance.
        /// </summary>
        protected void initialize()
        {
            MaxY = _maxY;
            MinY = _minY;
            MaxX = _maxX;
            MinX = _minX;
            MaxZ = _maxZ;
            MinZ = _minZ;
        }



        /// <summary>
        /// Updates the extents to include the specified coordinate.
        /// </summary>
        /// <param name="coordinate">The coordinate.</param>
        public abstract void Add(T coordinate);

        /// <summary>
        /// Updates the extents to include the specified coordinates.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public void Add(IEnumerable<T> coordinates)
        {
            foreach (T coordinate in coordinates)
            {
                Add(coordinate);
            }
        }

        /// <summary>
        /// Adds the specified extents.
        /// </summary>
        /// <param name="extents">The extents.</param>
        /// <param name="zCoordinate">The z-coordinate of the extents object.</param>
        public abstract void Add(Extents<U> extents, double zCoordinate);

        /// <summary>
        /// Updates the extents to include the specified extents.
        /// </summary>
        /// <param name="extents">The extents.</param>
        public void Add(Extents3D<T, U, TExtents> extents)
        {
            if (extents.MaxY > MaxY)
            {
                MaxY = extents.MaxY;
            }
            if (extents.MinY < MinY)
            {
                MinY = extents.MinY;
            }

            if (extents.MaxX > MaxX)
            {
                MaxX = extents.MaxX;
            }
            if (extents.MinX < MinX)
            {
                MinX = extents.MinX;
            }

            if (extents.MaxZ > MaxZ)
            {
                MaxZ = extents.MaxZ;
            }
            if (extents.MinZ < MinZ)
            {
                MinZ = extents.MinZ;
            }
        }



        /// <summary>
        /// Projects this instance to a 2-dimensional extents object in the X-Y plane.
        /// </summary>
        /// <returns>Extents.</returns>
        public abstract Extents<U> ProjectXY();

        /// <summary>
        /// Projects this instance to a 2-dimensional extents object in the X-Z plane, where the y-coordinate is to be taken as the y-coordinate.
        /// </summary>
        /// <returns>Extents.</returns>
        public abstract Extents<U> ProjectXZ();

        /// <summary>
        /// Projects this instance to a 2-dimensional extents object in the Y-Z plane, where the x-coordinate is to be taken as the z-coordinate.
        /// </summary>
        /// <returns>Extents.</returns>
        public abstract Extents<U> ProjectYZ();



        /// <summary>
        /// Clears this instance.
        /// </summary>
        public void Clear()
        {
            initialize();
        }

        /// <summary>
        /// Resets the specified coordinates.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public void Reset(IEnumerable<T> coordinates)
        {
            Clear();
            Add(coordinates);
        }


        /// <summary>
        /// Determines whether the coordinate lies within the extents.
        /// </summary>
        /// <param name="coordinate">The coordinate.</param>
        /// <returns><c>true</c> if the specified coordinates are within the extents; otherwise, <c>false</c>.</returns>
        public abstract bool IsWithinExtents(CartesianCoordinate3D coordinate);


        /// <summary>
        /// Returns a rectangle boundary of this instance.
        /// </summary>
        /// <returns>NRectangle.</returns>
        public abstract IList<T> Boundary();
    }
}