import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';

import { applyAxiosErrorHandler } from '../../common/utils/api/axios';

import router from './router';

applyAxiosErrorHandler();

const app: Express = express();

// == Security ==
app.use(cors());
app.disable('x-powered-by');

// == Data Parsing ==
// application/json
app.use(express.json());
// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// === Routes ===
// const homeRouter = require('./routes/home');

// Enable pre-flight CORS request for all/specified routes
app.options('*', cors())
app.use(router);

// app.on('error', (error) => Logger.log('Express error', error.toString()));

export default app;