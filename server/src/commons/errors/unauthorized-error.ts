import { HttpError } from './http-error';

export class UnauthorizedError extends HttpError {
  constructor(message?: string) {
    super(401, undefined, message || 'Unauthorized');
  }
}
