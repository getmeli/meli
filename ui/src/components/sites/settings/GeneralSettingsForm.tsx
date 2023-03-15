import { useParams } from 'react-router-dom';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { useSite } from '../SiteView';
import { Site, SiteDomain } from '../site';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { axios } from '../../../providers/axios';
import styles from './SiteSettings.module.scss';
import { CopyToClipboard } from '../../../commons/components/CopyToClipboard';
import { SiteNameInput } from './SiteNameInput';
import { COLOR_PATTERN, required } from '../../../commons/components/forms/form-constants';
import { InputError } from '../../../commons/components/forms/InputError';
import { SelectMainBranch } from './SelectMainBranch';
import { Toggle } from '../../../commons/components/forms/Toggle';
import { DocsLink } from '../../../commons/components/DocsLink';
import { DomainForm } from './DomainForm';
import { Button } from '../../../commons/components/Button';
import { extractErrorMessage } from '../../../utils/extract-error-message';

interface Settings {
  name: string;
  color: string;
  domains: SiteDomain[];
}

export function GeneralSettingsForm() {
  const { siteId } = useParams<any>();
  const { site, setSite } = useSite();

  const methods = useForm<Settings>({
    mode: 'onChange',
  });
  const {
    errors, register, control, reset, handleSubmit, formState: { isDirty },
  } = methods;
  const domains = useFieldArray<SiteDomain>({
    control,
    name: 'domains',
  });

  useEffect(() => {
    if (site && reset) {
      reset(site);
    }
  }, [site, reset]);

  const [loading, setLoading] = useMountedState(false);

  const onSubmit = (updatedSite: Settings) => {
    setLoading(true);
    axios
      .put<Site>(`/api/v1/sites/${siteId}`, updatedSite)
      .then(({ data }) => data)
      .then(setSite)
      .then(() => toast.success('Site saved'))
      .catch(err => toast.error(`Could not update site: ${extractErrorMessage(err)}`))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >

          <div className="mt-4 card">
            <div className="card-header no-border d-flex justify-content-between">
              <strong>Site ID</strong>
              <CopyToClipboard value={site._id}>
                <code>{site._id}</code>
              </CopyToClipboard>
            </div>
          </div>

          <div className="mt-4 card">
            <div className="card-header">
              <strong>General</strong>
            </div>
            <div className="card-body">
              <SiteNameInput previousName={site.name}/>
              <div className="form-group">
                <label htmlFor="color" className="form-label">Color</label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  ref={register({
                    required,
                    pattern: COLOR_PATTERN,
                  })}
                  className="form-control"
                  autoComplete="off"
                  defaultValue="#000000"
                />
                <InputError error={errors} path="color"/>
              </div>

              <SelectMainBranch siteId={siteId}/>
            </div>
          </div>

          <div className="mt-4 card">
            <div className="card-header no-border">
              <Controller
                control={control}
                name="spa"
                render={({ value, onChange }) => (
                  <Toggle value={value} onChange={onChange} className="w-100">
                    <div className="d-flex justify-content-between flex-grow-1">
                      <strong>Single page application (SPA) mode</strong>
                      <DocsLink href="https://docs.meli.charlie-bravo.be/get-started/single-page-applications-spa" className="ml-2"/>
                    </div>
                  </Toggle>
                )}
                defaultValue={false}
              />
            </div>
          </div>

          <div className="mt-4 card">
            <div className="card-header">
              <strong>Domains</strong>
            </div>
            <div className="card-body">
              <div className={styles.domains}>
                {domains.fields.map((item, index) => (
                  <DomainForm
                    key={item.id}
                    item={item as SiteDomain}
                    index={index}
                    remove={() => domains.remove(index)}
                  />
                ))}
                <button
                  type="button"
                  className={classNames('mt-3', styles.add)}
                  onClick={() => domains.append({
                    exposeBranches: false,
                  })}
                >
                  Add domain
                </button>
              </div>
            </div>
          </div>

          <div className="form-group d-flex justify-content-end">
            {/* TODO use http://reactcommunity.org/react-transition-group/css-transition */}
            {isDirty && (
              <button
                type="button"
                className="mt-4 btn btn-outline-primary animate fadeIn"
                onClick={() => reset(site)}
              >
                Discard
              </button>
            )}
            <Button
              type="submit"
              className="mt-4 ml-3 btn btn-primary"
              loading={loading}
              disabled={!isDirty}
            >
              Save
            </Button>
          </div>

        </form>
      </FormProvider>
    </>
  );
}
