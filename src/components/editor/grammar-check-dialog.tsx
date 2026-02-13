'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, AlertTriangle, RotateCcw, SpellCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GrammarIssue {
  section: string;
  severity: 'high' | 'medium' | 'low';
  type: 'grammar' | 'weak_verb' | 'vague' | 'quantify' | 'spelling';
  original: string;
  suggestion: string;
}

interface GrammarCheckResult {
  issues: GrammarIssue[];
  summary: string;
  score: number;
}

interface GrammarCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
}

function getScoreColor(score: number): string {
  if (score < 40) return 'text-red-500';
  if (score <= 70) return 'text-yellow-500';
  return 'text-emerald-500';
}

function getScoreStroke(score: number): string {
  if (score < 40) return 'stroke-red-500';
  if (score <= 70) return 'stroke-yellow-500';
  return 'stroke-emerald-500';
}

function getScoreTrack(score: number): string {
  if (score < 40) return 'stroke-red-100';
  if (score <= 70) return 'stroke-yellow-100';
  return 'stroke-emerald-100';
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            className={getScoreTrack(score)}
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${getScoreStroke(score)} transition-all duration-700 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}

function SeverityBadge({ severity, t }: { severity: GrammarIssue['severity']; t: any }) {
  const styles = {
    high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800',
    low: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  };
  const labels = {
    high: t('severityHigh'),
    medium: t('severityMedium'),
    low: t('severityLow'),
  };

  return <Badge className={styles[severity]}>{labels[severity]}</Badge>;
}

function TypeBadge({ type, t }: { type: GrammarIssue['type']; t: any }) {
  const labelMap: Record<GrammarIssue['type'], string> = {
    grammar: t('typeGrammar'),
    weak_verb: t('typeWeakVerb'),
    vague: t('typeVague'),
    quantify: t('typeQuantify'),
    spelling: t('typeSpelling'),
  };

  return (
    <Badge variant="secondary" className="text-xs">
      {labelMap[type]}
    </Badge>
  );
}

export function GrammarCheckDialog({ open, onOpenChange, resumeId }: GrammarCheckDialogProps) {
  const t = useTranslations('grammarCheck');

  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<GrammarCheckResult | null>(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setIsChecking(true);
    setError('');

    try {
      const fingerprint = typeof window !== 'undefined' ? localStorage.getItem('jade_fingerprint') : null;
      const res = await fetch('/api/ai/grammar-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(fingerprint ? { 'x-fingerprint': fingerprint } : {}),
        },
        body: JSON.stringify({ resumeId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Grammar check failed');
      }

      const data: GrammarCheckResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to check grammar');
    } finally {
      setIsChecking(false);
    }
  };

  const handleCheckAgain = () => {
    setResult(null);
    setError('');
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setResult(null);
      setError('');
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <SpellCheck className="h-5 w-5 text-pink-500" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        {!result ? (
          /* ---------- Initial / Checking / Error State ---------- */
          <div className="px-6 py-4 space-y-4">
            {!isChecking && !error && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <SpellCheck className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mb-4" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t('description')}
                </p>
              </div>
            )}

            {isChecking && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-3" />
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('checking')}
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="cursor-pointer"
              >
                {t('close')}
              </Button>
              <Button
                onClick={handleCheck}
                disabled={isChecking}
                className="cursor-pointer bg-pink-500 hover:bg-pink-600"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    {t('checking')}
                  </>
                ) : (
                  t('check')
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* ---------- Results State ---------- */
          <>
            <ScrollArea className="max-h-[65vh]">
              <div className="px-6 py-4 space-y-6">
                {/* Score */}
                <div className="flex items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50/50 py-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <ScoreCircle score={result.score} label={t('score')} />
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {t('summary')}
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {result.summary}
                  </p>
                </div>

                {/* Issues */}
                {result.issues.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {t('issues')} ({result.issues.length})
                    </h4>
                    <div className="space-y-2.5">
                      {result.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-zinc-150 bg-white p-3.5 space-y-2 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="secondary" className="text-xs font-medium">
                              {issue.section}
                            </Badge>
                            <SeverityBadge severity={issue.severity} t={t} />
                            <TypeBadge type={issue.type} t={t} />
                          </div>
                          <div className="space-y-1.5">
                            <div>
                              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                                {t('original')}
                              </span>
                              <p className="text-sm text-zinc-500 line-through dark:text-zinc-500">
                                {issue.original}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-pink-500">
                                {t('suggestion')}
                              </span>
                              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                {issue.suggestion}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {t('noIssues')}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
              <Button
                variant="outline"
                onClick={handleClose}
                className="cursor-pointer"
              >
                {t('close')}
              </Button>
              <Button
                variant="outline"
                onClick={handleCheckAgain}
                className="cursor-pointer gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t('checkAgain')}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
