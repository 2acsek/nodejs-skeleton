import { ValidationResult } from 'fastify';
import { VALIDATION_ERROR } from '../../domain/error/error.constants';
import { DetailedError } from './error';

export class ValidationError extends DetailedError {
  constructor(private errors: ValidationResult[]) {
    super(VALIDATION_ERROR);
  }

  getDetails(): Record<string, unknown> {
    return { errors: this.errors };
  }
}
