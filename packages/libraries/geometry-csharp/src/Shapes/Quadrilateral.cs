// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-20-2018
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="Quadrilateral.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;
using System.Collections.Generic;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Represents any quadrilateral shape, with the origin at the lower left corner.
    /// A four-sided polygon with four angles.
    /// The five most common types are the parallelogram, the rectangle, the square, the trapezoid, and the rhombus.
    /// </summary>
    public class Quadrilateral : Polygon
    {
        #region Properties
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Quadrilateral" /> class.
        /// </summary>
        protected Quadrilateral()
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="Quadrilateral" /> class.
        /// </summary>
        /// <param name="point1">The point1.</param>
        /// <param name="point2">The point2.</param>
        /// <param name="point3">The point3.</param>
        /// <param name="point4">The point4.</param>
        public Quadrilateral(
            CartesianCoordinate point1,
            CartesianCoordinate point2,
            CartesianCoordinate point3,
            CartesianCoordinate point4) : base(new List<CartesianCoordinate>() { point1, point2, point3, point4 })
        {
        }
        #endregion
    }
}