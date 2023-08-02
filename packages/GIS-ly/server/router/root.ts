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
        <meta name="viewport" content="width=device-width, initial-scale=1.0", shrink-to-fit=no>
        <title>${config.app.title}</title>
        ${clientBundleStyle}
        <link rel="icon" href="data:,">
        <!--
          manifest.json provides metadata used when your web app is added to the
          homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
        -->
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
        <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
        <!--
          Notice the use of %PUBLIC_URL% in the tags above.
          It will be replaced with the URL of the 'public' folder during the build.
          Only files inside the 'public' folder can be referenced from the HTML.

          Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
          work correctly both with client-side routing and a non-root public URL.
        -->

        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossorigin=""></script>

      </head>
      <body>
        <noscript>
          You need to enable JavaScript to run this app.
        </noscript>
        <div id="${config.app.domId}">

        </div>
        ${clientBundleScript}
      </body>
    </html>
  `);
});

export default router;