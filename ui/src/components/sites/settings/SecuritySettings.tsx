import React from 'react';
import { useSite } from '../SiteView';
import { SitePassword } from './SitePassword';

export function SecuritySettings() {
  const { site, setSite } = useSite();

  return (
    <div className="card mt-4">
      <div className="card-header no-border">
        <SitePassword
          site={site}
          onChange={setSite}
        />
      </div>
    </div>
  );
}
