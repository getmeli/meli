import { HttpError } from './http-error';

export class NotFoundError extends HttpError {
  constructor(message?: string) {
    super(404, undefined, message || 'Not found');
  }
}
