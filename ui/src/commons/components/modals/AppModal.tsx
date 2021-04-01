import React, { useEffect } from 'react';
import Modal from 'react-modal';
import classNames from 'classnames';
import styles from './AppModal.module.scss';
import { useBlur } from '../../../providers/BlurProvider';

export type AppModalProps = {
  isOpen: boolean;
  title?: string;
  children: any;
  footer?: any;
  closeModal?: (...args: string[]) => void;
  className?: string;
  [key: string]: any;
};

export function AppModal({
  title,
  children,
  isOpen,
  closeModal,
  className,
  footer,
  ...otherProps
}: AppModalProps) {
  const { blur, unblur } = useBlur();

  const close = () => {
    if (closeModal) {
      closeModal();
      unblur();
    }
  };

  // TODO for some strange reason, isOpen goes to false and unblur is called
  //   this is why modal blur is broken
  useEffect(() => {
    if (isOpen) {
      blur();
    } else {
      unblur();
    }
  }, [isOpen, blur, unblur]);

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
