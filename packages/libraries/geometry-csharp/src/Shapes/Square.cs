// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-20-2018
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="Square.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;
using MPT.Math.NumberTypeExtensions;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Represents a square shape, with the origin at the lower left corner.
    /// </summary>
    public class Square : Rectangle, IIncircle
    {
        #region Properties
        /// <summary>
        /// The height.
        /// </summary>
        /// <value>The height.</value>
        public override double h => b_t;

        /// <summary>
        /// Gets the inradius, r, which describes a circle whose edge is tangent to all 4 sides of the shape.
        /// </summary>
        /// <value>The in radius.</value>
        public double InRadius => b_t / 2;

        /// <summary>
        /// Gets the incenter, which describes the center of a circle whose edge is tangent to all 4 sides of the shape.
        /// </summary>
        /// <value>The in center.</value>
        public CartesianCoordinate InCenter => Centroid;

        /// <summary>
        /// Gets the circumcenter radius, R, which describes a circle whose edges are defined by the 4 defining points of the shape.
        /// </summary>
        /// <value>The in radius.</value>
        public override double CircumRadius => b_t / 2.Sqrt();
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Square" /> class.
        /// </summary>
        /// <param name="width">The width.</param>
        public Square(double width) : base(width, width)
        {

        }
        #endregion
    }
}