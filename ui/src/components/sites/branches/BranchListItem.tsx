import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { uniqueId } from 'lodash';
import classNames from 'classnames';
import { useRouteMatch } from 'react-router-dom';
import { Branch } from './branch';
import { useSite } from '../SiteView';
import { Tooltip, tooltipToggle } from '../../../commons/components/Tooltip';
import { ExternalLink } from '../../../commons/components/ExternalLink';
import { BranchRelease } from './BranchRelease';
import { BranchIcon } from '../../icons/BranchIcon';
import { routerHistory } from '../../../providers/history';

export function BranchListItemView({ branch, className }: {
  branch: Branch;
  className?;
}) {
  const { url } = useRouteMatch();
  const { site } = useSite();
  const [uid1] = useState(uniqueId());
  const [isMainBranch, setIsMainBranch] = useState(false);

  useEffect(() => {
    setIsMainBranch(site.mainBranch === branch._id);
  }, [site, branch]);

  return (
    <div
      className={classNames(
        'list-group-item list-group-item-action justify-content-between align-items-center d-flex',
        className,
      )}
      onClick={() => {
        routerHistory.push(`${url}/${branch._id}`);
      }}
    >
      <div>
        <BranchIcon className="mr-2" />
        <strong>{branch.name}</strong>
      </div>

      <div>
        {branch.release && (
          <BranchRelease releaseId={branch.release} />
        )}
        {isMainBranch && (
          <>
            <div
              className="badge badge-success ml-2"
              {...tooltipToggle(uid1)}
            >
              main
            </div>
            <Tooltip id={uid1}>Site main branch</Tooltip>
          </>
        )}
        <ExternalLink
          href={branch.url}
          className="ml-3"
          onClick={ev => {
            ev.stopPropagation();
          }}
        >
          <FontAwesomeIcon icon={faExternalLinkAlt} />
        </ExternalLink>
      </div>
    </div>
  );
}
