import React from 'react';
import { useFormContext } from 'react-hook-form';
import { faExternalLinkAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { maxLength, required } from '../../../../commons/components/forms/form-constants';
import { InputError } from '../../../../commons/components/forms/InputError';
import { ButtonIcon } from '../../../../commons/components/ButtonIcon';
import { BranchRedirectsFormData } from './branch-redirects-form-data';
import { ExternalLink } from '../../../../commons/components/ExternalLink';
import { BranchRedirect, RedirectType } from '../branch-redirect';
import { ReverseProxy } from './configs/ReverseProxy';
import { FileConfig } from './configs/FileConfig';
import { enumToArray } from '../../../../commons/utils/enum-to-array';

function Config({
  type, config, path,
}: {
  type: RedirectType;
  config;
  path: string;
}) {
  switch (type) {
    case RedirectType.file:
      return <FileConfig config={config} path={path} />;
    case RedirectType.reverse_proxy:
      return <ReverseProxy config={config} path={path} />;
    default:
      return <></>;
  }
}

const types = enumToArray(RedirectType);

export function BranchRedirectForm({
  index, redirect, remove, className,
}: {
  index: number;
  redirect: BranchRedirect;
  remove: () => void;
  className?;
}) {
  const {
    register, errors, getValues, watch,
  } = useFormContext<BranchRedirectsFormData>();
  const input = `redirects[${index}]`;
  const input_type = `${input}.type`;
  const input_name = `${input}.path`;

  const type = watch(input_type);

  return (
    <div className={classNames('card', className)}>
      <div className="card-header d-flex justify-content-between">
        <div>
          <strong>{redirect.url || 'New redirect'}</strong>
          {redirect.url && (
            <ExternalLink
              className="ml-2"
              href={redirect.url}
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </ExternalLink>
          )}
        </div>
        <ButtonIcon onClick={remove}>
          <FontAwesomeIcon icon={faTimes} />
        </ButtonIcon>
      </div>
      <div className="card-body">
        <div className="form-group">
          <label htmlFor={input_type} className="form-label">Type</label>
          <select
            id={input_type}
            name={input_type}
            ref={register({
              required,
            })}
            className="custom-select"
            defaultValue={redirect?.type}
          >
            {types.map(val => (
              <option value={val} key={val}>
                {val}
              </option>
            ))}
          </select>
          <InputError error={errors} path={input_type} />
        </div>
        <div className="form-group">
          <label htmlFor={input_name}>
            Path
          </label>
          <input
            type="text"
            id={input_name}
            name={input_name}
            ref={register({
              required,
              maxLength: maxLength(),
              pattern: /^\//,
              validate: value => {
                const count = getValues().redirects?.filter(val => val.path === value)?.length || 0;
                return count <= 1 ? undefined : 'Branch name must be unique';
              },
            })}
            className="form-control"
            placeholder="/env.json"
            defaultValue={redirect?.path}
          />
          <small className="form-text">
            You can use wildcards as described
            {' '}
            <ExternalLink href="https://caddyserver.com/docs/json/apps/http/servers/routes/match/path/">here</ExternalLink>
          </small>
          <InputError error={errors} path={input_name} />
        </div>

        <Config
          type={type as RedirectType}
          config={redirect.config}
          path={`${input}.config`}
        />
      </div>
    </div>
  );
}
