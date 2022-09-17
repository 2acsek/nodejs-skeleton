import convict from 'convict';

const configObject = convict({
  port: {
    doc: 'The application port',
    format: Number,
    default: 1338,
    env: 'PORT',
  },
  host: {
    doc: 'The application host',
    format: String,
    default: '127.0.0.1',
    env: 'HOST',
  },
  applicationUrl: {
    doc: 'URL of the application',
    format: String,
    default: 'http://localhost:1338',
    env: 'APPLICATION_URL',
  },
  gracefulShutdownLimitInSeconds: {
    doc: 'Maximum time to wait for graceful shutdown before killing the application',
    format: Number,
    default: 2,
    env: 'GRACEFUL_SHUTDOWN_LIMIT_IN_SECONDS',
  },
});

configObject.validate({ allowed: 'warn' });

export const config = configObject.getProperties();
export type Config = typeof config;
