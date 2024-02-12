import path from 'path';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();

// == Security ==
app.use(cors());
app.disable('x-powered-by');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// == Data Parsing ==
// application/json
app.use(express.json());
// application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

// === Routes ===
// const homeRouter = require('./routes/home');
// const searchRouter = require('./routes/search');
// const suggestedRouter = require('./routes/suggested');
// const authorizationRouter = require('./routes/auth');
// const mediaDetailRouter = require('./routes/mediaDetail');
// const reviewsRouter = require('./routes/reviews');

// Enable pre-flight CORS request for all routes
app.options('*', cors())
// app.use('/home', homeRouter);
// app.use('/search', searchRouter);
// app.use('/suggested', suggestedRouter);
// app.use('/auth', authorizationRouter);
// app.use('/media', mediaDetailRouter);
// app.use('/reviews', reviewsRouter);

const clientBundleScript = '<script src="http://localhost:8080/scripts/bundle.js"></script>';
const clientBundleStyle = '<link rel="stylesheet" href="http://localhost:8080/styles/bundle.css">';
app.get('*', (res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mark.ly</title>
        ${clientBundleStyle}
        <link rel="icon" href="data:,">
      </head>
      <body>
        <div id="mark-ly"></div>
        ${clientBundleScript}
      </body>
    </html>
  `);
});

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

module.exports = app;