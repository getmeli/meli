import React from 'react';
import {
  Redirect, Route, Switch, useRouteMatch,
} from 'react-router-dom';
import { SubHeader } from '../SubHeader';
import { NotFound } from '../../commons/components/NotFound';
import { NavPills } from '../../commons/components/NavPills';
import { TokenIcon } from '../icons/TokenIcon';
import { ApiTokenList } from './api-tokens/ApiTokenList';
import { UserIcon } from '../icons/UserIcon';
import { AddApiToken } from './api-tokens/AddApiToken';
import { ApiTokenView } from './api-tokens/ApiTokenView';
import { UserSecurity } from './UserSecurity';
import { SecurityIcon } from '../icons/SecurityIcon';

export function UserView() {
  const { url, path } = useRouteMatch();

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <SubHeader className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <UserIcon className="mr-2" />
                User settings
              </h5>
            </div>
            <div className="d-flex align-items-center">
              <NavPills links={[
                {
                  to: `${url}/api-tokens`,
                  label: (
                    <>
                      <TokenIcon className="mr-2" />
                      {' '}
                      Api tokens
                    </>
                  ),
                },
                {
                  to: `${url}/security`,
                  label: (
                    <>
                      <SecurityIcon className="mr-2" />
                      {' '}
                      Security
                    </>
                  ),
                },
              ]}
              />
            </div>
          </SubHeader>

          <div className="mt-4">
            <Switch>
              <Route
                exact
                path={url}
                render={() => (
                  <Redirect to={`${url}/api-tokens`} />
                )}
              />
              <Route path={`${path}/api-tokens`} exact component={ApiTokenList} />
              <Route path={`${path}/api-tokens/add`} exact component={AddApiToken} />
              <Route path={`${path}/api-tokens/:apiTokenId`} exact component={ApiTokenView} />
              <Route path={`${path}/security`} exact component={UserSecurity} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}
