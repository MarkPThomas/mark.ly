import { Router, Request, Response } from 'express';

import config from '../config';

const router = Router();

const baseUrl = `${config.client.protocol}://${config.client.host}${config.client.port ? `:${config.client.port}` : ''}`;
const clientBundleScript = `<script src="${baseUrl}/scripts/bundle.js"></script>`;
const clientBundleStyle = config.env === 'production' ? `<link rel="stylesheet" href="${baseUrl}/styles/bundle.css">` : '';

router.get('*', (req: Request, res: Response) => {
  console.log('Getting base HTML...');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${config.app.title}</title>
        ${clientBundleStyle}
        <link rel="icon" href="data:,">
      </head>
      <body>
        <div id="${config.app.domId}"></div>
        ${clientBundleScript}
      </body>
    </html>
  `);
});

export default router;