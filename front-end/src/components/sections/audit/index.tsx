/* eslint-disable indent */
import React from 'react';

import { Separator } from '@radix-ui/react-select';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import useSelectedChainStore from '@/store/selected-chain';
import useSCIterStore from '@/store/smart-contract-iter';

import SectionContainer from '../container';
import DownloadPDFButton from './pdf-report/download-report-button';

type SeverityLevel = 'Low' | 'Medium' | 'High';

interface ObjectWithSeverity {
  severity: SeverityLevel;
}

export default function AuditSection() {
  const selectedChain = useSelectedChainStore((store) => store.selectedChain);
  const auditResponse = useSCIterStore((store) => store.auditSC.auditingOutput);

  let lowSeverityCount = 0;
  let mediumSeverityCount = 0;
  let highSeverityCount = 0;
  let auditScore = 100;

  /* 
    If auditResponse is STRING, it means the AUDITING SERVICE returned an error;
    If auditResponse is EMPTY, it means there are no AUDITS (the AUDITING SERVICE returned an EMPTY object)
  */
  if (
    typeof auditResponse !== 'string' &&
    Array.isArray(auditResponse) &&
    auditResponse.length > 0
  ) {
    lowSeverityCount = auditResponse
      .filter((response) => isValidSeverityKey(response.severity))
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((accumulator, currentAudit) => {
        return currentAudit.severity === 'Low' ? accumulator + 1 : accumulator;
      }, 0);

    mediumSeverityCount = auditResponse
      .filter((response) => isValidSeverityKey(response.severity))
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((accumulator, currentAudit) => {
        return currentAudit.severity === 'Medium' ? accumulator + 1 : accumulator;
      }, 0);

    highSeverityCount = auditResponse
      .filter((response) => isValidSeverityKey(response.severity))
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((accumulator, currentAudit) => {
        return currentAudit.severity === 'High' ? accumulator + 1 : accumulator;
      }, 0);

    auditScore = calculateAuditScore(
      auditResponse
        .filter((response) => isValidSeverityKey(response.severity))
        .map((response) => {
          return {
            severity: response.severity as SeverityLevel
          };
        })
    );
  }

  console.log('AUDIT SCORE', auditScore);

  return (
    <SectionContainer className='flex flex-col items-start justify-between gap-y-10 px-10 py-12 backdrop-blur-md'>
      <div className='flex w-full items-start justify-between'>
        <div className='flex flex-col'>
          <h2 className='mb-2 text-3xl font-semibold'>Smart Contract Audit</h2>
          <h3 className='text-lg'>Get to know how&apos;s your {selectedChain} Smart Contract </h3>
        </div>

        {/* 
          If auditResponse is STRING, it means the AUDITING SERVICE returned an error;
          If auditResponse is EMPTY, it means there are no AUDITS (the AUDITING SERVICE returned an EMPTY object)
        */}
        {typeof auditResponse === 'string' ||
        (Array.isArray(auditResponse) && auditResponse.length === 0) ? (
          <></>
        ) : (
          <DownloadPDFButton auditResponse={auditResponse} />
        )}
      </div>

      <div className='flex h-64 w-full gap-x-2.5'>
        <Card className='h-full w-1/3'>
          <CardHeader className='relative h-24'>
            <CardTitle>Audit score</CardTitle>

            <Progress
              value={auditScore}
              max={100}
              className={cn('w-full', {
                '[&>div]:bg-red-400': auditScore < 35,
                '[&>div]:bg-yellow-400': auditScore >= 35 && auditScore < 65,
                '[&>div]:bg-green-400': auditScore >= 65
              })}
            />

            <span className='absolute -bottom-0 right-6'>{auditScore} %</span>
          </CardHeader>

          <Separator className='mt-2.5 h-[1px] w-full bg-border' />

          <div className='flex flex-col justify-between gap-y-1.5 p-6'>
            <div className='flex justify-between'>
              <p>Low severity:</p>
              <p className='font-bold'>{lowSeverityCount}</p>
            </div>

            <div className='flex justify-between'>
              <p>Medium severity:</p>
              <p className='font-bold'>{mediumSeverityCount}</p>
            </div>

            <div className='flex justify-between'>
              <p>High severity:</p>
              <p className='font-bold'>{highSeverityCount}</p>
            </div>
          </div>
        </Card>

        <Card className='h-full w-2/3 overflow-hidden'>
          <CardHeader className='h-24'>
            <CardTitle>Risk factors</CardTitle>
          </CardHeader>

          <Separator className='mt-2.5 h-[1px] w-full bg-border' />

          <div className='flex h-2/3 flex-col justify-between gap-y-1.5 overflow-scroll p-6'>
            {typeof auditResponse === 'string' ||
            (Array.isArray(auditResponse) && auditResponse.length === 0) ? (
              <p>No relevant risks to show.</p>
            ) : (
              <>
                {auditResponse.map((audit, index) => (
                  <div key={`${audit.title}-${index}`} className='flex justify-between'>
                    <p>{audit.title}</p>
                    <p
                      className={cn('font-bold uppercase', {
                        'text-red-400': audit.severity === 'High',
                        'text-yellow-400': audit.severity === 'Medium',
                        'text-green-400': audit.severity === 'Low'
                      })}
                    >
                      {audit.severity}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        </Card>
      </div>
    </SectionContainer>
  );
}

function isValidSeverityKey(severity: string): severity is SeverityLevel {
  return ['Low', 'Medium', 'High'].includes(severity);
}

function calculateAuditScore(auditResponse: ObjectWithSeverity[]) {
  const severityValue: { [key in SeverityLevel]: number } = {
    Low: 1,
    Medium: 2,
    High: 3
  };

  const severityOccurrences: { [key in SeverityLevel]: number } = {
    Low: 0,
    Medium: 0,
    High: 0
  };

  for (const object of auditResponse) {
    severityOccurrences[object.severity]++;
  }

  const totalScore = auditResponse.reduce(
    (accumulator, object) =>
      accumulator + severityValue[object.severity] / severityOccurrences[object.severity],
    0
  );

  const maxScore = Object.values(severityOccurrences).reduce(
    (accumulator, value) => accumulator + value * 3,
    0
  );

  return Number(((totalScore / maxScore) * 100).toFixed(2));
}
