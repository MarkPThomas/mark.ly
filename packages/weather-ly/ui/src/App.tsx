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
          <Button message="Click Me!" />
          <Forecast />
        </div>
      </>
    );
  }
}