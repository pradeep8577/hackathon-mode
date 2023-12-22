import React from 'react';

import MultiversXIssueTokenForm from './_components/issue-token-form';

export default function MultiversXHomePage() {
  return (
    <div className='flex w-full max-w-[1200px] flex-col items-center justify-center gap-y-5'>
      <h1>MX HOMEPAGE</h1>

      <MultiversXIssueTokenForm />
    </div>
  );
}
