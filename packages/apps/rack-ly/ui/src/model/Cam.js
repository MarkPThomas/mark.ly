import ProductItem from './ProductItem';

class Cam extends ProductItem {
  constructor(data, quantity = 0) {
    super(
      data.manufacturer,
      data.modelName,
      data.weight,
      data.weightUnit,
      quantity)

    this.lineName: data.lineName,
    this.size: data.size,
    this.color: data.color,
    this.minRange: data.minRange,
    this.minRangeUnit: data.minRangeUnit,
    this.maxRange: data.maxRange,
    this.maxRangeUnit: data.maxRangeUnit
  }

  isEqual(cam) {
    return (super.isEqual(rope) && this.lineName === cam.lineName && this.size === cam.size);
  }
}

export default Cam;