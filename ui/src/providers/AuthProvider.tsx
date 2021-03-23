import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { axios } from './axios';
import { Loader } from '../commons/components/Loader';
import { FullPageCentered } from '../commons/components/FullPageCentered';

export interface User {
  _id: string;
  authType: string;
  name: string;
  email: string;
}

export interface Auth {
  initialized: boolean;
  loading: boolean;
  fetchUser: () => void;
  user: User;
  setUser: (user: User) => undefined;
  signOut: () => void;
}

export const AuthContext = createContext<Auth>(undefined);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider(props) {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();

  const signOut = useCallback(() => {
    axios
      .post(`/auth/signout`)
      .then(() => setUser(null))
      // force app to reset (TODO graceful logout)
      .then(() => {
        window.location.href = '/';
      })
      .catch(err => {
        toast.error(`Could not sign out properly: ${err}`);
      });
  }, []);

  const fetchUser = useCallback(() => {
    setLoading(true);
    axios
      .get(`/api/v1/user`)
      .then(({ data }) => setUser(data))
      .catch(err => {
        toast.error(`Could not get user: ${err}`);
        setUser(null);
      })
      .finally(() => {
        setInitialized(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    !initialized ? (
      <FullPageCentered>
        <p>
          Loading auth
          <Loader className="ml-2"/>
        </p>
      </FullPageCentered>
    ) : (
      <AuthContext.Provider
        value={{
          initialized,
          loading,
          fetchUser,
          user,
          setUser,
          signOut,
        }}
        {...props}
      />
    )
  );
}
