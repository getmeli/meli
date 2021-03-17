export class AppError extends Error {
  constructor(
    message: string,
    public readonly jsonResponse?: any,
    public readonly statusCode: number = 500,
  ) {
    super(message);
  }
}
