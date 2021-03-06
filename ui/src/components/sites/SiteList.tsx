import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { uniqueId } from 'lodash';
import { Loader } from '../../commons/components/Loader';
import { EmptyList } from '../../commons/components/EmptyList';
import { getTeamSites } from './get-team-sites';
import { SiteCard } from './SiteCard';
import { AlertError } from '../../commons/components/AlertError';
import { Site } from './site';
import { AddSite } from './AddSite';
import { SiteIcon } from '../icons/SiteIcon';
import { useMountedState } from '../../commons/hooks/use-mounted-state';

export function SiteList() {
  const { teamId } = useParams<any>();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [items, setItems] = useState<Site[]>();
  const itemsRef = useRef<Site[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    getTeamSites(teamId)
      .then(data => {
        itemsRef.current.push(...data);
        setItems(itemsRef.current);
      })
      .catch(setError)
      .catch(err => toast.error(`Could not list repos: ${err}`))
      .finally(() => setLoading(false));
  }, [teamId, setLoading]);

  const emptyList = (
    <EmptyList
      icon={<SiteIcon/>}
      title="No sites"
    >
      <AddSite teamId={teamId}>
        <button type="button" className="btn btn-primary d-block">
          Add site
        </button>
      </AddSite>
    </EmptyList>
  );

  return loading ? (
    <Loader/>
  ) : error ? (
    <AlertError error={error}/>
  ) : (
    <div className="mt-5" key={uniqueId()}>
      {items.length === 0 ? (
        emptyList
      ) : (
        <>
          <h2>Sites</h2>
          {items.map(site => (
            <Link to={`/sites/${site._id}`} className="d-block" key={site._id}>
              <SiteCard site={site}/>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
