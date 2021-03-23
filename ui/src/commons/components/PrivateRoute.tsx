import { Redirect, Route } from 'react-router-dom';
import React from 'react';

export function PrivateRoute({
  component: Component, authed, redirectTo, ...rest
}: {
  component: any;
  authed: any;
  redirectTo: string;
  [prop: string]: any;
}) {
  return (
    <Route
      {...rest}
      render={(props: any) => (
        authed ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: redirectTo,
            state: {
              from: props.location,
            },
          }}
          />
        )
      )}
    />
  );
}
