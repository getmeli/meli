import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Site, SiteDomain } from '../../site';
import { useSite } from '../../SiteView';
import { axios } from '../../../../providers/axios';
import { useMountedState } from '../../../../commons/hooks/use-mounted-state';
import { useEnv } from '../../../../providers/EnvProvider';

interface Settings {
  name: string;
  color: string;
  domains: SiteDomain[];
}

export function BranchGeneralSettings() {
  const env = useEnv();
  const { siteId } = useParams();
  const { site, setSite } = useSite();

  const methods = useForm<Settings>({
    mode: 'onChange',
  });
  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (site && reset) {
      reset(site);
    }
  }, [site, reset]);

  const [, setLoading] = useMountedState(false);

  const onSubmit = (updatedSite: Settings) => {
    setLoading(true);
    axios
      .put<Site>(`${env.MELI_API_URL}/api/v1/sites/${siteId}`, updatedSite)
      .then(({ data }) => data)
      .then(setSite)
      .then(() => toast.success('Site saved'))
      .catch(err => toast.error(`Could not update site: ${err}`))
      .finally(() => setLoading(false));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* <div className="mt-4 card"> */}
        {/*  <div className="card-header no-border d-flex justify-content-between"> */}
        {/*    <strong>Current release</strong> */}
        {/*    <SelectMainBranch siteId={siteId} /> */}
        {/*  </div> */}
        {/* </div> */}

      </form>
    </FormProvider>
  );
}
