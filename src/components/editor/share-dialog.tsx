'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Share2,
  Loader2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Link2,
  AlertCircle,
} from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
}

interface ShareStatus {
  isPublic: boolean;
  shareToken: string | null;
  shareUrl: string | null;
  viewCount: number;
  hasPassword: boolean;
}

type ShareState = 'loading' | 'not-shared' | 'shared' | 'creating' | 'disabling' | 'error';

export function ShareDialog({ open, onOpenChange, resumeId }: ShareDialogProps) {
  const t = useTranslations('share');

  const [state, setState] = useState<ShareState>('loading');
  const [shareStatus, setShareStatus] = useState<ShareStatus | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getHeaders = () => {
    const fingerprint = localStorage.getItem('jade_fingerprint');
    return {
      'Content-Type': 'application/json',
      ...(fingerprint ? { 'x-fingerprint': fingerprint } : {}),
    };
  };

  // Fetch share status when dialog opens
  useEffect(() => {
    if (!open) return;

    setState('loading');
    setPassword('');
    setCopied(false);
    setErrorMessage('');

    fetch(`/api/resume/${resumeId}/share`, { headers: getHeaders() })
      .then((res) => res.json())
      .then((data) => {
        setShareStatus(data);
        setState(data.isPublic ? 'shared' : 'not-shared');
      })
      .catch(() => {
        setState('error');
        setErrorMessage(t('error'));
      });
  }, [open, resumeId, t]);

  const handleCreateShare = useCallback(async () => {
    setState('creating');
    setErrorMessage('');

    try {
      const res = await fetch(`/api/resume/${resumeId}/share`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ password: password || undefined }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create share link');
      }

      const data = await res.json();
      setShareStatus({
        isPublic: true,
        shareToken: data.shareToken,
        shareUrl: data.shareUrl,
        viewCount: 0,
        hasPassword: !!password,
      });
      setState('shared');
    } catch (err: any) {
      setState('error');
      setErrorMessage(err.message || t('error'));
    }
  }, [resumeId, password, t]);

  const handleDisableSharing = useCallback(async () => {
    setState('disabling');
    setErrorMessage('');

    try {
      const res = await fetch(`/api/resume/${resumeId}/share`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to disable sharing');
      }

      setShareStatus(null);
      setState('not-shared');
    } catch (err: any) {
      setState('error');
      setErrorMessage(err.message || t('error'));
    }
  }, [resumeId, t]);

  const handleCopyLink = useCallback(async () => {
    if (!shareStatus?.shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareStatus.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareStatus.shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareStatus?.shareUrl]);

  const isActionInProgress = state === 'creating' || state === 'disabling' || state === 'loading';

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !isActionInProgress) onOpenChange(false); }}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-pink-500" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          {/* Loading */}
          {state === 'loading' && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
            </div>
          )}

          {/* Not Shared Yet */}
          {state === 'not-shared' && (
            <>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t('notShared')}
              </p>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('password')}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Already Shared */}
          {state === 'shared' && shareStatus && (
            <>
              {/* Share URL */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('shareUrl')}
                </Label>
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1 flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
                    <Link2 className="h-4 w-4 shrink-0 text-zinc-400" />
                    <span className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                      {shareStatus.shareUrl}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                    className="cursor-pointer shrink-0 h-9 w-9"
                    title={t('copyLink')}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* View Count */}
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Eye className="h-4 w-4" />
                <span>{t('viewCount')}: {shareStatus.viewCount} {t('views')}</span>
              </div>

              {/* Password Protected */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {t('passwordProtected')}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  shareStatus.hasPassword
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                }`}>
                  {shareStatus.hasPassword ? 'On' : 'Off'}
                </span>
              </div>
            </>
          )}

          {/* Creating */}
          {state === 'creating' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('creating')}
              </p>
            </div>
          )}

          {/* Disabling */}
          {state === 'disabling' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('disabling')}
              </p>
            </div>
          )}

          {/* Error */}
          {state === 'error' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {errorMessage || t('error')}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-zinc-100 px-6 py-4 dark:border-zinc-800 flex-row justify-end gap-2">
          {state === 'not-shared' && (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={handleCreateShare}
                className="cursor-pointer bg-pink-500 hover:bg-pink-600"
              >
                {t('createLink')}
              </Button>
            </>
          )}
          {state === 'shared' && (
            <>
              <Button
                variant="destructive"
                onClick={handleDisableSharing}
                className="cursor-pointer"
              >
                {t('disableSharing')}
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer"
              >
                {t('close')}
              </Button>
            </>
          )}
          {state === 'error' && (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              {t('close')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
