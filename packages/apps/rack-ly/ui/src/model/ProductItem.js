class ProductItem {
  constructor(manufacturer, modelName, weight = 0, weightUnit = 'g', quantity = 0) {
    this.manufacturer: manufacturer,
    this.modelName: modelName,
    this.weight: weight,
    this.weightUnit: weightUnit,
    this.quantity: quantity
  }

  isEqual(product) {
    return (this.manufacturer === product.manufacturer
      && this.modelName === product.modelName);
  }
}

export default ProductItem;