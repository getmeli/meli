import React from 'react';
import {
  Route, Switch, useRouteMatch,
} from 'react-router-dom';
import { HookList } from './HookList';
import { AddHook } from './AddHook';
import { HookView } from './HookView';

export function Hooks() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={path} exact component={HookList} />
      <Route path={`${path}/add`} exact component={AddHook} />
      <Route path={`${path}/:hookId`} component={HookView} />
    </Switch>
  );
}
