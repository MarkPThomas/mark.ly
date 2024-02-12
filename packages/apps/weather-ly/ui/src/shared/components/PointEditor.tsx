import { useState } from "react";
import { IPointResponse } from "../../../../server/api/model";

type props = {
  clickHandler: (point: IPointResponse) => void;
}

type validationMessage = {
  name?: string,
  latitude?: string,
  longitude?: string
}

export const PointEditor = (props: props) => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [validationMessage, setValidationMessage] = useState({} as validationMessage);

  const isValidated = () => {
    return Object.keys(validationMessage).length === 0
      && name && latitude && longitude;
  }

  const isEmpty = () => {
    return !name && !latitude && !longitude;
  }

  // Validators upon leaving fields or submitting

  const isValidName = (name: string) => {
    return (true
      // name
      // && name.length > 0
      // && check that name is unique in list - server-side?
    );
  }

  // TODO: Extract to middleware?
  const isValidLatitude = (latitude: string) => {
    const latitudeNumber = Number(latitude);
    return latitudeNumber && -90 <= latitudeNumber && latitudeNumber <= 90;
  }

  // TODO: Extract to middleware?
  const isValidLongitude = (longitude: string) => {
    const longitudeNumber = Number(longitude);
    return longitudeNumber && -180 <= longitudeNumber && longitudeNumber <= 180;
  }


  const validateName = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const value = event.currentTarget.value;
    if (isValidName(value)) {
      setName(value);
      const newValidationMessage = { ...validationMessage };
      delete newValidationMessage.name;
      setValidationMessage(newValidationMessage);
    } else {
      const newValidationMessage = {
        ...validationMessage,
        name: 'Invalid name!'
      };
      setValidationMessage(newValidationMessage);
    }
  }

  const validateLatitude = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const value = event.currentTarget.value;
    if (isValidLatitude(value)) {
      setLatitude(value);
      const newValidationMessage = { ...validationMessage };
      delete newValidationMessage.latitude;
      setValidationMessage(newValidationMessage);
    } else if (value) {
      const newValidationMessage = {
        ...validationMessage,
        latitude: 'Invalid latitude!'
      };
      setValidationMessage(newValidationMessage);
    }
  }

  const validateLongitude = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const value = event.currentTarget.value;
    if (isValidLongitude(value)) {
      setLongitude(value);
      const newValidationMessage = { ...validationMessage };
      delete newValidationMessage.longitude;
      setValidationMessage(newValidationMessage);
    } else if (value) {
      const newValidationMessage = {
        ...validationMessage,
        longitude: 'Invalid longitude!'
      };
      setValidationMessage(newValidationMessage);
    }
  }

  const handleClick = () => {
    if (isValidated()) {
      props.clickHandler(
        {
          name,
          latitude: Number(latitude),
          longitude: Number(longitude),
          pointId: '',
          gridId: ''
        }
      );
    }
  }

  return (
    <div>
      {
        !isValidated() &&
        <div className="pt-editor-error-group">
          {Object.keys(validationMessage).map(key =>
            <div className="pt-editor-error">{validationMessage[key]}</div>
          )}
        </div>
      }
      <div className="pt-editor">
        <div>
          <input type="text" placeholder="Name" className="pt-name" onBlur={validateName}></input>:&nbsp;
          <input type="text" placeholder="Latitude" className="pt-latitude" onBlur={validateLatitude}></input>°lat,&nbsp;
          <input type="text" placeholder="Longitude" className="pt-longitude" onBlur={validateLongitude}></input>°long
        </div>
        <div className={`add-plus ${!isValidated() || isEmpty() ? ' disabled' : ''}`} onClick={handleClick}>+</div>
        {/* <div>
          <div className={`add ${!isValidated() || isEmpty() ? ' disabled' : ''}`} onClick={handleClick}>+</div>
          <div className={`cancel ${!isValidated() || isEmpty() ? ' disabled' : ''}`} onClick={handleClick}>x</div>
          <div className={`remove ${!isValidated() || isEmpty() ? ' disabled' : ''}`} onClick={handleClick}>-</div>
          <div className={`edit ${!isValidated() || isEmpty() ? ' disabled' : ''}`} onClick={handleClick}>-&gt;</div>
        </div> */}
      </div>
    </div>
  );
}