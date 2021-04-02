import React, { createContext, useContext, useState } from "react";
import styles from './BlurProvider.module.scss';
import classNames from 'classnames';

interface Context {
  isBlurred: boolean;
  blur: () => void;
  unblur: () => void;
}

const context = createContext(undefined);
export const useBlur = () => useContext<Context>(context);

export function BlurProvider({ children, ...props }) {
  const [enabled, setEnabled] = useState(false);
  return (
    <context.Provider
      value={{
        isBlurred: enabled,
        blur: () => setEnabled(true),
        unblur: () => setEnabled(false),
      }}
      {...props}
    >
      <div className={classNames({
        [styles.blur]: enabled,
      })}>
        {children}
      </div>
    </context.Provider>
  )
}
