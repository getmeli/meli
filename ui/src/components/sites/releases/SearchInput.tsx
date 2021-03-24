import React, { useEffect, useRef } from 'react';
import { Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, filter,
} from 'rxjs/operators';
import classNames from 'classnames';
import { Loader } from '../../../commons/components/Loader';
import styles from './Search.module.scss';

// TODO search icon with expandable input
export function SearchInput({
  search, setSearch, loading, placeholder, className,
}: {
  search: string;
  setSearch: (val: string) => void;
  loading: boolean;
  placeholder?: string;
  className?: any;
}) {
  const search$ = useRef(new Subject<string>());

  useEffect(() => {
    const subscription = search$.current
      .pipe(
        filter(value => !value || value.length >= 3),
        debounceTime(200),
        distinctUntilChanged(),
      )
      .subscribe({
        next: setSearch,
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSearch]);

  return (
    <div className={classNames('d-flex justify-content-center position-relative', className)}>
      <input
        type="text"
        className="form-control"
        onChange={e => search$.current.next(e.target.value)}
        placeholder={placeholder || 'Search...'}
        defaultValue={search}
      />
      {loading && (
        <div className={styles.loader}>
          <Loader />
        </div>
      )}
    </div>
  );
}
