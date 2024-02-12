/// <summary>
    /// Represents a parametric equation in 3D cartesian coordinates.
    /// </summary>
    public interface IParametricCartesianXYZ<T> : IParametricCartesianXY<T> where T : ParametricEquation<double>
    {
        /// <summary>
        /// The z-component, at position s.
        /// </summary>
        /// <value>The zcomponent.</value>
        T Zcomponent { get; }
    }