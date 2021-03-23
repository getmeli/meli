import React from 'react';
import { useParams } from 'react-router-dom';
import { BranchPassword } from '../BranchPassword';
import { useBranch } from '../BranchView';
import { BranchGeneralSettings } from './BranchGeneralSettings';

export function BranchSettings() {
  const { siteId } = useParams();
  const { branch, setBranch } = useBranch();
  return (
    <>
      <div className="card">
        <div className="card-header no-border">
          <BranchPassword
            siteId={siteId}
            branch={branch}
            onChange={setBranch}
          />
        </div>
      </div>

      <BranchGeneralSettings />
    </>
  );
}
