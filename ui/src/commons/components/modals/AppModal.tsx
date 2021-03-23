import React, { useEffect } from 'react';
import Modal from 'react-modal';
import classNames from 'classnames';
import styles from './AppModal.module.scss';

export type AppModalProps = {
  isOpen: boolean;
  title?: string;
  children: any;
  footer?: any;
  closeModal?: (...args: string[]) => void;
  className?: string;
  [key: string]: any;
};

const blurElId = 'blur-overlay';

function blurBackground() {
  document.getElementById(blurElId).setAttribute('data-blur', 'true');
}

function unblurBackground() {
  document.getElementById(blurElId).removeAttribute('data-blur');
}

export function AppModal({
  title,
  children,
  isOpen,
  closeModal,
  className,
  footer,
  ...otherProps
}: AppModalProps) {
  const close = () => {
    unblurBackground();
    if (closeModal) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isOpen) {
      blurBackground();
    } else {
      unblurBackground();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      className={classNames(styles.container, className)}
      overlayClassName={styles.overlay}
      {...otherProps}
    >
      {children}
    </Modal>
  );
}
