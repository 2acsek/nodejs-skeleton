import { RESOURCE_NOT_FOUND } from '../../domain/error/error.constants';
import { DetailedError } from './error';

export enum EntityName {
  TENANT = 'TENANT',
  OAUTH_CLIENT = 'OAUTH_CLIENT',
  SAML_CLIENT = 'SAML_CLIENT',
  USER = 'USER',
  COMPANY = 'COMPANY',
  IMPORT = 'IMPORT',
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
