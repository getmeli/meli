import Server = Caddy.Http.Server;

export function getErrorRoutes(): Server['errors'] {
  return {
    routes: [
      {
        match: [{
          expression: '{http.error.status_code} == 404',
        }],
        handle: [
          {
            handler: 'static_response',
            status_code: '404',
            body: 'Not found',
          },
        ],
        terminal: true,
      },
    ],
  };
}
