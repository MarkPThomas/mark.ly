const path = require('path');


const tsNode = path.join(__dirname, '/node_modules/ts-node/dist/bin.js');

// TODO: Modify for this project. For pm2 service start
module.exports = {
  apps: [
    //  {
    //    name: 'proxy',
    //    cwd: './packages/dev/new-proxy/',
    //    script: tsNode,
    //    args: './src/main.ts',
    //    watch: ['./src/']
    //  },
    //  {
    //    name: 'mocks',
    //    cwd: './packages/dev/mocks/',
    //    script: './src/index.js',
    //    watch: ['./src/'],
    //    env: {
    //      JWT_COOKIE_DOMAIN: 'localhost'
    //    }
    //  },
    //  {
    //    name: 'content-authoring-home-api',
    //    cwd: './packages/content-authoring-home-api/',
    //    script: tsNode,
    //    args: '-r tsconfig-paths/register ./index.ts',
    //    watch: ['./']
    //  },
    //  {
    //    name: 'content-home-api',
    //    cwd: './packages/content-home-api/',
    //    script: tsNode,
    //    args: '-r tsconfig-paths/register ./index.ts',
    //    watch: ['./']
    //  },
    //  {
    //    name: 'content-home-server',
    //    cwd: './packages/content-home-v2/server/',
    //    script: tsNode,
    //    args: '--project tsconfig.json -r tsconfig-paths/register ./index.ts',
    //    watch: ['./']
    //  },
    //  {
    //    name: 'author-home-server',
    //    cwd: './packages/author-home/server/',
    //    script: tsNode,
    //    args: '--project tsconfig.json -r tsconfig-paths/register ./index.ts',
    //    watch: ['./']
    //  }
  ]
};
