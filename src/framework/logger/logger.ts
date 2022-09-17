type LoggerFn = {
  (msg: string, ...args: unknown[]): void;
  (obj: unknown, msg?: string, ...args: unknown[]): void;
};

export type LogLevel = 'info' | 'error' | 'debug' | 'fatal' | 'warn' | 'trace';

export type SerializerFn = (value: unknown) => unknown;

export interface LoggerBindings {
  level?: LogLevel | string;
  serializers?: { [key: string]: SerializerFn };
  [key: string]: unknown;
}

export interface Logger {
  level: string;
  silent: LoggerFn;
  info: LoggerFn;
  debug: LoggerFn;
  error: LoggerFn;
  warn: LoggerFn;
  fatal: LoggerFn;
  trace: LoggerFn;
  child(bindings: LoggerBindings): Logger;
}
