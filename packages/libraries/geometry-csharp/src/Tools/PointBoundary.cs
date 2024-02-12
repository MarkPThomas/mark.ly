// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-20-2018
//
// Last Modified By : Mark P Thomas
// Last Modified On : 06-11-2020
// ***********************************************************************
// <copyright file="PointBoundary.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using System.Collections.Generic;
using MPT.Math.Coordinates;

namespace MPT.Geometry.Tools
{
    /// <summary>
    /// Class PointBoundary.
    /// Implements the <see cref="MPT.Geometry.Tools.CoordinatesBoundary{CartesianCoordinate}" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Tools.CoordinatesBoundary{CartesianCoordinate}" />
    public class PointBoundary : CoordinatesBoundary<CartesianCoordinate>
    {
        #region Initialization
        /// <summary>
        /// Represents a boundary defined by CartesianCoordinates.
        /// </summary>
        public PointBoundary()
        {

        }

        /// <summary>
        /// Initializes a new instance of the <see cref="PointBoundary"/> class.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public PointBoundary(CartesianCoordinate[] coordinates) : base(coordinates)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="PointBoundary" /> class.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public PointBoundary(IEnumerable<CartesianCoordinate> coordinates) : base(coordinates)
        {
        }
        #endregion

        #region Methods: Public
        /// <summary>
        /// Gets the extents.
        /// </summary>
        /// <returns>Extents&lt;CartesianCoordinate&gt;.</returns>
        public override Extents<CartesianCoordinate> Extents()
        {
            PointExtents extents = new PointExtents(_contents);
            return extents;
        }
        #endregion

        #region Methods: List
        /// <summary>
        /// Clears this instance.
        /// </summary>
        public override void Clear()
        {
            base.Clear();
        }

        /// <summary>
        /// Adds to boundary.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public override void AddRange(IList<CartesianCoordinate> coordinates)
        {
            foreach (CartesianCoordinate coordinate in coordinates)
            {
                Add(coordinate);
            }
        }

        /// <summary>
        /// Removes from boundary.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public override void RemoveRange(IList<CartesianCoordinate> coordinates)
        {
            foreach (CartesianCoordinate coordinate in coordinates)
            {
                Remove(coordinate);
            }
        }
        #endregion
    }
}