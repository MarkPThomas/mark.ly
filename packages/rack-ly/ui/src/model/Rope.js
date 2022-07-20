import ProductItem from './ProductItem';

class Rope extends ProductItem {
  constructor(data, quantity = 0) {
    super(
      data.manufacturer,
      data.modelName,
      data.weight,
      data.weightUnit,
      quantity)

    this.type: data.type,
    this.dryTreated: data.dryTreated,
    this.diameter: data.diameter,
    this.diameterUnit: data.diameterUnit,
    this.length: data.length,
    this.lengthUnit: data.lengthUnit
  }

  isEqual(rope) {
    return (super.isEqual(rope) && this.length === rope.length);
  }
}

export default Rope;