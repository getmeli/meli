import ReactMarkdown from 'react-markdown';
import React, { useEffect, useState } from 'react';
import md from './terms-of-service.md';
import { axios } from '../../providers/axios';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { useMountedState } from '../../commons/hooks/use-mounted-state';

export default function TermsOfService() {
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [content, setContent] = useState();

  useEffect(() => {
    axios
      .get(md)
      .then(({ data }) => data)
      .then(setContent)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [setLoading]);

  return loading ? (
    <Loader />
  ) : error ? (
    <AlertError error={error} />
  ) : (
    <ReactMarkdown>{content}</ReactMarkdown>
  );
}
