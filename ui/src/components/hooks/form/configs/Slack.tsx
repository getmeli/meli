import { useFormContext } from 'react-hook-form';
import React, { useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { maxLength, required } from '../../../../commons/components/forms/form-constants';
import { InputError } from '../../../../commons/components/forms/InputError';
import { Hint } from '../../../../commons/components/Hint';
import styles from './Slack.module.scss';
import { ExternalLink } from '../../../../commons/components/ExternalLink';
import { CardModal } from '../../../../commons/components/modals/CardModal';

function Video({ className }: { className? }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Hint
        onClick={() => setIsOpen(true)}
        className={classNames('cursor-pointer', className)}
      >
        Click to view how to get this URL
      </Hint>
      <CardModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        className={styles.modal}
      >
        <video
          src="/assets/get-slack-webhook-url.mp4"
          autoPlay
          loop
          className={styles.video}
        />
      </CardModal>
    </>
  );
}

export function Slack() {
  const { register, errors } = useFormContext();
  const input_url = 'config.url';
  return (
    <div className="form-group">
      <div className="d-flex justify-content-between align-items-start">
        <label
          htmlFor={input_url}
          className="form-label d-flex align-items-center"
        >
          Slack URL
          <Video className="ml-2" />
        </label>
        <ExternalLink href="https://api.slack.com/apps?new_app=1">
          Create slack app
          <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
        </ExternalLink>
      </div>
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
      <div className="mt-3" />
    </div>
  );
}
