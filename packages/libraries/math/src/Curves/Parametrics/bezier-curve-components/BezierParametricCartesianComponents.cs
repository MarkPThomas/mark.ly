// ***********************************************************************
// Assembly         : MPT.Math
// Author           : Mark P Thomas
// Created          : 11-21-2020
//
// Last Modified By : Mark P Thomas
// Last Modified On : 11-21-2020
// ***********************************************************************
// <copyright file="BezierParametricBase.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math.Coordinates;
using MPT.Math.Curves.Parametrics.Components.Types;

namespace MPT.Math.Curves.Parametrics.BezierCurveComponents
{
    /// <summary>
    /// Class containing the assigned components of a parametric equation in <see cref="CartesianCoordinate"/> coordinates and the corresponding bezier curve object.
    /// This class has the basic components of differentiating and accessing the different parametric equations.
    /// Also contains operators to implement scaling of the parametric equations.
    /// Implements the <see cref="MPT.Math.Curves.Parametrics.Components.Types.DoubleParametricComponents" />
    /// </summary>
    /// <seealso cref="MPT.Math.Curves.Parametrics.Components.Types.DoubleParametricComponents" />
    internal abstract class BezierParametricCartesianComponents : CartesianParametricComponents
    {
        /// <summary>
        /// Gets the parent object whose properties are used in the associated parametric equations.
        /// </summary>
        /// <value>The parent.</value>
        protected BezierCurve _parent => _parentCurve as BezierCurve;

        /// <summary>
        /// Initializes a new instance of the <see cref="BezierParametricCartesianComponents" /> class.
        /// </summary>
        /// <param name="parent">The parent.</param>
        public BezierParametricCartesianComponents(BezierCurve parent) : base(parent) { }
    }
}