// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-30-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="Rhombus.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;
using MPT.Math.NumberTypeExtensions;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Represents a rhombus shape, which is a doubly-symmetric diamond.
    /// Implements the <see cref="MPT.Geometry.Shapes.Kite" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Shapes.Kite" />
    public class Rhombus : Kite
    {
        #region Properties
        /// <summary>
        /// The skew of the shape, i.e. the offset of the the top center point from the local y-axis.
        /// </summary>
        /// <value>The skew.</value>
        public override double g => 0.5 * w;

        /// <summary>
        /// The length of the sloping segments to the right of the center points of the shape.
        /// </summary>
        /// <value>a.</value>
        public override double b => a;

        /// <summary>
        /// Gets the inradius, r, which describes a circle whose edge is tangent to all 4 sides of the shape.
        /// </summary>
        /// <value>The in radius.</value>
        public double InRadius => w * q / (2*(w.Squared() + q.Squared()).Sqrt());

        /// <summary>
        /// Gets the incenter, which describes the center of a circle whose edge is tangent to all 4 sides of the shape.
        /// </summary>
        /// <value>The in center.</value>
        public CartesianCoordinate InCenter => Centroid;
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Rhombus" /> class.
        /// </summary>
        /// <param name="width">The overall width.</param>
        /// <param name="height">The overall height.</param>
        public Rhombus(double width, double height) : base(width, height, 0.5 * width)
        {

        }
        #endregion
    }
}