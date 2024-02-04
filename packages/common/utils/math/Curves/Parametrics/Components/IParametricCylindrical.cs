/// <summary>
    /// Represents a parametric equation in cylindrical coordinates.
    /// </summary>
    public interface IParametricCylindrical
    {
        /// <summary>
        /// The radial length, ρ, at position s, which is the Euclidean distance from the z-axis to the point P.
        /// </summary>
        /// <value>The radius.</value>
        ParametricEquation<double> Radius { get; }

        /// <summary>
        /// Heights the specified s.
        /// </summary>
        /// <value>The height.</value>
        ParametricEquation<double> Height { get; }

        /// <summary>
        /// The azimuth angle, φ, at position s, which lies in the x-y plane sweeping out from the X-axis.
        /// </summary>
        /// <value>The azimuth.</value>
        ParametricEquation<Angle> Azimuth { get; }
    }