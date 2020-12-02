import axios, { AxiosError } from 'axios';
import { createHmac } from 'crypto';
import { EventType } from '../../../events/app-event';
import { object, string } from 'joi';
import { Logger } from '../../../commons/logger/logger';
import { HookDeliveryResult } from '../get-hook-handler';

interface WebhookConfig {
  url: string;
  secret: string;
}

export const $webhookConfig = object({
  url: string().required(),
  secret: string().required(),
});

interface WebhookDeliveryData {
  error?: string;
  request: {
    url: string;
    headers?: { [key: string]: string };
    payload?: string;
  };
  response?: {
    status: number;
    statusText: string;
    headers: { [key: string]: string };
    payload: string;
  }
}

function signBody(payload: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(payload)
    .digest()
    .toString('hex');
}

const logger = new Logger('meli.server:deliverWebHook');

export async function deliverWebHook(
  config: WebhookConfig,
  event: EventType,
  data: any,
): Promise<HookDeliveryResult<WebhookDeliveryData>> {
  const { url, secret } = config;
  const payload = JSON.stringify(data);
  const signature = signBody(payload, secret);
  const headers = {
    'Content-Type': 'application/json',
    'X-Webhook-Event': event,
    'X-Webhook-Signature': signature,
  };
  const result: HookDeliveryResult<WebhookDeliveryData> = {
    success: undefined,
    data: {
      request: {
        url,
        headers,
        payload,
      },
    },
  };

  logger.debug('delivering web hook', url, headers, payload);

  try {
    const response = await axios.post(url, payload, {
      headers,
      // prevent axios from parsing payload
      transformResponse: res => res,
    });
    result.data.response = {
      status: response.headers,
      statusText: response.statusText,
      headers: response.headers,
      payload: response.data,
    };
    result.success = response.status >= 200 && response.status < 400;
  } catch (e) {
    result.success = false;
    result.error = e.message;
    if ((e as AxiosError).isAxiosError) {
      const err = e as AxiosError;
      if (result.data.response) {
        result.data.response = {
          status: err.response.status,
          statusText: err.response.statusText,
          headers: err.response.headers,
          payload: err.response.data,
        };
      }
    }
  }

  return result;
}
