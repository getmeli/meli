export class AxiosError extends Error {
  constructor(message: string, public error?: any) {
    super(message);
  }

  toJSON(): any {
    if (!this.error) {
      return undefined;
    }
    return {
      errorObject: this.error?.toJSON(),
      response: {
        status: this.error.response?.status,
        statusText: this.error.response?.statusText,
        headers: this.error.response?.headers,
        data: this.error.response?.data,
      },
    };
  }

  toString(): string {
    return `${this.message} ${JSON.stringify(this.toJSON())}`;
  }
}
