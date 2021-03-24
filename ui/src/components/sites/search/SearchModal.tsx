import React, { useEffect, useRef, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { toast } from 'react-toastify';
import styles from './SearchModal.module.scss';
import { routerHistory } from '../../../providers/history';
import { Loader } from '../../../commons/components/Loader';
import { SiteCard } from '../SiteCard';
import { CardModal } from '../../../commons/components/modals/CardModal';
import { useSites } from '../use-sites';

export function SearchModal({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) {
  const search$ = useRef(new BehaviorSubject(''));
  const [searchInputRef, setSearchInputRef] = useState<HTMLInputElement>();

  const { loading, error, data: sites, cb: listSites } = useSites();

  useEffect(() => {
    if (isOpen) {
      const subs = search$.current
        .pipe(
          filter(value => !value || value.length >= 3),
          debounceTime(200),
          distinctUntilChanged(),
        )
        .subscribe(value => {
          listSites({
            search: value || undefined,
            page: 0,
            size: 10,
          });
        });
      return () => subs.unsubscribe();
    }
  }, [search$, isOpen, listSites]);

  useEffect(() => {
    if (error) {
      toast.error(`Could not search sites: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (isOpen) {
      if (searchInputRef) {
        searchInputRef.focus();
      }
    }
  }, [isOpen, searchInputRef]);

  const onItemClick = site => {
    routerHistory.push(`/sites/${site._id}`);
    closeModal();
  };

  return (
    <CardModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className={styles.search}
      title="Search"
    >
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-center position-relative">
              <input
                type="text"
                ref={setSearchInputRef}
                className="form-control"
                onChange={e => search$.current.next(e.target.value)}
                placeholder="Search sites"
              />
              {loading && (
                <div className={styles.loader}>
                  <Loader />
                </div>
              )}
            </div>
            {sites && (
              <div className="mt-3">
                {sites.items.length === 0 && (
                  <strong>No results</strong>
                )}
                <TransitionGroup>
                  {sites.items.length !== 0 && sites.items.map(site => (
                    <CSSTransition key={site._id} timeout={500} classNames="fade-down">
                      <div className="mb-2" onClick={() => onItemClick(site)}>
                        <SiteCard site={site} className="bg-light" />
                      </div>
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardModal>
  );
}
