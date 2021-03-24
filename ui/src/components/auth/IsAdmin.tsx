import React from 'react';
import { useCurrentOrg } from '../../providers/OrgProvider';

export function IsAdmin({ children }: {
  children;
}) {
  const { currentOrg } = useCurrentOrg();
  return currentOrg && currentOrg.isAdminOrOwner ? (
    children
  ) : (
    <></>
  );
}
