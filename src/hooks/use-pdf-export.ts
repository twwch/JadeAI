'use client';

import { useState, useCallback } from 'react';
import type { Resume } from '@/types/resume';

export interface PdfExportOptions {
  pageSize?: 'A4' | 'LETTER';
  margins?: { top: number; right: number; bottom: number; left: number };
  watermark?: boolean;
  watermarkText?: string;
  headerText?: string;
  footerText?: string;
}

export function usePdfExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportPdf = useCallback(async (resume: Resume, options?: PdfExportOptions) => {
    setIsExporting(true);
    try {
      // Dynamic import to avoid SSR issues with @react-pdf/renderer
      const [{ pdf }, { ResumePdfDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/preview/resume-pdf-document'),
      ]);

      const { createElement } = await import('react');
      const doc = createElement(ResumePdfDocument, { resume, options });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(doc as any).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.title || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportPdf, isExporting };
}
