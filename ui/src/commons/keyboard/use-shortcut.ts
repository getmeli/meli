import { useEffect } from 'react';

export function onShortcutKey(letter: string, callback: () => any): (event: KeyboardEvent) => void {
  const listener = (ev: KeyboardEvent) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toUpperCase() === letter) {
      ev.preventDefault();
      callback();
    }
  };
  document.addEventListener('keydown', listener);

  return listener;
}

export function useShortcut(letter: string, callback: () => any) {
  useEffect(() => {
    const listener = onShortcutKey(letter, callback);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [letter, callback]);
}
