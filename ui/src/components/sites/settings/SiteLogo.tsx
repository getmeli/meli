import React from 'react';
import { useSite } from '../SiteView';
import { Logo } from '../../commons/Logo';

export function SiteLogo() {
  const { site, setSite } = useSite();

  return (
    <Logo
      context="sites"
      value={site}
      setValue={setSite}
      className="mt-4"
    />
  );
}
