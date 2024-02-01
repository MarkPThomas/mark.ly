// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 06-20-2018
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="Trapezoid.cs" company="Mark P Thomas, Inc.">
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
    /// Represents a trapezoidal shape, with the origin at the lower left corner.
    /// </summary>
    public class Trapezoid : Quadrilateral, IDefinedShape
    {
        #region Properties
        /// <summary>
        /// The top width.
        /// </summary>
        /// <value>The width top.</value>
        public double b_t { get; protected set; }

        /// <summary>
        /// The bottom width.
        /// </summary>
        /// <value>The width bottom.</value>
        public virtual double b_b { get; protected set; }

        /// <summary>
        /// The height.
        /// </summary>
        /// <value>The height.</value>
        public virtual double h { get; protected set; }

        /// <summary>
        /// The skew of the shape, i.e. the offset of the left side of the top segment from the local y-axis.
        /// </summary>
        /// <value>The skew.</value>
        public virtual double g { get; protected set; }
        #endregion

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Trapezoid" /> class.
        /// </summary>
        /// <param name="height">The height.</param>
        /// <param name="topWidth">Width of the top.</param>
        /// <param name="bottomWidth">Width of the bottom.</param>
        /// <param name="skew">The skew offset of the top segment.</param>
        public Trapezoid(double height, double topWidth, double bottomWidth, double skew)
        {
            h = height.Abs();
            b_t = topWidth.Abs();
            b_b = bottomWidth.Abs();
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
            return 0.5 * h * (b_b + b_t);
        }


        /// <summary>
        /// The x centroid in local coordinatesfor the shape.
        /// </summary>
        /// <returns>System.Double.</returns>
        public override double Xo()
        {
            return (2 * b_t * g + b_t.Squared() + b_b * g + b_b.Squared() + b_b * b_t)/(3 * (b_b + b_t));
        }

        /// <summary>
        /// The y centroid in local coordinatesfor the shape.
        /// </summary>
        /// <returns>System.Double.</returns>
        public override double Yo()
        {
            return h * (2 * b_t + b_b) / (3 * (b_b + b_t));
        }

        /// <summary>
        /// Formulates the local coordinates for the shape.
        /// </summary>
        /// <returns>IList&lt;CartesianCoordinate&gt;.</returns>
        public IList<CartesianCoordinate> LocalCoordinates()
        {
            return new List<CartesianCoordinate>()
            {
                new CartesianCoordinate(0, 0),
                new CartesianCoordinate(b_b, 0),
                new CartesianCoordinate(b_t + g, h),
                new CartesianCoordinate(g, h),
            };
        }
        #endregion
    }
}