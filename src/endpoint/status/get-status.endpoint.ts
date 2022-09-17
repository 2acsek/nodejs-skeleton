import { Endpoint, EndpointMethods } from '../../framework/endpoint/endpoint';

export type GetStatusEndpointResponseBody = {
  status: 'ok';
  timestamp: number;
  version: string;
};

export type GetStatusEndpoint = Endpoint<
  Record<string, unknown>,
  Record<string, string>,
  Record<string, string>,
  GetStatusEndpointResponseBody
>;

export const statusEndpointFactory = ({ version }: { version: string }): GetStatusEndpoint => ({
  method: EndpointMethods.GET,
  route: '/status',
  handler: async () => {
    return Promise.resolve({ body: { version, status: 'ok', timestamp: Date.now() }, status: 200 });
  },
  responseSchemas: {
    200: {
      type: 'object',
      additionalProperties: false,
      required: ['status', 'timestamp'],
      properties: {
        status: {
          type: 'string',
        },
        timestamp: {
          type: 'number',
        },
        version: {
          type: 'string',
        },
      },
    },
  },
});
