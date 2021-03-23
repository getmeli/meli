import React from 'react';

export function ExternalLink({
  href, className, children, onClick,
}: {
  href: string;
  className?;
  children;
  onClick?;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {children}
    </a>
  );
}
