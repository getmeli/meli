import React from 'react';
import {
  Route, Switch, useRouteMatch,
} from 'react-router-dom';
import { NotFound } from '../../commons/components/NotFound';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import { NavPills } from '../../commons/components/NavPills';

export function Legals() {
  const { url, path } = useRouteMatch();
  const links = [
    {
      to: url, label: 'Terms of service',
    },
    {
      to: `${url}/privacy`, label: 'Privacy policy',
    },
    // {to: `${url}/`, label:'Cookie policy'},
  ];
  return (
    <div className="container page">
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-end mb-4">
            <NavPills links={links} />
          </div>
          <Switch>
            <Route path={[path, `${path}/terms`]} exact component={TermsOfService} />
            <Route path={`${path}/privacy`} component={PrivacyPolicy} />
            {/* <Route path="/cookies" component={CookiePolicy}/> */}
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  );
}
