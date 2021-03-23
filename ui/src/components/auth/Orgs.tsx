import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { useEnv } from '../../providers/EnvProvider';
import { axios } from '../../providers/axios';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { Bubble } from '../../commons/components/Bubble';
import styles from './Orgs.module.scss';
import { useCurrentOrg } from '../../providers/OrgProvider';
import { UserOrg } from './user-org';
import { AddOrg } from '../orgs/AddOrg';
import { useMountedState } from '../../commons/hooks/use-mounted-state';

function OrgItem({ item }: {
  item: UserOrg;
}) {
  const { changeCurrentOrg } = useCurrentOrg();
  const [loading, setLoading] = useMountedState(false);

  const selectOrg = () => {
    setLoading(true);
    changeCurrentOrg(item.org._id)
      .catch(err => {
        toast.error(`Could not select org: ${err}`);
      })
      .finally(() => {
        setLoading(true);
      });
  };

  return (
    <li
      className="list-group-item list-group-item-action d-flex justify-content-between"
      onClick={selectOrg}
    >
      <div className="d-flex align-items-center">
        <Bubble color={item.org.color} src={item.org.logo} className="mr-3" />
        <strong>{item.org.name}</strong>
      </div>
      {loading && (
        <Loader />
      )}
    </li>
  );
}

function sortOrgs(a: UserOrg, b: UserOrg): number {
  return a.org.name < b.org.name ? -1 : a.org.name > b.org.name ? 1 : 0;
}

export function Orgs() {
  const env = useEnv();
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [items, setItems] = useMountedState<UserOrg[]>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<UserOrg[]>(`${env.MELI_API_URL}/api/v1/orgs`)
      .then(({ data }) => data.sort(sortOrgs))
      .then(setItems)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [env, setLoading, setItems]);

  const onAdded = (org: UserOrg) => {
    setItems([org, ...items].sort(sortOrgs));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <div className={classNames(styles.container, 'page')}>
      <div className="container">
        <div className="row">
          <div className="col d-flex justify-content-center">
            <div className={styles.grid}>

              <h2 className={styles.title}>Organization</h2>
              <p className="text-center">Select an organization</p>

              <ul className="list-group">
                {items.map(item => (
                  <OrgItem
                    key={item.org._id}
                    item={item}
                  />
                ))}
              </ul>

              <AddOrg
                onAdded={onAdded}
                className={classNames('list-group-item list-group-item-action', styles.add)}
                tooltip={false}
              >
                Add org
              </AddOrg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
