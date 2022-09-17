import { JSONSchema7 } from 'json-schema';

export enum EndpointMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export type RequestContext<TReqBody, TReqQuery, TReqParams> = {
  method: EndpointMethods;
  path: string;
  body: TReqBody;
  query: TReqQuery;
  parameters: TReqParams;
  headers: { [key: string]: string | string[] };
  cookies: { [key: string]: string };
};

export type Response<TResBody> = {
  status: number;
  body?: TResBody;
  headers?: { [key: string]: string };
};

export type Redirect = {
  status: number;
  redirectTo: string;
};

export const isRedirect = (
  responseOrRedirect: Response<Record<string, unknown>> | Redirect,
): responseOrRedirect is Redirect => !!(responseOrRedirect as Redirect).redirectTo;

export interface Endpoint<
  TReqBody extends Record<string, unknown> = Record<string, unknown>,
  TReqQuery extends Record<string, string> = Record<string, string>,
  TReqParams extends Record<string, string> = Record<string, string>,
  TResBody = never | Record<string, unknown>,
> {
  method: EndpointMethods;
  route: string;
  handler: (request: RequestContext<TReqBody, TReqQuery, TReqParams>) => Promise<Response<TResBody>>;
  bodyJSONSchema?: JSONSchema7;
  queryJSONSchema?: JSONSchema7;
  paramsJSONSchema?: JSONSchema7;
  responseSchemas?: {
    [code: number]: JSONSchema7;
  };
  description?: string;
  summary?: string;
}
