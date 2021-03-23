import React from 'react';
import classNames from 'classnames';
import { AppModal } from './AppModal';
import styles from './CardModal.module.scss';
import { CloseModal } from './CloseModal';

export type AppModalProps = {
  isOpen: boolean;
  title?: string;
  children: any;
  footer?: any;
  closeModal?: (...args: string[]) => void;
  className?: string;
  [key: string]: any;
};

export function CardModal({
  title,
  children,
  isOpen,
  closeModal,
  className,
  footer,
  ...otherProps
}: AppModalProps) {
  return (
    <AppModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className={className}
      {...otherProps}
    >
      <div className={classNames('card', styles.card)}>
        <div className="card-header d-flex align-items-center justify-content-between">
          <strong className="mr-5">{title}</strong>
          <CloseModal onClick={closeModal} />
        </div>

        <div className={`card-body ${styles.content}`}>{children}</div>
        {footer && <div className="card-footer">{footer}</div>}
      </div>
    </AppModal>
  );
}
