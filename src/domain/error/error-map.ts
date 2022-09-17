import { DetailedError, isDetailedError, MappedError } from '../../framework/error/error';
import { ResourceNotFoundError } from '../../framework/error/resource-not-found-error';

type ErrorHandler = (errorCode: string, details?: Record<string, unknown>) => MappedError;

type ErrorMap = {
  errorHandler: ErrorHandler;
  errors: unknown[];
}[];

const errorMap: ErrorMap = [
  {
    errorHandler: (errorCode: string, details?: Record<string, unknown>) => ({
      errorCode,
      status: 404,
      ...(details ? { details } : {}),
    }),
    errors: [ResourceNotFoundError],
  },
];

export const errorMapper = (err: Error | DetailedError): MappedError | null => {
  const mappedError = errorMap.find((e) => e.errors.includes(err.constructor));
  if (!mappedError) {
    return null;
  }

  return mappedError.errorHandler(err.message, isDetailedError(err) ? err.getDetails() : undefined);
};
