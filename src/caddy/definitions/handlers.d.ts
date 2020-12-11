declare namespace Caddy {
  type HttpRouteHandler = HttpRouteAcmeHandler
    | HttpRouteAuthenticationHandler
    | HttpRouteEncodeHandler
    | HttpRouteErrorHandler
    | HttpRouteFileServerHandler
    | HttpRouteHeadersHandler
    | HttpRoutePushHandler
    // TODO;

  interface HttpRouteAcmeHandler {
    handler: 'acme_server';
    ca?: string;
    host?: string;
    path_prefix?: string;
  }

  interface HttpRouteAuthenticationHandler {
    handler: 'authentication';
    // TODO
  }

  interface HttpRouteEncodeHandler {
    handler: 'encode';
    // TODO
  }

  interface HttpRouteErrorHandler {
    handler: 'error';
    // TODO
  }

  interface HttpRouteFileServerHandler {
    handler: 'file_server';
    // TODO
  }

  interface HttpRouteHeadersHandler {
    handler: 'headers';
    // TODO
  }

  interface HttpRoutePushHandler {
    handler: 'push';
    // TODO
  }
}
