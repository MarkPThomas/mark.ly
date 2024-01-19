import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';

import { Logger } from '../logger';

import { applyAxiosErrorHandler } from './utils/axios';
import router from './router';

applyAxiosErrorHandler();

const app: Express = express();

app.use(express.static(path.join(__dirname, 'public')));

// == Security ==
app.use(cors());
// Enable pre-flight CORS request for all/specified routes
app.options('*', cors());
app.disable('x-powered-by');

// == Data Parsing ==
// application/json
app.use(express.json());
// application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// === Routes ===
app.use(router);

app.on('error', (error) => Logger.log('Express error', error.toString()));

// import { Logger } from "./logger";
// // catch 404 and forward to error handler
// app.use((req: Request, res: Response, next) => {
// 	Logger.consoleLog('REQ==', req)
// 	const error = new Error('Not Found')
// 	Logger.consoleLog(error)
// 	error.status = 404
// 	res.send('Route not found')
// 	next(error)
// });

export default app;