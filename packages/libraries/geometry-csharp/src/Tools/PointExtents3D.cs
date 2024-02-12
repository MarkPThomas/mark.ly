using System.Collections.Generic;

using NMath = System.Math;

using MPT.Math.Coordinates3D;
using MPT.Math.Coordinates;

namespace MPT.Geometry.Tools
{
    /// <summary>
    /// Class PointExtents3D.
    /// Implements the <see cref="MPT.Geometry.Tools.Extents3D{CartesianCoordinate3D, CartesianCoordinate, PointExtents}" />
    /// </summary>
    /// <seealso cref="MPT.Geometry.Tools.Extents3D{CartesianCoordinate3D, CartesianCoordinate, PointExtents}" />
    public class PointExtents3D : Extents3D<CartesianCoordinate3D, CartesianCoordinate, PointExtents>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="PointExtents3D"/> class.
        /// </summary>

        public PointExtents3D()
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="PointExtents3D"/> class.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public PointExtents3D(IEnumerable<CartesianCoordinate3D> coordinates) : base (coordinates)
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="PointExtents3D"/> class.
        /// </summary>
        /// <param name="extents">The extents.</param>
        public PointExtents3D(PointExtents3D extents) : base (extents)
        { }

        /// <summary>
        /// Initializes a new instance of the <see cref="PointExtents3D"/> class.
        /// </summary>
        /// <param name="extents">The extents.</param>
        /// <param name="zCoordinate">The z coordinate.</param>
        public PointExtents3D(Extents<CartesianCoordinate> extents, double zCoordinate) : base(extents, zCoordinate)
        { }

        /// <summary>
        /// Adds the specified extents.
        /// </summary>
        /// <param name="extents">The extents.</param>
        /// <param name="zCoordinate">The z-coordinate of the extents object.</param>
        public override void Add(Extents<CartesianCoordinate> extents, double zCoordinate)
        {
            List<CartesianCoordinate3D> points = new List<CartesianCoordinate3D>()
                                    {
                                        new CartesianCoordinate3D(extents.MaxX, extents.MaxY, zCoordinate),
                                        new CartesianCoordinate3D(extents.MaxX, extents.MinY, zCoordinate),
                                        new CartesianCoordinate3D(extents.MinX, extents.MinY, zCoordinate),
                                        new CartesianCoordinate3D(extents.MinX, extents.MaxY, zCoordinate),
                                        new CartesianCoordinate3D(extents.MaxX, extents.MaxY, zCoordinate),
                                        new CartesianCoordinate3D(extents.MaxX, extents.MinY, zCoordinate),
                                        new CartesianCoordinate3D(extents.MinX, extents.MinY, zCoordinate),
                                        new CartesianCoordinate3D(extents.MinX, extents.MaxY, zCoordinate),
                                    };
            Add(points);
        }

        /// <summary>
        /// Updates the extents to include the specified coordinate.
        /// </summary>
        /// <param name="coordinate">The coordinate.</param>
        public override void Add(CartesianCoordinate3D coordinate)
        {
            if (coordinate.Y > MaxY)
            {
                MaxY = NMath.Min(coordinate.Y, _minY);
            }
            if (coordinate.Y < MinY)
            {
                MinY = NMath.Max(coordinate.Y, _maxY);
            }

            if (coordinate.X > MaxX)
            {
                MaxX = NMath.Min(coordinate.X, _minX);
            }
            if (coordinate.X < MinX)
            {
                MinX = NMath.Max(coordinate.X, _maxX);
            }

            if (coordinate.Z > MaxZ)
            {
                MaxZ = NMath.Min(coordinate.Z, _minZ);
            }
            if (coordinate.Z < MinZ)
            {
                MinZ = NMath.Max(coordinate.Z, _maxZ);
            }
        }

        /// <summary>
        /// Determines whether the coordinate lies within the extents.
        /// </summary>
        /// <param name="coordinate">The coordinate.</param>
        /// <returns><c>true</c> if the specified coordinates are within the extents; otherwise, <c>false</c>.</returns>
        public override bool IsWithinExtents(CartesianCoordinate3D coordinate)
        {
            return ((MinX <= coordinate.X && coordinate.X <= MaxX) &&
                    (MinY <= coordinate.Y && coordinate.Y <= MaxY) &&
                    (MinZ <= coordinate.Z && coordinate.Z <= MaxZ));
        }

        /// <summary>
        /// Projects this instance to a 2-dimensional extents object in the X-Y plane.
        /// </summary>
        /// <returns>Extents.</returns>
        public override Extents<CartesianCoordinate> ProjectXY()
        {
            PointExtents extents = new PointExtents();
            extents.Add(new CartesianCoordinate(MaxX, MaxY));
            extents.Add(new CartesianCoordinate(MaxX, MinY));
            extents.Add(new CartesianCoordinate(MinX, MinY));
            extents.Add(new CartesianCoordinate(MinX, MaxY));
            return extents;
        }

        /// <summary>
        /// Projects this instance to a 2-dimensional extents object in the X-Z plane, where the y-coordinate is to be taken as the y-coordinate.
        /// </summary>
        /// <returns>Extents.</returns>
        public override Extents<CartesianCoordinate> ProjectXZ()
        {
            PointExtents extents = new PointExtents();
            extents.Add(new CartesianCoordinate(MaxX, MaxZ));
            extents.Add(new CartesianCoordinate(MaxX, MinZ));
            extents.Add(new CartesianCoordinate(MinX, MinZ));
            extents.Add(new CartesianCoordinate(MinX, MaxZ));
            return extents;
        }

        /// <summary>
        /// Projects this instance to a 2-dimensional extents object in the Y-Z plane, where the x-coordinate is to be taken as the z-coordinate.
        /// </summary>
        /// <returns>Extents.</returns>
        public override Extents<CartesianCoordinate> ProjectYZ()
        {
            PointExtents extents = new PointExtents();
            extents.Add(new CartesianCoordinate(MaxZ, MaxY));
            extents.Add(new CartesianCoordinate(MaxZ, MinY));
            extents.Add(new CartesianCoordinate(MinZ, MinY));
            extents.Add(new CartesianCoordinate(MinZ, MaxY));
            return extents;
        }


        /// <summary>
        /// Returns a rectangle boundary of this instance.
        /// </summary>
        /// <returns>NRectangle.</returns>
        public override IList<CartesianCoordinate3D> Boundary()
        {
            return new List<CartesianCoordinate3D>()
            {
                new CartesianCoordinate3D(MinX, MaxY, MinZ),
                new CartesianCoordinate3D(MaxX, MaxY, MinZ),
                new CartesianCoordinate3D(MaxX, MinY, MinZ),
                new CartesianCoordinate3D(MinX, MinY, MinZ),
                new CartesianCoordinate3D(MinX, MaxY, MaxZ),
                new CartesianCoordinate3D(MaxX, MaxY, MaxZ),
                new CartesianCoordinate3D(MaxX, MinY, MaxZ),
                new CartesianCoordinate3D(MinX, MinY, MaxZ),
            };
        }

        /// <summary>
        /// Clones this instance.
        /// </summary>
        /// <returns>Extents.</returns>
        public PointExtents3D Clone()
        {
            return new PointExtents3D(this);
        }
    }
}