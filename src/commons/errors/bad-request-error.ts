import { HttpError } from './http-error';

export class BadRequestError extends HttpError {
  constructor(
    message?: string,
    jsonResponse?: any,
  ) {
    super(400, jsonResponse, message || 'Bad request');
  }
}
