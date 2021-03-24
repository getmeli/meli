import {AxiosError} from './axios-error';

describe('AxiosError', () => {

  const originalAxiosError = {
    toJSON: () => ({}),
    response: {
      status: 'status',
      statusText: 'statusText',
      headers: 'headers',
      data: 'data',
    }
  }

  describe('toJSON', () => {

    it('should format error to json', async () => {
      const error = new AxiosError('message', originalAxiosError);
      expect(error.toJSON()).toEqual({
        errorObject: {},
        response: {
          status: 'status',
          statusText: 'statusText',
          headers: 'headers',
          data: 'data',
        },
      })
    });

    it('should accept empty error', async () => {
      const axiosError = new AxiosError('message', null);
      expect(axiosError.toJSON()).toEqual(undefined);
    });

    it('should accept empty error response', async () => {
      const axiosError = new AxiosError('message', {
        response: undefined,
        toJSON: () => '',
      });
      expect(axiosError.toJSON()).toEqual({
        errorObject: '',
        response: {
          status: undefined,
          statusText: undefined,
          headers: undefined,
          data: undefined,
        }
      });
    });

  });

  describe('toString', () => {

    it('should format error', async () => {
      const error = new AxiosError('message', originalAxiosError);
      expect(error.toString()).toEqual('message {\"errorObject\":{},\"response\":{\"status\":\"status\",\"statusText\":\"statusText\",\"headers\":\"headers\",\"data\":\"data\"}}');
    });

  });

});
