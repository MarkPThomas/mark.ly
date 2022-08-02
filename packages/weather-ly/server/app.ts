import path from 'path';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';

import { Logger } from '../logger';

import config from './config';
import { applyAxiosErrorHandler } from './utils/axios';
import router from './router';
import handleError from './middleware/handle-error';

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
// app.use(handleError);

// == Page Render ==
// const baseUrl = `${config.client.protocol}://${config.client.host}${config.client.port ? `:${config.client.port}` : ''}`;
// const clientBundleScript = `<script src="${baseUrl}/scripts/bundle.js"></script>`;
// const clientBundleStyle = config.env === 'production' ? `<link rel="stylesheet" href="${baseUrl}/styles/bundle.css">` : '';

// app.get('*', (req: Request, res: Response) => {
//   console.log('Getting base HTML...');
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>${config.app.title}</title>
//         ${clientBundleStyle}
//         <link rel="icon" href="data:,">
//       </head>
//       <body>
//         <div id="${config.app.domId}"></div>
//         ${clientBundleScript}
//       </body>
//     </html>
//   `);
// });

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