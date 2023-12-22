import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isClipboardApiSupported = !!(navigator.clipboard && navigator.clipboard.writeText);

export function copyToClipboard(smartContractCode: string) {
  navigator.clipboard.writeText(smartContractCode);
}
