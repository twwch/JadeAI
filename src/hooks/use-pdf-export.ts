'use client';

import { useState, useCallback } from 'react';

export function usePdfExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportPdf = useCallback(async (resumeId: string, title?: string) => {
    setIsExporting(true);
    try {
      const fingerprint = localStorage.getItem('jade_fingerprint');
      const res = await fetch(`/api/resume/${resumeId}/export?format=pdf`, {
        headers: {
          ...(fingerprint ? { 'x-fingerprint': fingerprint } : {}),
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'PDF export failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportPdf, isExporting };
}
