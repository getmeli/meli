import { HttpError } from './http-error';

export class ForbiddenError extends HttpError {
  constructor(message?: string) {
    super(403, undefined, message || 'Forbidden');
  }
}
