export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly jsonResponse: number,
    message?: string,
  ) {
    super(message);
  }
}
