import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './style.css';
import { App } from './App';

// import QA from './components/QA/QA.jsx';

axios.get(`https://api.weather.gov/gridpoints/BOU/39,55/forecast`)
  .then(res => {
    const div = document.createElement('div');
    div.setAttribute('id', 'App');
    document.body.appendChild(div);
    ReactDOM.render(<App />, div);
  })
  .catch(err => {
    console.log(err.stack);
  });
