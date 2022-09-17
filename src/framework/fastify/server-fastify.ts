import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyFormBody from '@fastify/formbody';
import fastifySwagger, { SwaggerOptions } from '@fastify/swagger';
import { Endpoint, EndpointMethods } from '../endpoint/endpoint';
import { Logger } from '../logger/logger';
import Ajv from 'ajv';
import { registerEndpoints } from '../endpoint/endpoint-fastify';
import { NOT_FOUND } from '../../domain/error/error.constants';
import { errorHandlerFastifyMWFactory } from './error-mw-fastify.factory';
import { ErrorHandler } from '../error/error-handler';

type ServerFastifyFactoryArgs = {
  endpoints: Endpoint[];
  swaggerOptions: SwaggerOptions;
  errorHandler: ErrorHandler;
  logger: Logger;
};

export const serverFastifyFactory = async (factoryArgs: ServerFastifyFactoryArgs) => {
  const server = fastify({
    logger: factoryArgs.logger,
  });

  await server.register(fastifyCors, { origin: '*', methods: [...Object.values(EndpointMethods)] });

  await server.register(fastifySwagger, factoryArgs.swaggerOptions);

  server.setErrorHandler(errorHandlerFastifyMWFactory({ errorHandler: factoryArgs.errorHandler }));

  server.setNotFoundHandler((_, reply) => void reply.status(404).send({ errorCode: NOT_FOUND }));

  await server.register(fastifyFormBody);

  const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: 'array',
    allErrors: true,
  });

  server.setValidatorCompiler(({ schema }) => {
    return ajv.compile(schema);
  });

  await registerEndpoints(server, factoryArgs.endpoints);

  return server;
};
