import { RESOURCE_NOT_FOUND } from '../../domain/error/error.constants';
import { DetailedError } from './error';

export enum EntityName {
  UNKNOWN = 'UNKNOWN',
}

export class ResourceNotFoundError extends DetailedError {
  constructor(private entity: EntityName) {
    super(RESOURCE_NOT_FOUND);
  }

  public getDetails(): { entityName: EntityName } {
    return {
      entityName: this.entity,
    };
  }
}
