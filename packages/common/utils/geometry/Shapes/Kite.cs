// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-30-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="Kite.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;
using MPT.Math.NumberTypeExtensions;
using System.Collections.Generic;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Represents a kite shape, which is a diamond shape with two different axes of symmetry.
    /// Implements the <see cref="MPT.Geometry.Shapes.Quadrilateral" />
    /// Implements the <see cref="MPT.Geometry.Shapes.IDefinedShape" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Shapes.Quadrilateral" />
    /// <seealso cref="MPT.Geometry.Shapes.IDefinedShape" />
    public class Kite : Quadrilateral, IDefinedShape
    {
        #region Properties
        /// <summary>
        /// The skew of the shape, i.e. the offset of the the top center point from the local y-axis.
        /// </summary>
        /// <value>The skew.</value>
        public virtual double g { get; protected set; }

        /// <summary>
        /// The overall/outside width.
        /// </summary>
        /// <value>The w.</value>
        public double w { get; protected set; }

        /// <summary>
        /// The overall/outside height.
        /// </summary>
        /// <value>The q.</value>
        public double q { get; protected set; }

        /// <summary>
        /// The length of the sloping segments to the left of the center points of the shape.
        /// </summary>
        /// <value>a.</value>
        public double a => 0.5 * (q.Squared() + 4 * g.Squared()).Sqrt();

        /// <summary>
        /// The length of the sloping segments to the right of the center points of the shape.
        /// </summary>
        /// <value>a.</value>
        public virtual double b => 0.5*(q.Squared() + 4*(w - g).Squared()).Sqrt();

        /// <summary>
        /// The height of the center points from the center of the shape.
        /// </summary>
        /// <value>The height.</value>
        public double h => 0.5 * q;

        /// <summary>
        /// The centroid of the shape.
        /// </summary>
        /// <value>The centroid.</value>
        public override CartesianCoordinate Centroid => new CartesianCoordinate(g, h);
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Kite" /> class.
        /// </summary>
        /// <param name="width">The overall width.</param>
        /// <param name="height">The overall height.</param>
        /// <param name="skew">The skew, i.e. offset of the center point from the y-axis.</param>
        public Kite(double width, double height, double skew)
        {
            w = width.Abs();
            q = height.Abs();
            g = skew.Abs();
            SetCoordinates(LocalCoordinates());
        }
        #endregion

        #region Methods
        /// <summary>
        /// Area of the shape.
        /// </summary>
        /// <returns></returns>
        public override double Area()
        {
            return 0.5 * w * q;
        }

        /// <summary>
        /// Formulates the local coordinates for the shape.
        /// </summary>
        /// <returns>IList&lt;CartesianCoordinate&gt;.</returns>
        public IList<CartesianCoordinate> LocalCoordinates()
        {
            return new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(g, 0),
                new CartesianCoordinate(w, 0.5 * q),
                new CartesianCoordinate(g, q),
                new CartesianCoordinate(0, q / 2),
            };
        }
        #endregion
    }
}