import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { Toggle } from '../../../commons/components/forms/Toggle';
import { CardModal } from '../../../commons/components/modals/CardModal';
import { Button } from '../../../commons/components/Button';
import { InputError } from '../../../commons/components/forms/InputError';
import { maxLength, required } from '../../../commons/components/forms/form-constants';
import { axios } from '../../../providers/axios';
import { randomString } from '../../../commons/utils/random-string';
import { Site } from '../site';

interface FormData {
  password: string;
}

export function SitePassword({
  site, onChange, className,
}: {
  site: Site;
  onChange: (site: Site) => void;
  className?;
}) {
  const [randomSecret, setRandomSecret] = useState(randomString(16));

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    setRandomSecret(randomString(16));
  }, [isOpen]);

  const {
    register, errors, handleSubmit,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const [loading, setLoading] = useState(false);

  const setPassword = (formData: FormData) => {
    setLoading(true);
    axios
      .put<Site>(`/api/v1/sites/${site._id}/password`, formData)
      .then(({ data }) => {
        onChange(data);
        closeModal();
      })
      .catch(err => {
        toast.error(`Could not set site password: ${err}`);
      })
      .finally(() => setLoading(false));
  };

  const removePassword = () => {
    setLoading(true);
    axios
      .delete<Site>(`/api/v1/sites/${site._id}/password`)
      .then(({ data }) => onChange(data))
      .catch(err => {
        toast.error(`Could not remove site password: ${err}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Toggle
        value={!!site.hasPassword}
        onChange={() => (site.hasPassword ? removePassword() : openModal())}
        loading={site.hasPassword && loading}
        className={classNames(className, 'w-100 font-weight-bold')}
      >
        Password protection
        {' '}
        {site.hasPassword && (
          <>
            {' '}
            (user name is
            {' '}
            <code>user</code>
            )
          </>
        )}
      </Toggle>
      <CardModal isOpen={isOpen} closeModal={closeModal} title="Set site password">
        <form onSubmit={handleSubmit(setPassword)}>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="text"
              id="password"
              name="password"
              ref={register({
                required,
                maxLength: maxLength(),
              })}
              className="form-control"
              placeholder="please-let-me-in"
              autoComplete="off"
              defaultValue={randomSecret}
            />
            <InputError error={errors} path="password"/>
          </div>
          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              className="btn btn-primary"
              loading={loading && !site.hasPassword}
            >
              Save
            </Button>
          </div>
        </form>
      </CardModal>
    </>
  );
}
