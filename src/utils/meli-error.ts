import { BaseError } from 'make-error';

export abstract class MeliError extends BaseError {
  constructor(message?: string, public readonly cause?: any) {
    super(message);
  }
}
