import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { maxLength, required } from '../../../commons/components/forms/form-constants';
import { InputError } from '../../../commons/components/forms/InputError';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { axios } from '../../../providers/axios';
import { useAuth } from '../../../providers/AuthProvider';
import { Button } from '../../../commons/components/Button';

interface FormData {
  user: string;
  password: string;
}

function useSignIn() {
  const [loading, setLoading] = useMountedState(false);
  const { fetchUser } = useAuth();

  const signIn = (formData: FormData) => {
    setLoading(true);
    axios
      .post<void>(`/auth/in-memory`, formData)
      .then(() => {
        fetchUser();
      })
      .catch(err => {
        toast.error(`Could not sign in: ${err}`);
      })
      .finally(() => setLoading(false));
  };

  return {
    signIn,
    loading,
  };
}

export function SignInWithUserPassword({ className }: {
  className?;
}) {
  const {
    register, errors, handleSubmit, formState: { isDirty },
  } = useForm();
  const { loading, signIn } = useSignIn();

  return (
    <form
      onSubmit={handleSubmit(signIn)}
      className={classNames(className)}
    >
      <div className="form-group">
        <label htmlFor="user">User</label>
        <input
          type="text"
          id="user"
          name="user"
          ref={register({
            required,
            maxLength: maxLength(),
          })}
          className="form-control"
          autoComplete="off"
        />
        <InputError error={errors} path="user"/>
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          ref={register({
            required,
            maxLength: maxLength(),
          })}
          className="form-control"
          autoComplete="off"
        />
        <InputError error={errors} path="password"/>
      </div>
      <Button
        type="submit"
        className="btn btn-primary w-100"
        loading={loading}
        disabled={!isDirty}
      >
        Sign in
      </Button>
    </form>
  );
}
