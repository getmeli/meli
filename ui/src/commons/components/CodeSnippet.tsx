import { highlightElement } from 'prismjs';
// languages
import 'prismjs/components/prism-json.min';
import 'prismjs/components/prism-shell-session.min';
import 'prismjs/components/prism-typescript.min';
import 'prismjs/components/prism-yaml.min';
// plugins
import 'prismjs/plugins/toolbar/prism-toolbar.css';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min';
import 'prismjs/plugins/show-language/prism-show-language.min';
import 'prismjs/plugins/line-numbers/prism-line-numbers.min';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './CodeSnippet.module.scss';

export function CodeSnippet({
  language,
  className,
  children,
  lineNumbers,
}: {
  language?: 'json' | 'yaml' | 'typescript' | 'shell';
  className?: string;
  children?: any;
  lineNumbers?: boolean;
}) {
  const [elRef, setElRef] = useState<HTMLElement>();

  useEffect(() => {
    if (elRef && setElRef) {
      highlightElement(elRef);
    }
  }, [elRef, setElRef, children]);

  return (
    <div className={classNames(styles.container, className)}>
      <pre className={lineNumbers ? 'line-numbers' : ''}>
        <code
          ref={setElRef}
          className={classNames(styles.code, {
            [`language-${language}`]: !!language,
          })}
        >
          {children}
        </code>
      </pre>
    </div>
  );
}
