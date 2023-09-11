import { Generics } from './generics'; // Import the Generics class from your TypeScript implementation

describe('GenericsTests', () => {
  // Define the ITolerance interface
  interface ITolerance {
    Tolerance: number;
  }

  // Define the Comparables class
  class Comparables implements IComparable<Comparables> {
    Number: number;

    constructor(number: number) {
      this.Number = number;
    }

    compareTo(other: Comparables): number {
      if (this.Number > other.Number) {
        return 1;
      }
      if (this.Number < other.Number) {
        return -1;
      }
      return 0;
    }
  }

  // Define the ObjectWithTolerance class
  class ObjectWithTolerance implements ITolerance {
    Tolerance: number;
  }

  // Define the AnotherObjectWithTolerance class
  class AnotherObjectWithTolerance implements ITolerance {
    Tolerance: number;
  }

  it('should get tolerance of a single object', () => {
    const tolerance = 0.1;
    const item1 = new ObjectWithTolerance();
    item1.Tolerance = tolerance;

    expect(Generics.getTolerance(item1)).toBe(tolerance);
  });

  it('should get tolerance between a single object and specified governing tolerance', () => {
    const tolerance = 0.0001;
    const item1 = new ObjectWithTolerance();
    item1.Tolerance = tolerance;
    const governingTolerance = 0.1;

    expect(Generics.getTolerance(item1, governingTolerance)).toBe(governingTolerance);
  });

  it('should get tolerance between two objects of the same type', () => {
    const tolerance1 = 0.1;
    const item1 = new ObjectWithTolerance();
    item1.Tolerance = tolerance1;
    const tolerance2 = 0.2;
    const item2 = new ObjectWithTolerance();
    item2.Tolerance = tolerance2;

    expect(Generics.getTolerance(item1, item2)).toBe(tolerance2);
  });

  it('should get tolerance between two objects of different types', () => {
    const tolerance1 = 0.1;
    const item1 = new ObjectWithTolerance();
    item1.Tolerance = tolerance1;
    const tolerance2 = 0.2;
    const item2 = new AnotherObjectWithTolerance();
    item2.Tolerance = tolerance2;

    expect(Generics.getTolerance(item1, item2)).toBe(tolerance2);
  });

  it('should get tolerance between two objects of different types and specified governing tolerance', () => {
    const tolerance1 = 0.01;
    const item1 = new ObjectWithTolerance();
    item1.Tolerance = tolerance1;
    const tolerance2 = 0.02;
    const item2 = new AnotherObjectWithTolerance();
    item2.Tolerance = tolerance2;
    const governingTolerance = 0.1;

    expect(Generics.getTolerance(item1, item2, governingTolerance)).toBe(governingTolerance);
  });

  it.each([
    [2, 1, 3, true],
    [1, 1, 3, true],
    [1, 3, 1, true],
    [0.999, 1, 3, false],
    [0.999, 3, 1, false],
    [3, 1, 3, true],
    [3, 3, 1, true],
    [3.001, 1, 3, false],
    [3.001, 3, 1, false],
  ])('should check if %f is within inclusive range of %f and %f', (value, value1, value2, expected) => {
    const comparablesValue1 = new Comparables(value1);
    const comparablesValue = new Comparables(value);
    const comparablesValue2 = new Comparables(value2);

    expect(Generics.isWithinInclusive(comparablesValue, comparablesValue1, comparablesValue2)).toBe(expected);
  });

  it.each([
    [2, 1, 3, true],
    [1, 1, 3, false],
    [1, 3, 1, false],
    [0.999, 1, 3, false],
    [0.999, 3, 1, false],
    [3, 1, 3, false],
    [3, 3, 1, false],
    [3.001, 1, 3, false],
    [3.001, 3, 1, false],
  ])('should check if %f is within exclusive range of %f and %f', (value, value1, value2, expected) => {
    const comparablesValue1 = new Comparables(value1);
    const comparablesValue = new Comparables(value);
    const comparablesValue2 = new Comparables(value2);

    expect(Generics.isWithinExclusive(comparablesValue, comparablesValue1, comparablesValue2)).toBe(expected);
  });

  it('should throw exception if argument is null for max function', () => {
    expect(() => Generics.max<Comparables>(null)).toThrowError(ArgumentException);
  });

  it('should throw exception if array is not dimensioned for max function', () => {
    const comparables = new Array<Comparables>();

    expect(() => Generics.max(comparables)).toThrowError(ArgumentException);
  });

  it('should return max object of comparable objects', () => {
    const comparables = new Array<Comparables>();
    comparables.push(new Comparables(6));
    comparables.push(new Comparables(-1));
    comparables.push(new Comparables(9));

    const maxComparables = Generics.max(comparables);

    expect(maxComparables).toEqual(comparables[2]);
  });

  it('should throw exception if argument is null for min function', () => {
    expect(() => Generics.min<Comparables>(null)).toThrowError(ArgumentException);
  });

  it('should throw exception if array is not dimensioned for min function', () => {
    const comparables = new Array<Comparables>();

    expect(() => Generics.min(comparables)).toThrowError(ArgumentException);
  });

  it('should return min object of comparable objects', () => {
    const comparables = new Array<Comparables>();
    comparables.push(new Comparables(6));
    comparables.push(new Comparables(-1));
    comparables.push(new Comparables(9));

    const minComparables = Generics.min(comparables);

    expect(minComparables).toEqual(comparables[1]);
  });
});
