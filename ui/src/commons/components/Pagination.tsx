import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import qs from 'qs';
import styles from './Pagination.module.scss';
import { queryParams } from '../../utils/query-params';
import { routerHistory } from '../../providers/history';

export interface PaginationData {
  page?: number;
  size?: number;
}

export function defaultPagination(): PaginationData {
  return {
    size: 10,
    page: 0,
  };
}

export function getPagination(): PaginationData {
  const query = queryParams();
  return {
    page: parseInt(query.page, 10) || 0,
    size: parseInt(query.size, 10) || 10,
  };
}

const sizes = [5, 10, 15, 20].map(v => ({
  value: v, label: `size ${v}`,
}));

export function Pagination({
  totalItems,
  pagination,
  setPagination,
}: {
  totalItems: number;
  pagination: PaginationData;
  setPagination: (data: PaginationData) => void;
}) {
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>();

  useEffect(() => {
    setPage(pagination.page);
    setSize(pagination.size);
  }, [pagination]);

  useEffect(() => {
    routerHistory.push({
      pathname: routerHistory.location.pathname,
      search: qs.stringify({
        page, size,
      }, {
        addQueryPrefix: true,
      }),
    });
  }, [page, size]);

  const totalPages = Math.ceil(totalItems / size);

  const goToFirst = () => setPagination({
    ...pagination,
    page: 0,
  });

  const goToPrevious = () => setPagination({
    ...pagination,
    page: page - 1,
  });

  const goToNext = () => setPagination({
    ...pagination,
    page: page + 1,
  });

  const goToLast = () => setPagination({
    ...pagination,
    page: totalPages - 1,
  });

  return (
    <nav className="d-flex align-items-center">
      <ul className="pagination mb-0">
        <li className={`page-item${page === 0 ? ' disabled' : ''}`}>
          <button type="button" className="page-link" disabled={page === 0} onClick={goToFirst}>
            First
          </button>
        </li>
        <li className={`page-item${page === 0 ? ' disabled' : ''}`}>
          <button type="button" className="page-link" disabled={page === 0} onClick={goToPrevious}>
            Previous
          </button>
        </li>
        <li className="page-item">
          <span className="page-link">
            {/* {page * size}-{(page + 1) * size} */}
            {/* {totalItems ? `/ ${totalItems}` : ''} */}
            {/* | */}
            {page + 1}
            {totalPages ? ` / ${totalPages}` : ''}
          </span>
        </li>
        <li className={`page-item${page + 1 === totalPages ? ' disabled' : ''}`}>
          <button type="button" className="page-link" disabled={page + 1 === totalPages} onClick={goToNext}>
            Next
          </button>
        </li>
        <li className={`page-item${page + 1 === totalPages ? ' disabled' : ''}`}>
          <button type="button" className="page-link" disabled={page + 1 === totalPages} onClick={goToLast}>
            Last
          </button>
        </li>
      </ul>
      <Select
        options={sizes}
        value={sizes.find(s => s.value === size)}
        onChange={val => setSize((val as any).value)}
        className={`${styles['size-select']} ml-3`}
      />
    </nav>
  );
}
