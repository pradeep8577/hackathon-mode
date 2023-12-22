import React from 'react';

import { pdf } from '@react-pdf/renderer';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import IAuditResponse from '@/interfaces/audit-response';

import PDFReport from '.';

const PDF_FILE_NAME = 'DeFi Builder - Smart contract audit.pdf';

interface IDownloadPDFButton {
  auditResponse: IAuditResponse[];
}

export default function DownloadPDFButton({ auditResponse }: IDownloadPDFButton) {
  const { toast } = useToast();

  async function generatePDF() {
    const blobPDF = await pdf(<PDFReport auditResponse={auditResponse} />).toBlob();
    const url = URL.createObjectURL(blobPDF);

    const temporaryAnchor = document.createElement('a');
    temporaryAnchor.href = url;
    temporaryAnchor.setAttribute('download', PDF_FILE_NAME);

    document.body.append(temporaryAnchor);

    temporaryAnchor.click();

    temporaryAnchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      onClick={() => {
        generatePDF();

        toast({
          title: 'Success',
          description: 'Smart Contract Audit downloaded successfully!'
        });
      }}
    >
      Download Audit
    </Button>
  );
}
