// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark Thomas
// Created          : 12-09-2017
//
// Last Modified By : Mark Thomas
// Last Modified On : 12-09-2017
// ***********************************************************************
// <copyright file="Boundary.cs" company="MPTinc">
//     Copyright ©  2017
// </copyright>
// <summary></summary>
// ***********************************************************************
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

using MPT.Math;
using GL = MPT.Geometry.GeometryLibrary;

namespace MPT.Geometry.Tools
{
    /// <summary>
    /// Represents boundary coordinates.
    /// </summary>
    public class Boundary
    {
        #region Properties
        /// <summary>
        /// Tolerance to use in all calculations with double types.
        /// </summary>
        /// <value>The tolerance.</value>
        public double Tolerance { get; set; } = GL.ZeroTolerance;

        /// <summary>
        /// The coordinates.
        /// </summary>
        private IEnumerable<Point> _coordinates;
        /// <summary>
        /// The coordinates that compose the boundary.
        /// </summary>
        /// <value>The boundary.</value>
        public IList<Point> Coordinates => new ReadOnlyCollection<Point>(_coordinates.ToList());
        #endregion

        #region Initialization

        /// <summary>
        /// Initializes a new instance of the <see cref="Boundary"/> class.
        /// </summary>
        public Boundary()
        {

        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Boundary"/> class.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public Boundary(IEnumerable<Point> coordinates)
        {
            _coordinates = coordinates;
        }
        #endregion

        #region Methods: Public

        // TODO: For all boundary changes, clusters and holes occur when a shape is entirely outside of or inside of the shape group.
        // This is to be handled by linking the shape areas by a collinear segment.
        // All positive shapes are determined by CCW travel.
        // All negative shapes are determined by CW travel.

        // TODO: Finish
        /// <summary>
        /// Adds to boundary.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        /// <exception cref="System.NotImplementedException"></exception>
        public void Add(IList<Point> coordinates)
        {
            throw new NotImplementedException();
        }

        // TODO: Finish
        /// <summary>
        /// Removes from boundary.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        /// <exception cref="System.NotImplementedException"></exception>
        public void Remove(IList<Point> coordinates)
        {
            throw new NotImplementedException();
        }
        #endregion

        #region Methods: Private

        #endregion
    }
}