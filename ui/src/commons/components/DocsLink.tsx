import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './DocsLink.scss';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

export function DocsLink({ href, className }: {
  href: string;
  className?: string;
}) {
  return (
    <a
      className={classNames('docs-link', className)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      docs
      <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-1" />
    </a>
  );
}
