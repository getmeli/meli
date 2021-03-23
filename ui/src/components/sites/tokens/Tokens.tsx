import React from 'react';
import {
  Route, Switch, useRouteMatch,
} from 'react-router-dom';
import { TokenList } from './TokenList';
import { TokenView } from './TokenView';

export function Tokens() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={path} exact component={TokenList} />
      <Route path={`${path}/:tokenId`} component={TokenView} />
    </Switch>
  );
}
