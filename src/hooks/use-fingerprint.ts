'use client';

import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { config } from '@/lib/config';

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (config.auth.enabled) {
      setIsLoading(false);
      return;
    }

    async function getFingerprint() {
      try {
        // Check localStorage first
        const stored = localStorage.getItem('jade_fingerprint');
        if (stored) {
          setFingerprint(stored);
          setIsLoading(false);
          return;
        }

        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;

        localStorage.setItem('jade_fingerprint', visitorId);
        setFingerprint(visitorId);
      } catch {
        // Fallback: generate a random ID
        const fallbackId = crypto.randomUUID();
        localStorage.setItem('jade_fingerprint', fallbackId);
        setFingerprint(fallbackId);
      } finally {
        setIsLoading(false);
      }
    }

    getFingerprint();
  }, []);

  return { fingerprint, isLoading };
}
