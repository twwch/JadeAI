'use client';

import { useTranslations } from 'next-intl';
import { Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AISuggestionProps {
  suggestion: string;
  onApply: () => void;
  onDismiss: () => void;
}

export function AISuggestion({ suggestion, onApply, onDismiss }: AISuggestionProps) {
  const t = useTranslations('ai');

  return (
    <Card className="border-pink-200 bg-pink-50 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-pink-600">
        <Sparkles className="h-3 w-3" />
        {t('suggestion')}
      </div>
      <p className="mb-3 text-sm text-zinc-700">{suggestion}</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={onApply}
          className="h-7 cursor-pointer gap-1 bg-pink-500 text-xs hover:bg-pink-600"
        >
          <Check className="h-3 w-3" />
          {t('applySuggestion')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDismiss}
          className="h-7 cursor-pointer gap-1 text-xs"
        >
          <X className="h-3 w-3" />
          {t('dismissSuggestion')}
        </Button>
      </div>
    </Card>
  );
}
