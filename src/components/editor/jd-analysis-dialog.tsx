'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, RotateCcw, Target, ShieldCheck, Lightbulb, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JdAnalysisResult {
  overallScore: number;
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: { section: string; current: string; suggested: string }[];
  atsScore: number;
  summary: string;
}

interface JdAnalysisDialogProps {
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
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            className={getScoreTrack(score)}
          />
          {/* Progress */}
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

export function JdAnalysisDialog({ open, onOpenChange, resumeId }: JdAnalysisDialogProps) {
  const t = useTranslations('jdAnalysis');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<JdAnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    setError('');

    try {
      const fingerprint = typeof window !== 'undefined' ? localStorage.getItem('jade_fingerprint') : null;
      const res = await fetch('/api/ai/jd-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(fingerprint ? { 'x-fingerprint': fingerprint } : {}),
        },
        body: JSON.stringify({ resumeId, jobDescription }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Analysis failed');
      }

      const data: JdAnalysisResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeAgain = () => {
    setResult(null);
    setJobDescription('');
    setError('');
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after close animation
    setTimeout(() => {
      setResult(null);
      setJobDescription('');
      setError('');
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        {!result ? (
          /* ---------- Input State ---------- */
          <div className="px-6 py-4 space-y-4">
            <Textarea
              placeholder={t('placeholder')}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              className="h-[200px] max-h-[200px] overflow-y-auto resize-none text-sm"
              disabled={isAnalyzing}
            />

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
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="cursor-pointer bg-pink-500 hover:bg-pink-600"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    {t('analyzing')}
                  </>
                ) : (
                  t('analyze')
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* ---------- Results State ---------- */
          <>
            <ScrollArea className="max-h-[65vh]">
              <div className="px-6 py-4 space-y-6">
                {/* Score Dashboard */}
                <div className="flex items-center justify-center gap-10 rounded-xl border border-zinc-100 bg-zinc-50/50 py-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <ScoreCircle score={result.overallScore} label={t('overallScore')} />
                  <ScoreCircle score={result.atsScore} label={t('atsScore')} />
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    <Target className="h-4 w-4 text-zinc-400" />
                    {t('summary')}
                  </h4>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {result.summary}
                  </p>
                </div>

                {/* Keyword Matches */}
                {result.keywordMatches.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      {t('keywordMatches')}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywordMatches.map((keyword) => (
                        <Badge
                          key={keyword}
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Keywords */}
                {result.missingKeywords.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      {t('missingKeywords')}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.missingKeywords.map((keyword) => (
                        <Badge
                          key={keyword}
                          className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      {t('suggestions')}
                    </h4>
                    <div className="space-y-2.5">
                      {result.suggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-zinc-150 bg-white p-3.5 space-y-2 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <Badge variant="secondary" className="text-xs font-medium">
                            {suggestion.section}
                          </Badge>
                          <div className="space-y-1.5">
                            <div>
                              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                                {t('currentState')}
                              </span>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {suggestion.current}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-pink-500">
                                {t('suggestedChange')}
                              </span>
                              <p className="text-sm text-zinc-800 dark:text-zinc-200">
                                {suggestion.suggested}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results fallback */}
                {!result.summary &&
                  result.keywordMatches.length === 0 &&
                  result.missingKeywords.length === 0 &&
                  result.suggestions.length === 0 && (
                    <p className="py-8 text-center text-sm text-zinc-400">
                      {t('noResults')}
                    </p>
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
                onClick={handleAnalyzeAgain}
                className="cursor-pointer gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t('analyzeAgain')}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
