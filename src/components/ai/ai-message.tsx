'use client';

import { Bot, User, CheckCircle2, XCircle, ChevronDown, ChevronRight, Terminal, Play, AlertTriangle, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { UIMessage } from 'ai';
import { useUIStore } from '@/stores/ui-store';

interface AIMessageProps {
  message: UIMessage;
}

function isToolPart(part: any): boolean {
  return typeof part.type === 'string' && part.type.startsWith('tool-');
}

function getToolName(part: any): string {
  // AI SDK v6: type is "tool-{toolName}", e.g., "tool-updateSection"
  return part.type.split('-').slice(1).join('-');
}

function CollapsibleBlock({
  label,
  icon,
  statusIcon,
  content,
  defaultOpen = false,
}: {
  label: string;
  icon: React.ReactNode;
  statusIcon?: React.ReactNode;
  content: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-zinc-500 hover:bg-zinc-100"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ChevronDown className="h-3 w-3 shrink-0" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0" />
        )}
        {icon}
        <span>{label}</span>
        {statusIcon && <span className="ml-auto">{statusIcon}</span>}
      </button>
      {open && (
        <div className="border-t border-zinc-200 bg-zinc-900 px-3 py-2">
          <pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-zinc-300">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}

function ToolCallCard({ part }: { part: any }) {
  const t = useTranslations('ai');

  const toolName = getToolName(part);
  const args = part.input || {};
  const result = part.output;
  const state = part.state;

  const isCompleted = state === 'output-available';
  const isError = state === 'output-error';
  const isRunning = !isCompleted && !isError;
  const isSuccess = isCompleted && result?.success !== false;

  const argsStr = JSON.stringify(args, null, 2);
  const resultStr = result ? JSON.stringify(result, null, 2) : '';

  return (
    <div className="my-2 space-y-1.5 text-xs">
      {/* Calling block */}
      <CollapsibleBlock
        label={`${t('toolCalling')} ${toolName}`}
        icon={
          isRunning ? (
            <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-[1.5px] border-zinc-300 border-t-zinc-600" />
          ) : (
            <Terminal className="h-3 w-3 shrink-0" />
          )
        }
        content={argsStr}
      />

      {/* Result block */}
      {(isCompleted || isError) && (
        <CollapsibleBlock
          label={t('toolResult')}
          icon={<Play className="h-3 w-3 shrink-0" />}
          statusIcon={
            isSuccess ? (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-red-500" />
            )
          }
          content={isError ? (part.errorText || t('toolCallError')) : resultStr}
        />
      )}
    </div>
  );
}

function APIKeyMissingCard() {
  const t = useTranslations('ai');
  const { openModal, setSettingsTab } = useUIStore();

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span className="text-[13px] font-medium">{t('apiKeyMissing')}</span>
      </div>
      <p className="text-[12px] leading-relaxed text-amber-600 dark:text-amber-400/80">
        {t('apiKeyMissingHint')}
      </p>
      <button
        type="button"
        className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1.5 text-[12px] font-medium text-amber-700 transition-colors hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900"
        onClick={() => {
          setSettingsTab('ai');
          openModal('settings');
        }}
      >
        <Settings className="h-3.5 w-3.5" />
        {t('goToSettings')}
      </button>
    </div>
  );
}

export function AIMessage({ message }: AIMessageProps) {
  const isUser = message.role === 'user';

  const userText = isUser
    ? (message.parts || [])
        .filter((p) => p.type === 'text')
        .map((p) => (p as { type: 'text'; text: string }).text)
        .join('')
    : '';

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-zinc-700' : 'bg-gradient-to-br from-pink-400 to-pink-500'
        }`}
      >
        {isUser ? (
          <User className="h-3 w-3 text-white" />
        ) : (
          <Bot className="h-3 w-3 text-white" />
        )}
      </div>
      <div
        className={`min-w-0 max-w-[calc(100%-2.5rem)] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
          isUser
            ? 'bg-zinc-800 text-white'
            : 'bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200/60'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{userText}</p>
        ) : (
          (message.parts || []).map((part, i) => {
            if (part.type === 'text') {
              const text = (part as { type: 'text'; text: string }).text;
              if (!text) return null;
              if (text === '__API_KEY_MISSING__') {
                return <APIKeyMissingCard key={i} />;
              }
              return (
                <div key={i} className="ai-markdown">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
                </div>
              );
            }
            if (isToolPart(part)) {
              return <ToolCallCard key={(part as any).toolCallId || i} part={part} />;
            }
            return null;
          })
        )}
      </div>
    </div>
  );
}
