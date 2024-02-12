// ***********************************************************************
// Assembly         : MPT.Geometry
// Author           : Mark P Thomas
// Created          : 12-09-2017
//
// Last Modified By : Mark P Thomas
// Last Modified On : 06-11-2020
// ***********************************************************************
// <copyright file="CoordinatesBoundary.cs" company="Mark P Thomas, Inc.">
//     Copyright (c) 2020. All rights reserved.
// </copyright>
// <summary></summary>
// ***********************************************************************
using MPT.Math;
using MPT.Math.Coordinates;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using GL = MPT.Geometry.GeometryLibrary;
using NMath = System.Math;

namespace MPT.Geometry.Tools
{
    /// <summary>
    /// Represents boundary coordinates.
    /// </summary>
    /// <typeparam name="T">The type of coordinate.</typeparam>
    public abstract class CoordinatesBoundary<T> : ITolerance, IList<T>
        where T : ICoordinate
    {
        #region Properties
        /// <summary>
        /// The tolerance
        /// </summary>
        protected double _tolerance = GL.ZeroTolerance;
        /// <summary>
        /// Tolerance to use in all calculations with double types.
        /// </summary>
        public double Tolerance
        {
            get { return _tolerance; }
            set
            {
                _tolerance = value;
                foreach (T coordinate in _contents)
                {
                    coordinate.Tolerance = _tolerance;
                }
            }
        }

        /// <summary>
        /// The contents
        /// </summary>
        protected T[] _contents = new T[_minArraySize];

        /// <summary>
        /// Gets the number of elements contained in the <see cref="T:System.Collections.Generic.ICollection`1"></see>.
        /// </summary>
        /// <value>The count.</value>
        public int Count { get; protected set; }

        /// <summary>
        /// Gets a value indicating whether the <see cref="T:System.Collections.Generic.ICollection`1"></see> is read-only.
        /// </summary>
        /// <value><c>true</c> if this instance is read only; otherwise, <c>false</c>.</value>
        public bool IsReadOnly => true;

        /// <summary>
        /// Gets or sets the <see cref="_contents" /> at the specified index.
        /// </summary>
        /// <param name="index">The index.</param>
        /// <returns>T.</returns>
        public T this[int index]
        {
            get
            {
                if (index >= Count)
                {
                    throw new IndexOutOfRangeException();
                }
                return _contents[index];
            }
            set
            {
                throw new ReadOnlyException();
            }
        }
        #endregion

        #region Initialization

        /// <summary>
        /// Initializes a new instance of the <see cref="CoordinatesBoundary{T}" /> class.
        /// </summary>
        protected CoordinatesBoundary()
        {
            Count = 0;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CoordinatesBoundary{T}"/> class.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        protected CoordinatesBoundary(T[] coordinates)
        {
            Count = coordinates.Length;
            _contents = new T[Count];
            for (int i = 0; i < Count; i++)
            {
                _contents[i] = coordinates[i];
            }
            Tolerance = _tolerance;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CoordinatesBoundary{T}" /> class.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        protected CoordinatesBoundary(IEnumerable<T> coordinates)
        {
            Count = coordinates.Count();
            _contents = new T[Count];
            int i = 0;
            foreach (T coordinate in coordinates)
            {
                _contents[i] = coordinate;
                i++;
            }
            Tolerance = _tolerance;
        }
        #endregion

        #region Methods: List
        /// <summary>
        /// Clears this instance.
        /// </summary>
        public virtual void Clear()
        {
            _contents = new T[_minArraySize];
            Count = 0;
        }

        /// <summary>
        /// Resets the specified coordinates.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public void Reset(IList<T> coordinates)
        {
            Clear();
            AddRange(coordinates);
        }


        /// <summary>
        /// Adds an item to the <see cref="T:System.Collections.Generic.ICollection`1"></see>.
        /// </summary>
        /// <param name="item">The object to add to the <see cref="T:System.Collections.Generic.ICollection`1"></see>.</param>
        public virtual void Add(T item)
        {
            resizeArraySizeIfNecessary();
            if (Count < _contents.Length)
            {
                _contents[Count] = item;
                Count++;
            }
        }

        /// <summary>
        /// Adds to boundary.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public abstract void AddRange(IList<T> coordinates);


        /// <summary>
        /// Removes the first occurrence of a specific object from the <see cref="T:System.Collections.Generic.ICollection`1"></see>.
        /// </summary>
        /// <param name="item">The object to remove from the <see cref="T:System.Collections.Generic.ICollection`1"></see>.</param>
        /// <returns>true if <paramref name="item">item</paramref> was successfully removed from the <see cref="T:System.Collections.Generic.ICollection`1"></see>; otherwise, false.
        /// This method also returns false if <paramref name="item">item</paramref> is not found in the original <see cref="T:System.Collections.Generic.ICollection`1"></see>.</returns>
        public virtual bool Remove(T item)
        {
            if (!Contains(item))
            {
                return false;
            }
            int lastCount = Count;
            RemoveAt(IndexOf(item));
            return (Count < lastCount);
        }

        /// <summary>
        /// Removes from boundary.
        /// </summary>
        /// <param name="coordinates">The coordinates.</param>
        public abstract void RemoveRange(IList<T> coordinates);


        /// <summary>
        /// Removes the <see cref="T:System.Collections.Generic.IList`1"></see> item at the specified index.
        /// </summary>
        /// <param name="index">The zero-based index of the item to remove.</param>
        public virtual void RemoveAt(int index)
        {
            if ((index >= 0) && (index < Count))
            {
                for (int i = index; i < Count - 1; i++)
                {
                    _contents[i] = _contents[i + 1];
                }
                Count--;
            }
            else
            {
                throw new IndexOutOfRangeException();
            }
            reduceArraySizeIfNecessary();
        }


        /// <summary>
        /// Inserts an item to the <see cref="T:System.Collections.Generic.IList`1"></see> at the specified index.
        /// </summary>
        /// <param name="index">The zero-based index at which item should be inserted.</param>
        /// <param name="item">The object to insert into the <see cref="T:System.Collections.Generic.IList`1"></see>.</param>
        public virtual void Insert(int index, T item)
        {
            if ((index < Count) && (index >= 0))
            {
                resizeArraySizeIfNecessary();
                Count++;

                for (int i = Count - 1; i > index; i--)
                {
                    _contents[i] = _contents[i - 1];
                }
                _contents[index] = item;
            }
            else
            {
                throw new IndexOutOfRangeException();
            }
        }

        /// <summary>
        /// Inserts the range.
        /// </summary>
        /// <param name="index">The index.</param>
        /// <param name="items">The items.</param>
        public virtual void InsertRange(int index, IList<T> items)
        {
            for (int i = 0; i < items.Count; i++)
            {
                Insert(index, items[i]);
                index++;
            }
        }

        /// <summary>
        /// Replaces the specified original item.
        /// </summary>
        /// <param name="originalItem">The original item.</param>
        /// <param name="newItem">The new item.</param>
        public void Replace(T originalItem, T newItem)
        {
            int index = IndexOf(originalItem);
            if (index > -1)
            {
                ReplaceAt(index, newItem);
            }
        }
        /// <summary>
        /// Replaces at.
        /// </summary>
        /// <param name="index">The index.</param>
        /// <param name="item">The item.</param>
        public void ReplaceAt(int index, T item)
        {
            _contents[index] = item;
        }

        /// <summary>
        /// Determines the index of a specific item in the <see cref="T:System.Collections.Generic.IList`1"></see>.
        /// </summary>
        /// <param name="item">The object to locate in the <see cref="T:System.Collections.Generic.IList`1"></see>.</param>
        /// <returns>The index of <paramref name="item">item</paramref> if found in the list; otherwise, -1.</returns>
        public virtual int IndexOf(T item)
        {
            for (int i = 0; i < Count; i++)
            {
                if (_contents[i].Equals(item))
                {
                    return i;
                }
            }
            return -1;
        }


        /// <summary>
        /// Determines whether the <see cref="T:System.Collections.Generic.ICollection`1"></see> contains a specific value.
        /// </summary>
        /// <param name="item">The object to locate in the <see cref="T:System.Collections.Generic.ICollection`1"></see>.</param>
        /// <returns>true if <paramref name="item">item</paramref> is found in the <see cref="T:System.Collections.Generic.ICollection`1"></see>; otherwise, false.</returns>
        public virtual bool Contains(T item)
        {
            for (int i = 0; i < Count; i++)
            {
                if (_contents[i].Equals(item))
                {
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// Copies the elements of the <see cref="T:System.Collections.Generic.ICollection`1"></see> to an <see cref="T:System.Array"></see>, starting at a particular <see cref="T:System.Array"></see> index.
        /// </summary>
        /// <param name="array">The one-dimensional <see cref="T:System.Array"></see> that is the destination of the elements copied from <see cref="T:System.Collections.Generic.ICollection`1"></see>.
        /// The <see cref="T:System.Array"></see> must have zero-based indexing.</param>
        /// <param name="arrayIndex">The zero-based index in array at which copying begins.</param>
        public virtual void CopyTo(T[] array, int arrayIndex)
        {
            for (int i = 0; i < Count; i++)
            {
                array.SetValue(_contents[i], arrayIndex++);
            }
        }

        #endregion

        #region Methods: Public
        /// <summary>
        /// Gets the extents.
        /// </summary>
        /// <returns>Extents&lt;T&gt;.</returns>
        public abstract Extents<T> Extents();


        /// <summary>
        /// Returns the first point of the boundary.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public T FirstCoordinate()
        {
            return _contents[0];
        }

        /// <summary>
        /// Returns the last point of the boundary.
        /// </summary>
        /// <returns>CartesianCoordinate.</returns>
        public T LastCoordinate()
        {
            return _contents[Count - 1];
        }
        #endregion

        #region Array
        /// <summary>
        /// The array resize ratio
        /// </summary>
        protected static int _arrayResizeRatio = 2;
        /// <summary>
        /// The minimum array size
        /// </summary>
        protected static int _minArraySize = 8;
        /// <summary>
        /// Resizes the array size if necessary.
        /// </summary>
        protected void resizeArraySizeIfNecessary()
        {
            if (Count == _contents.Length)
            {
                int newLength = _arrayResizeRatio * Count;
                resizeArray(newLength);
            }
        }
        /// <summary>
        /// Reduces the array size if necessary.
        /// </summary>
        protected void reduceArraySizeIfNecessary()
        {
            int newLength = NMath.Max((int)NMath.Round(_contents.Length / (double)_arrayResizeRatio), _minArraySize);
            if (Count < newLength)
            {
                resizeArray(newLength);
            }
        }
        /// <summary>
        /// Resizes the array.
        /// </summary>
        /// <param name="newSize">The new size.</param>
        protected void resizeArray(int newSize)
        {
            Array.Resize(ref _contents, newSize);
        }
        #endregion

        #region Enumerator
        /// <summary>
        /// Returns an enumerator that iterates through the collection.
        /// </summary>
        /// <returns>An enumerator that can be used to iterate through the collection.</returns>
        public IEnumerator<T> GetEnumerator()
        {
            T[] coordinates = new T[Count];
            for (int i = 0; i < Count; i++)
            {
                coordinates[i] = _contents[i];
            }
            return new CoordinatesEnumerator<T>(coordinates);
        }

        // ncrunch: no coverage start
        /// <summary>
        /// Returns an enumerator that iterates through a collection.
        /// </summary>
        /// <returns>An <see cref="System.Collections.IEnumerator"></see> object that can be used to iterate through the collection.</returns>
        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
        // ncrunch: no coverage end

        /// <summary>
        /// Class CoordinatesEnumerator.
        /// Implements the <see cref="System.Collections.Generic.IEnumerator{T}" />
        /// </summary>
        /// <typeparam name="U"></typeparam>
        /// <seealso cref="System.Collections.Generic.IEnumerator{U}" />
        internal class CoordinatesEnumerator<U> : IEnumerator<U>
            where U : T
        {
            /// <summary>
            /// The position
            /// </summary>
            private int _position = -1;

            /// <summary>
            /// The contents
            /// </summary>
            public U[] _contents;
            /// <summary>
            /// Gets the element in the collection at the current position of the enumerator.
            /// </summary>
            /// <value>The current.</value>
            object IEnumerator.Current => Current;

            /// <summary>
            /// Gets the element in the collection at the current position of the enumerator.
            /// </summary>
            /// <value>The current.</value>
            /// <exception cref="InvalidOperationException"></exception>
            public U Current
            {
                get
                {
                    try
                    {
                        return _contents[_position];
                    }
                    catch (IndexOutOfRangeException)
                    {
                        throw new InvalidOperationException();
                    }
                }
            }


            /// <summary>
            /// Initializes a new instance of the <see cref="U:CoordinatesEnumerator`1"/> class.
            /// </summary>
            /// <param name="list">The list.</param>
            public CoordinatesEnumerator(U[] list)
            {
                _contents = list;
            }

            /// <summary>
            /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
            /// </summary>
            public void Dispose()
            {
                // No code needed
            }

            /// <summary>
            /// Advances the enumerator to the next element of the collection.
            /// </summary>
            /// <returns>true if the enumerator was successfully advanced to the next element; false if the enumerator has passed the end of the collection.</returns>
            public bool MoveNext()
            {
                _position++;
                return (_position < _contents.Length);
            }

            /// <summary>
            /// Sets the enumerator to its initial position, which is before the first element in the collection.
            /// </summary>
            public void Reset()
            {
                _position = -1;
            }
        }
        #endregion
    }
}