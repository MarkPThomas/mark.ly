import React from 'react';
import { Loading } from './components/Loading/Loading';

export class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Loading />
      </>
    );
  }
}