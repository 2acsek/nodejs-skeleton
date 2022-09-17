import { SwaggerOptions } from '@fastify/swagger';
import { OpenAPIV3 } from 'openapi-types';

type FastifySwaggerFactoryArgs = {
  host: string;
  tags: OpenAPIV3.TagObject[];
  version: string;
};

export const swaggerFastifyFactory = (factoryArgs: FastifySwaggerFactoryArgs): SwaggerOptions => ({
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'API',
      description: 'API description',
      version: factoryArgs.version,
    },
    host: factoryArgs.host,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: factoryArgs.tags,
  },
  exposeRoute: true,
});
