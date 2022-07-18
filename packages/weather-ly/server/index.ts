import app from './app';
import config from './config';
import { Logger } from '../logger';
import connectDB from './db/mongo';

const port = config.port;
app.listen(port, () => {
  Logger.log(`Listening to ${config.app.appName} on port ${port}`);
})

connectDB();

export default app;