import { createRoot } from 'react-dom/client';

import appConfig from '../../project.config';
import * as configJson from './config.json';
import { Settings } from './Settings';

import { App } from './App';
import './style.css';

const mapConfig = new Settings(configJson);
console.log(mapConfig);

const container = document.getElementById(appConfig.domId);
const root = createRoot(container!);
root.render(<App config={mapConfig} />);