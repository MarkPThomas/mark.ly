import { StatusCode } from '../../enums/status-code.enum';

export class HttpNotFound extends Error {
  constructor (
    message = 'Not Found',
    public status: number = StatusCode.NotFound) {
      super(message);
    }
}

export class HttpForbidden extends Error {
  constructor (
    message = 'Forbidden',
    public status: number = StatusCode.Forbidden) {
      super(message);
    }
}

export class HttpAcceptable extends Error {
  constructor (
    message = 'Not Acceptable',
    public status: number = StatusCode.NotAcceptable) {
      super(message);
    }
}

export class HttpUnauthorized extends Error {
  constructor (
    message = 'Unauthorized',
    public status: number = StatusCode.Unauthorized) {
      super(message);
    }
}