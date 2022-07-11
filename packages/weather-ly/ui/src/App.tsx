import React from 'react';
import { Forecast } from './components/Forecast/Forecast';

export class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Forecast />
      </>
    );
  }
}