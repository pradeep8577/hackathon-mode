import React from 'react';

import defiBuilderLogo from '../assets/images/defi-builder-logo.png';

export default function Navbar() {
  return (
    <header className='fixed z-10 flex w-full items-center justify-center border-b border-border bg-background backdrop-blur-lg'>
      <nav className='flex w-full max-w-[1320px] items-center justify-between p-3 sm:p-5'>
        <img src={defiBuilderLogo} alt="DeFi Builder's logo" className='mr-[2px] h-4 sm:h-6' />
        <w3m-button />
      </nav>
    </header>
  );
}
