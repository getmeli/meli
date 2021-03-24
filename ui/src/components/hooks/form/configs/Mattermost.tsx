import { useFormContext } from 'react-hook-form';
import React from 'react';
import { maxLength, required } from '../../../../commons/components/forms/form-constants';
import { InputError } from '../../../../commons/components/forms/InputError';
import { ExternalLink } from '../../../../commons/components/ExternalLink';

export function Mattermost() {
  const { register, errors } = useFormContext();
  const input_url = 'config.url';
  return (
    <>
      <div className="form-group">
        <label
          htmlFor={input_url}
          className="form-label"
        >
          Mattermost
          {' '}
          <ExternalLink
            href="https://docs.mattermost.com/developer/webhooks-incoming.html#simple-incoming-webhook"
          >
            incoming webhook URL
          </ExternalLink>
        </label>
        <input
          type="text"
          id={input_url}
          name={input_url}
          className="form-control"
          ref={register({
            required,
            maxLength: maxLength(),
          })}
        />
        <InputError error={errors} path={input_url} />
      </div>
    </>
  );
}
