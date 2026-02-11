'use client';

import type { UIMessage } from 'ai';
import { useCallback, useRef, useState } from 'react';
import { dbMessagesToUIMessages } from '@/lib/ai/utils';

function getHeaders(): Record<string, string> {
  const fp = typeof window !== 'undefined' ? localStorage.getItem('jade_fingerprint') : null;
  return fp ? { 'x-fingerprint': fp, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export function useMessagePagination() {
  const [historicalMessages, setHistoricalMessages] = useState<UIMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const nextCursorRef = useRef<string | undefined>(undefined);
  const activeSessionIdRef = useRef<string | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  const loadInitial = useCallback(async (sessionId: string): Promise<UIMessage[]> => {
    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    activeSessionIdRef.current = sessionId;
    setHistoricalMessages([]);
    setHasMore(false);
    nextCursorRef.current = undefined;

    try {
      const res = await fetch(`/api/ai/chat/sessions/${sessionId}`, {
        headers: getHeaders(),
        signal: controller.signal,
      });
      const data = await res.json();

      // Guard against stale responses after session switch
      if (activeSessionIdRef.current !== sessionId) return [];

      const uiMessages = data.messages ? dbMessagesToUIMessages(data.messages) : [];
      setHasMore(data.hasMore ?? false);
      nextCursorRef.current = data.nextCursor;

      // All initial messages go through useChat's setMessages, not historicalMessages
      return uiMessages;
    } catch (err: any) {
      if (err?.name === 'AbortError') return [];
      return [];
    }
  }, []);

  const loadMore = useCallback(async (scrollRef: React.RefObject<HTMLDivElement | null>) => {
    const sessionId = activeSessionIdRef.current;
    if (!sessionId || !nextCursorRef.current || isLoadingMore) return;

    setIsLoadingMore(true);
    const el = scrollRef.current;
    const prevScrollHeight = el?.scrollHeight ?? 0;
    const prevScrollTop = el?.scrollTop ?? 0;

    try {
      const cursor = nextCursorRef.current;
      const res = await fetch(
        `/api/ai/chat/sessions/${sessionId}?cursor=${encodeURIComponent(cursor)}`,
        { headers: getHeaders() },
      );
      const data = await res.json();

      if (activeSessionIdRef.current !== sessionId) return;

      const olderMessages = data.messages ? dbMessagesToUIMessages(data.messages) : [];
      setHasMore(data.hasMore ?? false);
      nextCursorRef.current = data.nextCursor;

      setHistoricalMessages((prev) => [...olderMessages, ...prev]);

      // Restore scroll position after DOM update
      requestAnimationFrame(() => {
        if (el) {
          const newScrollHeight = el.scrollHeight;
          el.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
        }
      });
    } catch {
      // Silently fail
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setHistoricalMessages([]);
    setHasMore(false);
    setIsLoadingMore(false);
    nextCursorRef.current = undefined;
    activeSessionIdRef.current = undefined;
  }, []);

  return {
    historicalMessages,
    hasMore,
    isLoadingMore,
    loadInitial,
    loadMore,
    reset,
  };
}
