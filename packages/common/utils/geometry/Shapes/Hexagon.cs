using MPT.Math;
using Trig = MPT.Math.Trigonometry.TrigonometryLibrary;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    ///  A regular polygon of 6 sides.
    /// </summary>
    public class Hexagon : RegularPolygon
    {
        /// <summary>
        /// The number of sides.
        /// </summary>
        protected static int _setNumberOfSides = 6;

        #region Initialization
        /// <summary>
        /// Initializes a new instance of the <see cref="Hexagon"/> class.
        /// </summary>
        /// <param name="circumRadius">The circumradius.</param>
        public Hexagon(double circumRadius) : base(_setNumberOfSides, circumRadius)
        {

        }

        /// <summary>
        /// Returns a hexagon sized by the inradius.
        /// </summary>
        /// <param name="inRadius">The inradius.</param>
        /// <returns>RegularPolygon.</returns>
        public static Hexagon HexagonByInradius(double inRadius)
        {
            double circumRadius = inRadius * Trig.Sec(Numbers.Pi / _setNumberOfSides);
            return new Hexagon(circumRadius);
        }

        /// <summary>
        /// Returns a hexagon sized by the circumradius.
        /// </summary>
        /// <returns>RegularPolygon.</returns>
        public static Hexagon HexagonByCircumradius(double circumRadius)
        {
            return new Hexagon(circumRadius);
        }
        #endregion
    }
}