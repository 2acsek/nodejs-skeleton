import { OpenAPIV3 } from 'openapi-types';
import { Config } from './config';
import { errorMapper } from './domain/error/error-map';
import { statusEndpointFactory } from './endpoint/status/get-status.endpoint';
import { Endpoint } from './framework/endpoint/endpoint';
import { errorHandlerFactory } from './framework/error/error-handler';
import { swaggerFastifyFactory } from './framework/fastify/swagger-fastify.factory';
import { serverFastifyFactory } from './framework/fastify/server-fastify';
import { gracefulWrapperHTTPFactory, stopGracefully } from './framework/graceful/graceful-stop';
import { Logger } from './framework/logger/logger';

const setupEndpoints = ({ version }: { version: string }): Endpoint[] => {
  const statusEndpoint = statusEndpointFactory({ version });
  return [statusEndpoint];
};

export const createApp = async ({
  logger,
  config,
  version = '0.0.0',
}: {
  logger: Logger;
  config: Config;
  version: string;
}) => {
  const endpoints = setupEndpoints({
    version,
  });

  const security: OpenAPIV3.SecurityRequirementObject[] = [
    {
      bearerToken: [],
    },
  ];

  const components: OpenAPIV3.ComponentsObject = {
    schemas: {},
    securitySchemes: {
      bearerToken: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  };

  const swaggerOptions = swaggerFastifyFactory({
    tags: [],
    host: config.applicationUrl.split('://')[1] || config.applicationUrl,
    version,
  });

  const app = await serverFastifyFactory({
    logger,
    swaggerOptions: swaggerOptions,
    errorHandler: errorHandlerFactory({ logger, errorMapper }),
    endpoints,
  });

  const gracefulHttp = gracefulWrapperHTTPFactory(app, config.gracefulShutdownLimitInSeconds * 1000);

  stopGracefully({
    processSignals: ['SIGINT', 'SIGTERM', 'SIGUSR2'],
    gracefulWrappers: [gracefulHttp],
    cleanup: async () => {
      await Promise.all([Promise.resolve()]);
    },
    timeout: config.gracefulShutdownLimitInSeconds * 1000,
    onShutdownStart: () => logger.info('shutting down gracefully'),
    onShutdownGracefulFail: () => logger.fatal('could not shut down gracefully'),
    onShutdownGracefulSuccess: () => logger.info('shut down gracefully'),
  });

  return app;
};
