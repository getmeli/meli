import React from 'react';
import { useCurrentOrg } from '../../providers/OrgProvider';

export function IsOwner({ children }: {
  children;
}) {
  const { currentOrg } = useCurrentOrg();
  return currentOrg && currentOrg.isOwner ? (
    children
  ) : (
    <></>
  );
}
