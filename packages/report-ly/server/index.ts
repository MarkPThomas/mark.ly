import app from './app';
import config from './config';
import { Logger } from '../logger';

const port = config.port;
app.listen(port, () => {
  Logger.log(`Listening to ${config.app.appName} on port ${port}`);
})

export default app;

// public static $blogCategories = [
//   'trip-reports' => 'Trip Reports',
//   'articles' => 'Articles'
// ];

// public static $reportCategories = [
//   'alaska' => 'Alaska',
//   'california' => 'California',
//   'canada' => 'Canada',
//   'colorado' => 'Colorado',
//   'idaho' => 'Idaho',
//   'utah' => 'Utah',
//   'washington' => 'Washington',
//   'wyoming' => 'Wyoming'
// ];