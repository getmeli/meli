import React from 'react';
import { useOrg } from '../OrgView';
import { Org } from '../org';
import { useCurrentOrg } from '../../../providers/OrgProvider';
import { Logo } from '../../commons/Logo';

export function OrgLogo<T>() {
  const { org, setOrg } = useOrg();
  const { currentOrg, setCurrentOrg } = useCurrentOrg();

  const updateOrg = (value: Org) => {
    setOrg(value);
    if (currentOrg && currentOrg.org?._id === org._id) {
      setCurrentOrg({
        ...currentOrg,
        org: value,
      });
    }
  };

  return (
    <Logo
      context="orgs"
      value={org}
      setValue={updateOrg}
      className="mt-4"
    />
  );
}
