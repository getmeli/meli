import React, { createContext, useContext } from 'react';

interface HookContext {
  context: string;
}

const Context = createContext<HookContext>(undefined);

export const useHookContext = () => useContext(Context);

export function HookProvider({ context, ...props }: {
  context: string;
  [prop: string]: any;
}) {
  return (
    <Context.Provider
      value={{
        context,
      }}
      {...props}
    />
  );
}
