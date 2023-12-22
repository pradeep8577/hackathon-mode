import React from 'react';

import { cn } from '@/lib/utils';

import IIconProperties from './icons-properties';

export default function DevelopmentIcon({ className }: IIconProperties) {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className={cn(className)}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M7.49961 10.8333C6.94961 11.1083 6.49128 11.5166 6.14961 12.025C5.95794 12.3166 5.95794 12.6833 6.14961 12.975C6.49128 13.4833 6.94961 13.8916 7.49961 14.1666'
        stroke='#4F4F4F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12.6758 10.8333C13.2258 11.1083 13.6841 11.5166 14.0258 12.025C14.2174 12.3166 14.2174 12.6833 14.0258 12.975C13.6841 13.4833 13.2258 13.8916 12.6758 14.1666'
        stroke='#4F4F4F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7.49984 18.3334H12.4998C16.6665 18.3334 18.3332 16.6667 18.3332 12.5V7.50002C18.3332 3.33335 16.6665 1.66669 12.4998 1.66669H7.49984C3.33317 1.66669 1.6665 3.33335 1.6665 7.50002V12.5C1.6665 16.6667 3.33317 18.3334 7.49984 18.3334Z'
        stroke='#4F4F4F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M1.85889 6.67502L17.8756 6.66669'
        stroke='#4F4F4F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
