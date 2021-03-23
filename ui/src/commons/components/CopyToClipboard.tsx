import React, { useRef, useState } from 'react';
import { uniqueId } from 'lodash';
import copy from 'copy-to-clipboard';
import classNames from 'classnames';
import { Tooltip, tooltipToggle } from './Tooltip';
import styles from './CopyToClipboard.module.scss';

export function CopyToClipboard({
  value, children, delayHide = 2000, blur, className,
}: {
  value;
  children;
  delayHide?: number;
  blur?: boolean;
  className?;
}) {
  const [uid] = useState(uniqueId());
  const [copied, setCopied] = useState<boolean>(false);
  const timeout = useRef<any>();

  const copyToClipboard = () => {
    copy(value);
    setCopied(true);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, delayHide);
  };

  return (
    <>
      <div
        {...tooltipToggle(uid)}
        className={classNames(className, styles.container, {
          [styles.blur]: blur,
        })}
        onClick={copyToClipboard}
      >
        {children}
      </div>
      <Tooltip id={uid}>
        {copied ? 'Copied' : 'Copy to clipboard'}
      </Tooltip>
    </>
  );
}
