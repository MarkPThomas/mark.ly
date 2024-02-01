// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 07-01-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="ICircumCircle.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// A circle that passes through all vertices of a plane figure and contains the entire figure in its interior.
    /// All triangles have circumcircles and so do all regular polygons. Most other polygons do not.
    /// </summary>
    public interface ICircumCircle
    {
        ///// <summary>
        ///// A circle that passes through all vertices of a plane figure and contains the entire figure in its interior.
        ///// All triangles have circumcircles and so do all regular polygons. Most other polygons do not.
        ///// </summary>
        //double Circumcircle { get; }

        /// <summary>
        /// Gets the circumradius, which is the radius of a circle whose edges are defined by the defining points of the shape.
        /// </summary>
        /// <value>The circumradius.</value>
        double CircumRadius { get; }

        /// <summary>
        /// Gets the circumcenter, which describes the center of a circle whose edges are defined by the defining points of the shape.
        /// </summary>
        /// <value>The in center.</value>
        CartesianCoordinate CircumCenter { get; }
    }
}