import React from 'react';

import { Heart } from 'lucide-react';

import Link from './anchor';

export default function Footer() {
  return (
    <footer className='flex items-center justify-center border-t border-border p-3 text-sm'>
      <p className='inline-flex items-center justify-center gap-x-1.5'>
        Made with <Heart className='h-4 w-4 text-red-500' /> by the
        <Link href='https://defibuilder.com'>DeFi Builder</Link> team
      </p>
    </footer>
  );
}
