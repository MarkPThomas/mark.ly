// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 07-01-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 07-01-2020
// ***********************************************************************
// <copyright file="IDefinedShape.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;
using System.Collections.Generic;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Interface for shapes of a pre-defined type that provides constraints on the more general shape geometry.
    /// </summary>
    public interface IDefinedShape
    {
        /// <summary>
        /// Formulates the local coordinates for the shape.
        /// </summary>
        /// <returns>IList&lt;CartesianCoordinate&gt;.</returns>
        IList<CartesianCoordinate> LocalCoordinates();
    }
}