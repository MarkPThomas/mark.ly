import app from './app';
import config from './config';
import { Logger } from '../logger';

const port = config.port;
app.listen(port, () => {
  Logger.log(`Listening to ${config.app.appName} on port ${port}`);
})

export default app;

// axios.get(`https://api.weather.gov/gridpoints/BOU/39,55/forecast`)
//   .then(res => {
//     const div = document.createElement('div');
//     div.setAttribute('id', 'App');
//     document.body.appendChild(div);
//     ReactDOM.render(<App />, div);
//   })
//   .catch(err => {
//     console.log(err.stack);
//   });