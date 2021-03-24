import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { ReactState } from '../types/react-state';

export function useMountedState<T>(initialValue?: T): ReactState<T> {
  const mounted = useRef(true);
  const [loading, _setLoading] = useState<T>(initialValue);

  useEffect(() => () => {
    mounted.current = false;
  }, []);

  const setLoading = useCallback((val: T) => {
    if (mounted && mounted.current) {
      _setLoading(val);
    }
  }, [mounted]);

  return [loading, setLoading];
}
