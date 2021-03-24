import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import md from './cookie-policy.md';
import { axios } from '../../providers/axios';
import { Loader } from '../../commons/components/Loader';
import { AlertError } from '../../commons/components/AlertError';
import { useMountedState } from '../../commons/hooks/use-mounted-state';

export default function CookiePolicy() {
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
