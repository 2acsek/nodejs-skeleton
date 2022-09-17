import { createApp } from './app';
import { config } from './config';
import { loggerPinoFactory } from './framework/logger/logger-pino';

const version = process.env.npm_package_version || '0.0.0';
const logLevel = process.env.LOG_LEVEL || 'info';
const packageName = process.env.npm_package_name || 'f1-test';

const logger = loggerPinoFactory({
  version,
  level: logLevel,
  name: packageName,
});

const main = async (): Promise<void> => {
  const app = await createApp({ version, logger, config });
  await app.listen({
    port: config.port,
    host: config.host,
  });
};

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
