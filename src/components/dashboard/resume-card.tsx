'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { FileText, Copy, Trash2, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Resume } from '@/types/resume';

interface ResumeCardProps {
  resume: Resume;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function ResumeCard({ resume, onDelete, onDuplicate }: ResumeCardProps) {
  const t = useTranslations();
  const router = useRouter();

  const templateLabel =
    resume.template === 'modern'
      ? t('dashboard.templateModern')
      : resume.template === 'minimal'
        ? t('dashboard.templateMinimal')
        : t('dashboard.templateClassic');

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      onClick={() => router.push(`/editor/${resume.id}`)}
    >
      <CardContent className="p-5">
        <div className="mb-4 flex h-24 items-center justify-center rounded-lg bg-zinc-100">
          <FileText className="h-10 w-10 text-zinc-300" />
        </div>
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-zinc-900">
              {resume.title}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {templateLabel}
              </Badge>
              <span className="text-xs text-zinc-400">
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
              className="cursor-pointer rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4 text-zinc-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
      </CardContent>
    </Card>
  );
}
