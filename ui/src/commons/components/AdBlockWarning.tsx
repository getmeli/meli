import React, { useState } from 'react';
import { Alert } from './Alert';

export function adBlockerEnabled(): boolean {
  return !document.getElementById('adsjs-wlegKJyqQhLm');
}

export function AdBlockerWarning({ className }: { className?: string }) {
  const [hasAdBlocker] = useState(adBlockerEnabled());
  return hasAdBlocker ? (
    <Alert
      type="warning"
      className={className}
    >
      You seem to have an ad blocker enabled. You may experience issues with Stripe payments.
    </Alert>
  ) : (
    <></>
  );
}
