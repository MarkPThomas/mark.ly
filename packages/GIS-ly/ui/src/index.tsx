import { createRoot } from 'react-dom/client';

import appConfig from '../../project.config';
import * as configJson from './config.json';

import { App } from './App';
import './style.css';
import { Config } from './Config';

const mapConfig = new Config(configJson);

const container = document.getElementById(appConfig.domId);
const root = createRoot(container!);
root.render(<App config={mapConfig} />);