import React from 'react';
import { Forecast } from './components/Forecast/Forecast';
import { Button } from './components/shared/Button'

export class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div>
          <Button message="Click For Grid Data!" />
          <Button message="Click For Forecast!" />
          <Button message="Click For Hourly Forecast!" />
          <Forecast />
        </div>
      </>
    );
  }
}