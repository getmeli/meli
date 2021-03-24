import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FullPageLoader } from '../commons/components/FullPageLoader';
import { AlertError } from '../commons/components/AlertError';

export interface Env {
  MELI_URL: string;
}

const Context = createContext<Env>(undefined as any);

export const useEnv = () => useContext(Context);

export function EnvProvider(props) {
  const [loading, setLoading] = useState(true);
  const [env, setEnv] = useState<Env>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    axios
      .get('/system/env')
      .then(({ data }) => {
        setEnv(data);
        console.log('backend env', data);
      })
      .finally(() => setLoading(false))
      .catch(err => setError(`Could not load backend env: ${err.toString()}`));
  }, []);

  return loading ? (
    <FullPageLoader/>
  ) : error ? (
    <AlertError error={error}/>
  ) : (
    <Context.Provider value={env} {...props} />
  );
}
