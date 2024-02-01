using MPT.Math;
using MPT.Math.Coordinates;

namespace MPT.Geometry.Shapes
{
    /// <summary>
    /// Interface for all paths that create a closed shape.
    /// </summary>
    public interface IShapeProperties : ITolerance
    {
        /// <summary>
        /// Length of all sides of the shape.
        /// </summary>
        /// <returns></returns>
        double Perimeter();

        /// <summary>
        /// Area of the shape.
        /// </summary>
        /// <returns></returns>
        double Area();

        /// <summary>
        /// X-coordinate of the centroid of the shape.
        /// </summary>
        /// <returns></returns>
        double Xo();

        /// <summary>
        /// Y-coordinate of the centroid of the shape.
        /// </summary>
        /// <returns></returns>
        double Yo();
    }
}