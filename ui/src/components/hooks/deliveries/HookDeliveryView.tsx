import React from 'react';
import moment from 'moment';
import { HookDelivery } from './hook-delivery';
import { CodeSnippet } from '../../../commons/components/CodeSnippet';
import { StatusIndicator } from '../../../commons/components/status/StatusIndicator';
import { HookType } from '../hook';

function Data({
  data,
  type,
}: {
  type: HookType;
  data: any;
}) {
  switch (type) {
    default:
      return <CodeSnippet>{JSON.stringify(data, null, 2)}</CodeSnippet>;
  }
}

export function HookDeliveryView({ delivery }: {
  delivery: HookDelivery;
}) {
  return (
    <div className="list-group-item">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <StatusIndicator status={delivery.success ? 'success' : 'failure'} />
          <div className="ml-3 font-weight-bold">
            {moment(delivery.date).format('YYYY-MM-DD')}
          </div>
        </div>
        <div>
          <span className="text-muted">{moment(delivery.date).fromNow()}</span>
        </div>
      </div>
      <Data
        type={delivery.type}
        data={delivery.data}
      />
    </div>
  );
}
