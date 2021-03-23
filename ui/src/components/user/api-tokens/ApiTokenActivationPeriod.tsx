import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import moment from 'moment';
import { ApiToken } from './api-token';
import { Tooltip, tooltipToggle } from '../../../commons/components/Tooltip';

export function ApiTokenActivationPeriod({ apiToken, className }: {
  apiToken: ApiToken;
  className?;
}) {
  const [uid] = useState(uniqueId());
  return (
    <div className={className}>
      {new Date(apiToken.activatesAt).getTime() >= Date.now() ? (
        <>
          Activates
          {' '}
          <strong>{moment(apiToken.activatesAt).fromNow()}</strong>
        </>
      ) : (
        <div className="d-flex align-items-center">
          {apiToken.expiresAt && (
            <div className="mr-3">
              expires
              {' '}
              <strong>{moment(apiToken.expiresAt).fromNow()}</strong>
            </div>
          )}
          <div
            className="badge badge-success"
            {...tooltipToggle(uid)}
          >
            active
          </div>
          <Tooltip id={uid}>
            activated on
            {apiToken.activatesAt}
          </Tooltip>
        </div>
      )}
    </div>
  );
}
