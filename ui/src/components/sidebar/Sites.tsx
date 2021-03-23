import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { useEnv } from '../../providers/EnvProvider';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { getTeamSites } from '../sites/get-team-sites';
import { Site } from '../sites/site';
import styles from './Sites.module.scss';
import { Bubble } from '../../commons/components/Bubble';
import { useMountedState } from '../../commons/hooks/use-mounted-state';
import { EventType } from '../../websockets/event-type';
import { useRoom } from '../../websockets/use-room';

function sortSites(a: Site, b: Site) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function ListItem({ site, onDeleted }: {
  site: Site;
  onDeleted: () => void;
}) {
  useRoom<{ site: Site }>('site', site._id, [EventType.site_deleted], ({ site: s }) => {
    if (site._id === s._id) {
      onDeleted();
    }
  });

  return (
    <NavLink
      key={site._id}
      to={`/sites/${site._id}`}
      className={styles.site}
      activeClassName={styles.active}
    >
      <Bubble color={site.color} src={site.logo} />
      <span className="ml-2">{site.name}</span>
    </NavLink>
  );
}

export function Sites({ teamId, className }: { teamId; className? }) {
  const env = useEnv();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [sites, setItems] = useState<Site[]>();

  useRoom<{ site: Site }>('team', teamId, [EventType.site_added], ({ site }) => {
    if (site.teamId === teamId) {
      setItems([site, ...sites].sort(sortSites));
    }
  });

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    getTeamSites(env, teamId)
      .then(items => {
        setItems(items.sort(sortSites));
      })
      .catch(setError)
      .catch(err => toast.error(`Could not list sites: ${err}`))
      .finally(() => setLoading(false));
  }, [env, teamId, setLoading]);

  const onDelete = (siteId: string) => {
    setItems(sites.filter(s => s._id !== siteId));
  };

  const emptyList = (
    <div className="text-muted ml-4">
      No sites to show
    </div>
  );

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <div className={classNames(className)}>
      <div>
        {sites.length === 0 ? (
          emptyList
        ) : (
          sites.map(site => (
            <ListItem
              site={site}
              onDeleted={() => onDelete(site._id)}
              key={site._id}
            />
          ))
        )}
      </div>
    </div>
  );
}
