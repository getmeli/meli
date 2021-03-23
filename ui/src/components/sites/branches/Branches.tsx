import React from 'react';
import {
  Route, Switch, useRouteMatch,
} from 'react-router-dom';
import { BranchView } from './BranchView';
import { BranchList } from './BranchList';

export function Branches() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={path} exact component={BranchList} />
      <Route path={`${path}/:branchId`} component={BranchView} />
    </Switch>
  );
}
