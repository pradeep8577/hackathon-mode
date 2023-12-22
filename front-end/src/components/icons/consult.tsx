import React from 'react';

import { cn } from '@/lib/utils';

import IIconProperties from './icons-properties';

export default function ConsultIcon({ className }: IIconProperties) {
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
        d='M5.83333 10C2.5 10 2.5 11.4917 2.5 13.3333V14.1667C2.5 16.4667 2.5 18.3333 6.66667 18.3333H13.3333C16.6667 18.3333 17.5 16.4667 17.5 14.1667V13.3333C17.5 11.4917 17.5 10 14.1667 10C13.3333 10 13.1 10.175 12.6667 10.5L11.8167 11.4C10.8333 12.45 9.16667 12.45 8.175 11.4L7.33333 10.5C6.9 10.175 6.66667 10 5.83333 10Z'
        stroke='#4F4F4F'
        strokeWidth='1.5'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M15.8332 10V5.00002C15.8332 3.15835 15.8332 1.66669 12.4998 1.66669H7.49984C4.1665 1.66669 4.1665 3.15835 4.1665 5.00002V10'
        stroke='#4F4F4F'
        strokeWidth='1.5'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8.79248 7.69208H11.5675'
        stroke='#4F4F4F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8.10059 5.19208H12.2673'
        stroke='#4F4F4F'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
