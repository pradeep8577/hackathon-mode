/* eslint-disable unicorn/prevent-abbreviations */

import React, { PropsWithChildren } from 'react';

import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

interface ILink extends PropsWithChildren, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export default function Anchor({
  href,
  className,
  children,
  rel = 'noopener noreferrer',
  target = '_blank',
  ...properties
}: ILink) {
  return (
    <Link
      to={href}
      rel={rel}
      target={target}
      className={cn('transition-colors', className)}
      {...properties}
    >
      {children}
    </Link>
  );
}
