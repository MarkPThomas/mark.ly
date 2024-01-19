import { createRoot } from 'react-dom/client';

import config from '../../project.config';

import { App } from './App';
import './style.css';

const container = document.getElementById(config.domId);
const root = createRoot(container!);
root.render(<App />);