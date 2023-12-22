import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import { Skeleton } from './ui/skeleton';

interface IImage extends React.ImgHTMLAttributes<HTMLImageElement> {}

export default function Image({ src, alt, className, ...properties }: IImage) {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <Skeleton className={cn('rounded-full', className)} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-full', className)}
      loading='lazy'
      onLoad={() => setIsLoading(false)}
      {...properties}
    />
  );
}
