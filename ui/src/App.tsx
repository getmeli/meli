import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { NotFound } from './commons/components/NotFound';
import { Footer } from './components/Footer';
import styles from './App.module.scss';
import { useAuth } from './providers/AuthProvider';
import { Legals } from './components/legals/Legals';
import { SignIn } from './components/auth/SignIn';
import { Home } from './components/Home';
import { Orgs } from './components/auth/Orgs';
import { useCurrentOrg } from './providers/OrgProvider';
import { TeamView } from './components/teams/TeamView';
import { TeamList } from './components/teams/TeamList';
import { OrgView } from './components/orgs/OrgView';
import { SiteView } from './components/sites/SiteView';
import { SideBar } from './components/sidebar/SideBar';
import { UserInfo } from './components/auth/UserInfo';
import { AddTeam } from './components/teams/AddTeam';
import { ButtonIcon } from './commons/components/ButtonIcon';
import { Search } from './components/sites/search/Search';
import { UserInvites } from './components/invites/UserInvites';
import { UserView } from './components/user/UserView';
import { PrivateRoute } from './commons/components/PrivateRoute';
import { FullPageCentered } from './commons/components/FullPageCentered';
import { Loader } from './commons/components/Loader';

function Header() {
  const { user } = useAuth();
  const { currentOrg } = useCurrentOrg();
  return (
    <div className={classNames(styles.header)}>
      <div className="container-fluid">
        <div className="row">
          <div className="col d-flex align-items-center justify-content-between">
            {user && (
              <>
                <UserInfo />
                {currentOrg && (
                  <div className="d-flex align-items-center">
                    <AddTeam>
                      <ButtonIcon>
                        <FontAwesomeIcon icon={faPlus} />
                      </ButtonIcon>
                    </AddTeam>
                    <Search />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const { user, initialized: userInitialized } = useAuth();
  const { currentOrg, initialized: orgInitialized } = useCurrentOrg();
  const initialized = userInitialized || orgInitialized;
  return !initialized ? (
    <FullPageCentered>
      <p>
        Initializing
        <Loader className="ml-2" />
      </p>
    </FullPageCentered>
  ) : (
    <div className={styles.app} id="app">
      <Header />
      {currentOrg && (
        <SideBar className={styles.sidebar} />
      )}
      <main className={styles.main}>
        <Switch>
          {/* public */}
          <PrivateRoute
            path="/login"
            exact
            component={SignIn}
            authed={!user}
            redirectTo="/"
          />

          {/* user */}
          <PrivateRoute
            path="/user"
            component={UserView}
            authed={user}
            redirectTo="/login"
          />
          <PrivateRoute
            path="/invite"
            component={UserInvites}
            authed={user}
            redirectTo="/login"
          />

          {/* user && !currentOrg */}
          <PrivateRoute
            path="/orgs"
            exact
            component={Orgs}
            authed={user && !currentOrg}
            redirectTo="/login"
          />

          {/* user && currentOrg */}
          <PrivateRoute
            path="/"
            exact
            component={Home}
            authed={user && currentOrg}
            redirectTo="/orgs"
          />
          <PrivateRoute
            path="/org"
            component={OrgView}
            authed={user && currentOrg && currentOrg.isAdminOrOwner}
            redirectTo="/orgs"
          />
          <PrivateRoute
            path="/teams"
            exact
            component={TeamList}
            authed={user && currentOrg}
            redirectTo="/orgs"
          />
          <PrivateRoute
            path="/teams/:teamId"
            component={TeamView}
            authed={user && currentOrg}
            redirectTo="/orgs"
          />
          <PrivateRoute
            path="/sites/:siteId"
            component={SiteView}
            authed={user && currentOrg}
            redirectTo="/orgs"
          />

          <Route path="/legal" component={Legals} />

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}
