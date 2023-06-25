import fs from 'fs';
import { normalize } from 'path';

import * as entities from 'common/database/models';
import convict from 'convict';
import dotenv from 'dotenv';

dotenv.config({ path: normalize(`${__dirname}/.env`) });

const e = process.env;
const useSSL = e.POSTGRES_SSL_KEY && e.POSTGRES_SSL_KEY.toLowerCase() !== 'false';

const convictedConfig = convict({
  env: {
    doc: 'Application Environment',
    format: ['production', 'staging', 'development', 'testing'],
    default: 'development',
    env: 'NODE_ENV'
  },
  logger: {
    logDebug: {
      doc: 'Log Debug',
      format: Boolean,
      default: false,
      env: 'LOG_DEBUG'
    },
    logLevel: {
      doc: 'Log Level',
      format: String,
      default: 'info',
      env: 'LOG_LEVEL'
    },
    logName: {
      doc: 'Log Name',
      format: String,
      default: 'app-api'
    }
  },
  api: {
    baseUrl: {
      doc: 'App Base URL',
      format: String,
      default: '',
      env: 'BASE_URL'
    },
    port: {
      doc: 'App Port',
      format: 'port',
      default: 3000,
      env: 'PORT'
    }
  },
  externalApi: {
    baseUrl: {
      doc: 'API Url',
      format: String,
      default: '',
      env: 'EXTERNAL_BASE_URL'
    },
    token: {
      doc: 'API Token',
      format: String,
      default: '',
      env: 'EXTERNAL_API_TOKEN'
    }
  },
  identity: {
    cookieName: {
      doc: 'Cookie name',
      format: String,
      default: 'Identity.Session.Staging',
      env: 'SESSION_COOKIE_NAME'
    },
    apiUrl: {
      doc: 'Identity API Url',
      format: String,
      default: '',
      env: 'IDENTITY_API_URL'
    },
    apiKey: {
      doc: 'Identity API Key',
      format: String,
      default: '',
      env: 'IDENTITY_API_KEY'
    }
  },
  db: {
    name: {
      doc: 'Connection name',
      default: 'default'
    },
    host: {
      doc: 'Database Host',
      format: String,
      default: 'localhost',
      env: 'POSTGRES_HOST'
    },
    port: {
      doc: 'Database Port',
      format: 'port',
      default: 5432,
      env: 'POSTGRES_PORT'
    },
    database: {
      doc: 'Database Name',
      format: String,
      default: '',
      env: 'POSTGRES_DATABASE'
    },
    user: {
      doc: 'Database Username',
      format: String,
      default: '',
      env: 'POSTGRES_USERNAME'
    },
    password: {
      doc: 'Database Password',
      format: String,
      default: '',
      env: 'POSTGRES_PASSWORD',
      sensitive: true
    },
    dialect: {
      doc: 'Database Dialect',
      format: String,
      default: 'postgres',
      env: 'DIALECT'
    },
    ssl: {
      default: useSSL
        ? {
          rejectUnauthorized: false,
          ca: fs.readFileSync(e.POSTGRES_SSL_KEY).toString()
        }
        : (false as const)
    }
  },
  dbCluster: {
    doc: 'DB Cluster',
    default: {
      type: 'postgres' as const,
      entities: Object.values(entities),
      replication: {
        master: {
          host: e.POSTGRES_HOST,
          port: Number(e.POSTGRES_PORT),
          database: e.POSTGRES_DATABASE,
          username: e.POSTGRES_USERNAME,
          password: e.POSTGRES_PASSWORD,
          ssl: useSSL
            ? {
              rejectUnauthorized: false,
              ca: fs.readFileSync(e.POSTGRES_SSL_KEY).toString()
            }
            : null
        },
        slaves: [
          {
            host: e.POSTGRES_SLAVE_HOST,
            port: Number(e.POSTGRES_PORT),
            database: e.POSTGRES_DATABASE,
            username: e.POSTGRES_USERNAME,
            password: e.POSTGRES_PASSWORD,
            ssl: useSSL
              ? {
                rejectUnauthorized: false,
                ca: fs.readFileSync(e.POSTGRES_SSL_KEY).toString()
              }
              : null
          }
        ]
      }
    }
  },
  s3: {
    imageFolder: {
      doc: 'Image Folder',
      format: String,
      default: '',
      env: 'S3_IMAGE_FOLDER'
    },
    bucket: {
      doc: 'Bucket Name',
      format: String,
      default: '',
      env: 'S3_BUCKET'
    },
    accessKey: {
      doc: 'S3 access key',
      format: String,
      default: '',
      env: 'S3_ACCESS_KEY'
    },
    secretAccessKey: {
      doc: 'S3 secret access key',
      format: String,
      default: '',
      env: 'S3_SECRET_ACCESS_KEY'
    },
    avatarLiveDomain: {
      doc: 'Avatar Live Domain',
      format: String,
      default: '',
      env: 'AVATAR_LIVE_DOMAIN'
    },
    avatarLivePath: 'author/lg'
  },
  test: {
    user: {
      userHandle: {
        doc: 'Test userHandle',
        format: String,
        default: '',
        env: 'TEST_USER_HANDLE'
      }
    }
  },
  rabbit: {
    connectionOptions: {
      publisherHosts: {
        default: e.RABBIT_PUBLISHER_HOSTS ? e.RABBIT_PUBLISHER_HOSTS.split(',') : []
      },
      subscriberHosts: {
        default: e.RABBIT_SUBSCRIBER_HOSTS ? e.RABBIT_SUBSCRIBER_HOSTS.split(',') : []
      },
      user: {
        doc: 'Rabbit User',
        format: String,
        default: '',
        env: 'RABBIT_USERNAME'
      },
      password: {
        doc: 'Rabbit Password',
        format: String,
        default: '',
        env: 'RABBIT_PASSWORD',
        sensitive: true
      }
    },
    failedMessagesPath: {
      default: './publishing-failures.log'
    }
  }
});
convictedConfig.validate({ allowed: 'strict' });

const config = convictedConfig.get();

export type Config = typeof config;

export default config;