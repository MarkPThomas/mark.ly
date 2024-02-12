using MPT.Math.Coordinates3D;

namespace MPT.Geometry.Segments
{
    /// <summary>
    /// Interface for any segment along a path in space.
    /// </summary>
    public interface IPathSegment3D
    {
        /// <summary>
        /// First coordinate value.
        /// </summary>
        CartesianCoordinate3D I { get; set; }

        /// <summary>
        /// Second coordinate value.
        /// </summary>
        CartesianCoordinate3D J { get; set; }
    }
}