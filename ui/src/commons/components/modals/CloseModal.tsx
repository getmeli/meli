import React from 'react';
import classNames from 'classnames';
import styles from './CloseModal.module.scss';
import { KeyboardShortcut } from '../KeyboardShortcut';

export function CloseModal({ onClick, className }: { onClick; className? }) {
  return (
    <div className={classNames(styles.container, className)} onClick={onClick}>
      <div>Press</div>
      <KeyboardShortcut className="ml-2 mr-2">
        esc
      </KeyboardShortcut>
      <div>to close</div>
    </div>
  );
}
