import { FastifyInstance, FastifyRequest, FastifySchema, RouteHandlerMethod } from 'fastify';
import { Endpoint, isRedirect, RequestContext } from './endpoint';

export const registerEndpoints = async (server: FastifyInstance, endpoints: Endpoint[]): Promise<void> => {
  await Promise.all(endpoints.map(async (endpoint) => registerEndpoint(server, endpoint)));
};

const registerEndpoint = async (server: FastifyInstance, endpoint: Endpoint): Promise<void> => {
  const schema: FastifySchema = {
    body: endpoint.bodyJSONSchema,
    querystring: endpoint.queryJSONSchema,
    params: endpoint.paramsJSONSchema,
    response: endpoint.responseSchemas,
  };

  await server.register((server: FastifyInstance, _, next: () => void) => {
    server.route({
      url: endpoint.route,
      method: endpoint.method,
      schema,
      handler: endpointHandlerMWFastifyFactory(endpoint),
    });
    next();
  });
};

const endpointHandlerMWFastifyFactory =
  <
    TReqBody extends Record<string, unknown> = Record<string, unknown>,
    TReqQuery extends Record<string, string> = Record<string, string>,
    TReqParams extends Record<string, string> = Record<string, string>,
    TResBody extends Record<string, unknown> = Record<string, unknown>,
  >(
    endpoint: Endpoint<TReqBody, TReqQuery, TReqParams, TResBody>,
  ): RouteHandlerMethod =>
  async (req, res) => {
    const ctx = requestContextFastifyFactory<TReqBody, TReqQuery, TReqParams>(req);
    const response = await endpoint.handler(ctx);

    if (isRedirect(response)) {
      return res.redirect(response.status, response.redirectTo);
    }

    return res
      .headers(response.headers || {})
      .status(response.status)
      .send(response.body);
  };

const requestContextFastifyFactory = <
  TReqBody extends Record<string, unknown>,
  TReqQuery extends Record<string, string> = Record<string, string>,
  TReqParams extends Record<string, string> = Record<string, string>,
>(
  request: FastifyRequest,
): RequestContext<TReqBody, TReqQuery, TReqParams> =>
  ({
    query: request.query || {},
    parameters: request.params || {},
    headers: request.headers || {},
    body: request.body || {},
  } as RequestContext<TReqBody, TReqQuery, TReqParams>);
