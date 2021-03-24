import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useMountedState } from '../../../../commons/hooks/use-mounted-state';
import { axios } from '../../../../providers/axios';
import { Loader } from '../../../../commons/components/Loader';
import { AlertError } from '../../../../commons/components/AlertError';
import { Branch } from '../branch';
import { FormList } from './FormList';
import { Form, Release } from '../../releases/release';

function useBranchForms(
  siteId: string,
  branchId: string,
) {
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [forms, setForms] = useState<Form[]>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    axios
      .get<Branch>(`/api/v1/sites/${siteId}/branches/${branchId}`)
      .then(({ data }) => (
        axios.get<Release>(`/api/v1/releases/${data.release}`)
      ))
      .then(({ data }) => data.forms)
      .then(setForms)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [setLoading, siteId, branchId]);

  return {
    forms,
    setForms,
    error,
    loading,
  };
}

function useSetBranchForms(
  siteId: string,
  branchId: string,
  setForms: (forms: Form[]) => void,
) {
  const [loading, setLoading] = useMountedState(false);

  const updateForms = (forms: Form[]) => {
    setLoading(true);
    axios
      .get<Branch>(`/api/v1/sites/${siteId}/branches/${branchId}`)
      .then(({ data }) => (
        axios.put<Form[]>(`/api/v1/releases/${data.release}/forms`, {
          forms: forms || [],
        })
      ))
      .then(({ data }) => {
        setForms(data);
        toast.success('Saved forms');
      })
      .catch(err => {
        toast.error(`Could not save forms: ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    updateForms,
    loading,
  };
}

export function Forms() {
  const { siteId, branchId } = useParams<any>();
  const { forms, setForms, loading, error } = useBranchForms(siteId, branchId);
  const { loading: updating, updateForms } = useSetBranchForms(siteId, branchId, setForms);

  return loading ? (
    <Loader/>
  ) : error ? (
    <AlertError error={error}/>
  ) : (
    <FormList
      forms={forms}
      onSubmit={updateForms}
      submitting={updating}
    />
  );
}
