'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';
import { Copy, Trash2, MoreVertical, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Resume } from '@/types/resume';

interface ResumeListItemProps {
  resume: Resume;
  onDelete: () => void;
  onDuplicate: () => void;
  onRename: (title: string) => void;
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
  elegant: 'dashboard.templateElegant',
  executive: 'dashboard.templateExecutive',
  developer: 'dashboard.templateDeveloper',
  designer: 'dashboard.templateDesigner',
  startup: 'dashboard.templateStartup',
  formal: 'dashboard.templateFormal',
  infographic: 'dashboard.templateInfographic',
  compact: 'dashboard.templateCompact',
  euro: 'dashboard.templateEuro',
  clean: 'dashboard.templateClean',
  bold: 'dashboard.templateBold',
  timeline: 'dashboard.templateTimeline',
  // Batch 1
  nordic: 'dashboard.templateNordic',
  corporate: 'dashboard.templateCorporate',
  consultant: 'dashboard.templateConsultant',
  finance: 'dashboard.templateFinance',
  medical: 'dashboard.templateMedical',
  // Batch 2
  gradient: 'dashboard.templateGradient',
  metro: 'dashboard.templateMetro',
  material: 'dashboard.templateMaterial',
  coder: 'dashboard.templateCoder',
  blocks: 'dashboard.templateBlocks',
  // Batch 3
  magazine: 'dashboard.templateMagazine',
  artistic: 'dashboard.templateArtistic',
  retro: 'dashboard.templateRetro',
  neon: 'dashboard.templateNeon',
  watercolor: 'dashboard.templateWatercolor',
  // Batch 4
  swiss: 'dashboard.templateSwiss',
  japanese: 'dashboard.templateJapanese',
  berlin: 'dashboard.templateBerlin',
  luxe: 'dashboard.templateLuxe',
  rose: 'dashboard.templateRose',
  // Batch 5
  architect: 'dashboard.templateArchitect',
  legal: 'dashboard.templateLegal',
  teacher: 'dashboard.templateTeacher',
  scientist: 'dashboard.templateScientist',
  engineer: 'dashboard.templateEngineer',
  // Batch 6
  sidebar: 'dashboard.templateSidebar',
  card: 'dashboard.templateCard',
  zigzag: 'dashboard.templateZigzag',
  ribbon: 'dashboard.templateRibbon',
  mosaic: 'dashboard.templateMosaic',
};

export function ResumeListItem({ resume, onDelete, onDuplicate, onRename }: ResumeListItemProps) {
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
      className="group flex cursor-pointer items-center gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-700/60 dark:bg-card"
      onClick={() => { if (!renamingRef.current) router.push(`/editor/${resume.id}`); }}
    >
      {/* Title */}
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
      </div>

      {/* Template badge */}
      <Badge variant="secondary" className="shrink-0 text-[11px] px-1.5 py-0">
        {templateLabel}
      </Badge>

      {/* Last edited */}
      <span className="hidden shrink-0 text-[12px] text-zinc-400 sm:inline dark:text-zinc-500">
        {resume.updatedAt
          ? t('dashboard.lastEdited', {
              date: new Date(resume.updatedAt).toLocaleDateString(),
            })
          : ''}
      </span>

      {/* Actions */}
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
  );
}
