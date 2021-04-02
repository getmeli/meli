import { useState } from 'react';

function readFromStorage(key: string): any {
  try {
    const item = localStorage.getItem(key);
    return JSON.parse(item);
  } catch (e) {
    console.log(`Could not read ${key} from local storage`, e);
    return undefined;
  }
}

function writeToStorage(key: string, value: any): void {
  try {
    const val = JSON.stringify(value);
    localStorage.setItem(key, val);
  } catch (e) {
    console.log(`Could not write ${key} to local storage`, value, e);
  }
}

function storageHasKey(key: string): boolean {
  return !!localStorage.getItem(key);
}

function init(key: string, value: any): any {
  if (storageHasKey(key)) {
    return readFromStorage(key);
  }
  writeToStorage(key, value);
  return value;
}

export function useLocalStorage<T>(key: string, initialValue?: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(init(key, initialValue));

  const setValueProxy = (newValue: T) => {
    setValue(newValue);
    writeToStorage(key, newValue);
  };

  return [value, setValueProxy];
}
