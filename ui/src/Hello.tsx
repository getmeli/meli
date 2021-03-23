import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './Hello.module.scss';

export function Hello({ label, hello }: {
  label: string;
  hello: () => void;
}) {
  const [counter, setCounter] = useState(0);

  const onLick = () => {
    setCounter(counter + 1);
    hello();
  };

  return (
    <>
      <button
        type="button"
        className={classNames('btn btn-primary', styles.button)}
        onClick={onLick}
      >
        {label}
        {' '}
        {counter}
      </button>
    </>
  );
}
