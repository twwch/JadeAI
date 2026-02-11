'use client';

import type { UIMessage } from 'ai';
import { useTranslations } from 'next-intl';
import { X, Sparkles, Plus, Trash2, Clock, MessageSquare } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEditorStore } from '@/stores/editor-store';
import { useAIChat } from '@/hooks/use-ai-chat';
import { useMessagePagination } from '@/hooks/use-message-pagination';
import { AIMessage } from './ai-message';
import { AIInput } from './ai-input';

interface ChatSession {
  id: string;
  title: string;
  updatedAt: Date | number | null;
}

interface AIChatPanelProps {
  resumeId: string;
}

function getHeaders(): Record<string, string> {
  const fp = typeof window !== 'undefined' ? localStorage.getItem('jade_fingerprint') : null;
  return fp ? { 'x-fingerprint': fp, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

function formatTime(date: Date | number | null) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}/${m}/${day} · ${h}:${min}`;
}

export function AIChatPanel({ resumeId }: AIChatPanelProps) {
  const t = useTranslations('ai');
  const { toggleAiPanel } = useEditorStore();
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>();
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>();
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const { historicalMessages, hasMore, isLoadingMore, loadInitial, loadMore, reset: resetPagination } = useMessagePagination();

  // Fetch models
  useEffect(() => {
    fetch('/api/ai/models')
      .then((res) => res.json())
      .then((data: { models: { id: string }[]; fallbackModel: string }) => {
        const ids = data.models.map((m) => m.id);
        setModels(ids);
        setSelectedModel((prev) => prev ?? data.fallbackModel ?? ids[0]);
      })
      .catch(() => {});
  }, []);

  // Fetch sessions on mount
  useEffect(() => {
    const headers = getHeaders();
    fetch(`/api/ai/chat/sessions?resumeId=${resumeId}`, { headers })
      .then((res) => res.json())
      .then(async (data: { sessions: ChatSession[] }) => {
        if (data.sessions.length > 0) {
          setSessions(data.sessions);
          const mostRecent = data.sessions[0];
          setActiveSessionId(mostRecent.id);
          const msgs = await loadInitial(mostRecent.id);
          setInitialMessages(msgs);
        } else {
          await createNewSession(true);
        }
        setSessionsLoaded(true);
      })
      .catch(() => {
        setSessionsLoaded(true);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  const createNewSession = useCallback(async (isInitial = false) => {
    const headers = getHeaders();
    try {
      const res = await fetch('/api/ai/chat/sessions', {
        method: 'POST',
        headers,
        body: JSON.stringify({ resumeId }),
      });
      const data = await res.json();
      const newSession = data.session;
      if (newSession) {
        setSessions((prev) => [{ id: newSession.id, title: newSession.title, updatedAt: newSession.updatedAt }, ...prev]);
        setActiveSessionId(newSession.id);
        resetPagination();
        setInitialMessages([]);
        if (isInitial) {
          setSessionsLoaded(true);
        }
      }
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  }, [resumeId, resetPagination]);

  const switchSession = useCallback(async (sessionId: string) => {
    if (sessionId === activeSessionId) return;
    setActiveSessionId(sessionId);
    setHistoryOpen(false);
    const msgs = await loadInitial(sessionId);
    setInitialMessages(msgs);
  }, [activeSessionId, loadInitial]);

  const deleteSession = useCallback(async (sessionId: string) => {
    const headers = getHeaders();
    try {
      await fetch(`/api/ai/chat/sessions/${sessionId}`, { method: 'DELETE', headers });
      setSessions((prev) => {
        const remaining = prev.filter((s) => s.id !== sessionId);
        if (sessionId === activeSessionId) {
          if (remaining.length > 0) {
            const nextId = remaining[0].id;
            setActiveSessionId(nextId);
            loadInitial(nextId).then((msgs) => setInitialMessages(msgs));
          } else {
            createNewSession();
          }
        }
        return remaining;
      });
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  }, [activeSessionId, loadInitial, createNewSession]);

  const { messages: chatMessages, input, handleInputChange, handleSubmit: originalHandleSubmit, isLoading, status } = useAIChat({
    resumeId,
    sessionId: activeSessionId,
    initialMessages,
    selectedModel,
  });

  // Merge historical (paginated older) + chat (current session) messages, dedup by id
  const displayMessages = useMemo(() => {
    if (historicalMessages.length === 0) return chatMessages;
    const chatIds = new Set(chatMessages.map((m) => m.id));
    const olderOnly = historicalMessages.filter((m) => !chatIds.has(m.id));
    return [...olderOnly, ...chatMessages];
  }, [historicalMessages, chatMessages]);

  // Wrap handleSubmit to update session title on first message
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    const activeSession = sessions.find((s) => s.id === activeSessionId);
    if (activeSession && activeSession.title === '新对话' && input.trim()) {
      const newTitle = input.trim().slice(0, 50);
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, title: newTitle } : s))
      );
    }
    originalHandleSubmit(e);
  }, [sessions, activeSessionId, input, originalHandleSubmit]);

  // Smart auto-scroll: only scroll to bottom when user is near bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (el && isNearBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chatMessages, isLoading]);

  // Track scroll position + trigger loadMore on scroll near top
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 80;
      if (scrollTop < 50 && hasMore && !isLoadingMore) {
        loadMore(scrollRef);
      }
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoadingMore, loadMore]);

  return (
    <div className="flex w-80 shrink-0 flex-col overflow-hidden border-l bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-pink-500" />
          <h3 className="text-sm font-semibold text-zinc-900">{t('panelTitle')}</h3>
        </div>
        <div className="flex items-center gap-1">
          {/* History popover */}
          <Popover open={historyOpen} onOpenChange={setHistoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 cursor-pointer p-0"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-0" sideOffset={8}>
              <div className="max-h-80 overflow-y-auto">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="group flex cursor-pointer items-start gap-3 border-b border-zinc-100 px-4 py-3 last:border-b-0 hover:bg-zinc-50"
                    onClick={() => switchSession(session.id)}
                  >
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-800">
                        {session.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-400">
                        {formatTime(session.updatedAt)}
                      </p>
                    </div>
                    <button
                      className="mt-0.5 hidden shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 group-hover:block"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="px-4 py-6 text-center text-xs text-zinc-400">
                    {t('defaultGreeting')}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 cursor-pointer p-0"
            onClick={() => createNewSession()}
            title={t('newChat')}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 cursor-pointer p-0"
            onClick={toggleAiPanel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Loading more indicator */}
          {isLoadingMore && (
            <div className="py-2 text-center text-xs text-zinc-400">
              {t('loadingMore')}
            </div>
          )}
          {hasMore && !isLoadingMore && (
            <button
              className="w-full py-2 text-center text-xs text-zinc-400 hover:text-zinc-600"
              onClick={() => loadMore(scrollRef)}
            >
              {t('loadMore')}
            </button>
          )}
          {displayMessages.length === 0 && (
            <div className="rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 p-3 text-[13px] text-pink-700">
              {t('defaultGreeting')}
            </div>
          )}
          {displayMessages.map((message) => (
            <AIMessage key={message.id} message={message} />
          ))}
          {status === 'submitted' && (
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pink-400 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pink-400 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-pink-400 [animation-delay:300ms]" />
              </span>
              {t('thinking')}
            </div>
          )}
        </div>
      </div>

      <AIInput
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        models={models}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
    </div>
  );
}
