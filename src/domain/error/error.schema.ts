import { JSONSchema7 } from 'json-schema';

export const errorSchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['errorCode'],
  properties: {
    errorCode: {
      type: 'string',
    },
    details: {
      type: 'object',
      additionalProperties: true,
    },
  },
};
