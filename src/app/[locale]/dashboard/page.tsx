'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useResume } from '@/hooks/use-resume';
import { useUIStore } from '@/stores/ui-store';
import { useFingerprint } from '@/hooks/use-fingerprint';
import { ResumeGrid } from '@/components/dashboard/resume-grid';
import { CreateResumeDialog } from '@/components/dashboard/create-resume-dialog';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { resumes, isLoading, fetchResumes, createResume, deleteResume, duplicateResume } = useResume();
  const { openModal, activeModal, closeModal } = useUIStore();
  const { fingerprint, isLoading: fpLoading } = useFingerprint();

  useEffect(() => {
    if (!fpLoading && fingerprint) {
      fetchResumes();
    }
  }, [fpLoading, fingerprint, fetchResumes]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{t('title')}</h1>
          {resumes.length > 0 && (
            <p className="mt-1 text-sm text-zinc-500">
              {t('resumeCount', { count: resumes.length })}
            </p>
          )}
        </div>
        <Button
          onClick={() => openModal('create-resume')}
          className="cursor-pointer gap-2 bg-pink-500 hover:bg-pink-600"
        >
          <Plus className="h-4 w-4" />
          {t('createResume')}
        </Button>
      </div>

      {isLoading || fpLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 py-16">
          <p className="text-zinc-500">{t('noResumes')}</p>
        </div>
      ) : (
        <ResumeGrid
          resumes={resumes}
          onDelete={deleteResume}
          onDuplicate={duplicateResume}
        />
      )}

      <CreateResumeDialog
        open={activeModal === 'create-resume'}
        onClose={closeModal}
        onCreate={createResume}
      />
    </div>
  );
}
