import React from 'react';

export function Currency({
  value, currency, symbolOnly,
}: {
  value?: number;
  currency: string;
  symbolOnly?: boolean;
}) {
  const text = !symbolOnly
    ? new Intl.NumberFormat('en-US', {
      style: 'currency', currency,
    }).format(value)
    : new Intl.NumberFormat('en-US', {
      style: 'currency', currency,
    })
      .format(0)
      .replace(/[0-9.,]/g, '');
  return <>{text}</>;
}
