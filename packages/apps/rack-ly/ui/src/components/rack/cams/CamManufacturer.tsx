import { CamModel } from './CamModel';

export const CamManufacturer = (props) => {
  const manufacturer = props.manufacturer;
  return (
    <div className="product-title-block">
      <div className="product-manufacturer title-shadow">
        {manufacturer.manufacturer}
      </div>
      {
        manufacturer.models.map(model => (
          <CamModel
            key={model._id}
            model={model}
            onCamChange={props.onCamChange}
          />
        ))
      }
    </div>
  );
};