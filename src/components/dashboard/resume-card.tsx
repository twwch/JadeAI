'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';
import { Copy, Trash2, MoreVertical, Share2, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { TemplateThumbnail } from './template-thumbnail';
import type { Resume } from '@/types/resume';

interface ResumeCardProps {
  resume: Resume;
  onDelete: () => void;
  onDuplicate: () => void;
  onRename: (title: string) => void;
  onShare?: () => void;
}

const templateLabelKeys: Record<string, string> = {
  classic: 'dashboard.templateClassic',
  modern: 'dashboard.templateModern',
  minimal: 'dashboard.templateMinimal',
  professional: 'dashboard.templateProfessional',
  'two-column': 'dashboard.templateTwoColumn',
  creative: 'dashboard.templateCreative',
  ats: 'dashboard.templateAts',
  academic: 'dashboard.templateAcademic',
};

export function ResumeCard({ resume, onDelete, onDuplicate, onRename, onShare }: ResumeCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(resume.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const renamingRef = useRef(false);

  const startRenaming = () => {
    renamingRef.current = true;
    setIsRenaming(true);
  };

  useEffect(() => {
    if (isRenaming) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isRenaming]);

  const commitRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== resume.title) {
      onRename(trimmed);
    } else {
      setRenameValue(resume.title);
    }
    setIsRenaming(false);
    renamingRef.current = false;
  };

  const labelKey = templateLabelKeys[resume.template] || 'dashboard.templateClassic';
  const templateLabel = t(labelKey);

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 dark:border-zinc-700/60 dark:bg-card"
      onClick={() => { if (!renamingRef.current) router.push(`/editor/${resume.id}`); }}
    >
      {/* Template preview thumbnail */}
      <div className="relative border-b border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-700/40 dark:bg-zinc-800/50">
        <TemplateThumbnail
          template={resume.template}
          className="mx-auto h-[120px] w-[85px] shadow-sm ring-1 ring-zinc-200/60"
        />
        {/* Hover overlay with actions */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/5 dark:group-hover:bg-white/5" />
      </div>

      {/* Info section */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {isRenaming ? (
              <input
                ref={inputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => setTimeout(commitRename, 0)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); commitRename(); }
                  if (e.key === 'Escape') { setRenameValue(resume.title); setIsRenaming(false); renamingRef.current = false; }
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full truncate rounded border border-pink-300 bg-white px-1 text-sm font-semibold text-zinc-900 outline-none focus:ring-1 focus:ring-pink-400 dark:bg-zinc-800 dark:text-zinc-100"
              />
            ) : (
              <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {resume.title}
              </h3>
            )}
            <div className="mt-1.5 flex items-center gap-1.5">
              <Badge variant="secondary" className="text-[11px] px-1.5 py-0">
                {templateLabel}
              </Badge>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                {resume.updatedAt
                  ? t('dashboard.lastEdited', {
                      date: new Date(resume.updatedAt).toLocaleDateString(),
                    })
                  : ''}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="cursor-pointer rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4 text-zinc-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onCloseAutoFocus={(e) => { if (renamingRef.current) e.preventDefault(); }}>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  startRenaming();
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {t('common.rename')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                {t('common.duplicate')}
              </DropdownMenuItem>
              {onShare && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare();
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {t('share.title')}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
