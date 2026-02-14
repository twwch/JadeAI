'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Search, LayoutGrid, List, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useResume } from '@/hooks/use-resume';
import { useUIStore } from '@/stores/ui-store';
import { useFingerprint } from '@/hooks/use-fingerprint';
import { config } from '@/lib/config';
import { ResumeGrid } from '@/components/dashboard/resume-grid';
import { ResumeListItem } from '@/components/dashboard/resume-list-item';
import { CreateResumeDialog } from '@/components/dashboard/create-resume-dialog';
import { GenerateResumeDialog } from '@/components/dashboard/generate-resume-dialog';
import { ShareDialog } from '@/components/editor/share-dialog';
import { SettingsDialog } from '@/components/settings/settings-dialog';
import { TourOverlay, type TourStepConfig } from '@/components/tour/tour-overlay';
import { useTourStore, hasCompletedTour } from '@/stores/tour-store';
import { cn } from '@/lib/utils';
import type { Resume } from '@/types/resume';

type SortOption = 'lastEdited' | 'created' | 'nameAsc' | 'nameDesc';
type ViewMode = 'grid' | 'list';

const DASHBOARD_TOUR_STEPS: TourStepConfig[] = [
  { target: 'dash-create', placement: 'bottom', i18nKey: 'dashCreate' },
  { target: 'dash-ai-generate', placement: 'bottom', i18nKey: 'dashAiGenerate' },
  { target: 'dash-search', placement: 'bottom', i18nKey: 'dashSearch' },
  { target: 'dash-templates', placement: 'bottom', i18nKey: 'dashTemplates' },
];

const VIEW_PREF_KEY = 'jade_dashboard_view';

function getInitialView(): ViewMode {
  if (typeof window === 'undefined') return 'grid';
  const stored = localStorage.getItem(VIEW_PREF_KEY);
  return stored === 'list' ? 'list' : 'grid';
}

function sortResumes(resumes: Resume[], sort: SortOption): Resume[] {
  const sorted = [...resumes];
  switch (sort) {
    case 'lastEdited':
      return sorted.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    case 'created':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'nameAsc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'nameDesc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { resumes, isLoading, fetchResumes, createResume, deleteResume, renameResume, duplicateResume } = useResume();
  const { openModal, activeModal, closeModal } = useUIStore();
  const { fingerprint, isLoading: fpLoading } = useFingerprint();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('lastEdited');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [shareResumeId, setShareResumeId] = useState<string | null>(null);
  const startTour = useTourStore((s) => s.startTour);

  // Auto-start dashboard tour for first-time users
  useEffect(() => {
    if (isLoading || fpLoading) return;
    if (hasCompletedTour('dashboard')) return;
    if (window.innerWidth < 768) return;
    const timer = setTimeout(() => startTour('dashboard', DASHBOARD_TOUR_STEPS.length), 800);
    return () => clearTimeout(timer);
  }, [isLoading, fpLoading, startTour]);

  // Hydrate view preference from localStorage on mount
  useEffect(() => {
    setViewMode(getInitialView());
  }, []);

  // Persist view preference
  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_PREF_KEY, mode);
  };

  useEffect(() => {
    if (fpLoading) return;
    // OAuth mode: fingerprint is null, but we still need to fetch
    // Fingerprint mode: wait until fingerprint is resolved
    if (config.auth.enabled || fingerprint) {
      fetchResumes();
    }
  }, [fpLoading, fingerprint, fetchResumes]);

  // Filter and sort resumes
  const filteredResumes = useMemo(() => {
    let result = resumes;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((r) => r.title.toLowerCase().includes(query));
    }

    // Sort
    result = sortResumes(result, sortOption);

    return result;
  }, [resumes, searchQuery, sortOption]);

  const hasResumes = resumes.length > 0;
  const hasResults = filteredResumes.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-foreground">{t('title')}</h1>
          {hasResumes && (
            <p className="mt-1 text-sm text-zinc-500">
              {t('resumeCount', { count: resumes.length })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            data-tour="dash-ai-generate"
            variant="outline"
            onClick={() => openModal('generate-resume')}
            className="cursor-pointer gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {t('aiGenerate')}
          </Button>
          <Button
            data-tour="dash-create"
            onClick={() => openModal('create-resume')}
            className="cursor-pointer gap-2 bg-pink-500 hover:bg-pink-600"
          >
            <Plus className="h-4 w-4" />
            {t('createResume')}
          </Button>
        </div>
      </div>

      {/* Toolbar: Search + Sort + View toggle */}
      {hasResumes && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div data-tour="dash-search" className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
              <SelectTrigger className="cursor-pointer" size="sm">
                <SelectValue placeholder={t('sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastEdited" className="cursor-pointer">
                  {t('sortLastEdited')}
                </SelectItem>
                <SelectItem value="created" className="cursor-pointer">
                  {t('sortCreated')}
                </SelectItem>
                <SelectItem value="nameAsc" className="cursor-pointer">
                  {t('sortNameAsc')}
                </SelectItem>
                <SelectItem value="nameDesc" className="cursor-pointer">
                  {t('sortNameDesc')}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* View toggle */}
            <div className="flex items-center rounded-md border border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => handleViewChange('grid')}
                className={cn(
                  'cursor-pointer rounded-l-md p-1.5 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-pink-500 text-white'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                )}
                title={t('viewGrid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleViewChange('list')}
                className={cn(
                  'cursor-pointer rounded-r-md p-1.5 transition-colors',
                  viewMode === 'list'
                    ? 'bg-pink-500 text-white'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                )}
                title={t('viewList')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading || fpLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : !hasResumes ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 py-16">
          <p className="text-zinc-500 dark:text-zinc-400">{t('noResumes')}</p>
        </div>
      ) : !hasResults ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 py-16">
          <p className="text-zinc-500 dark:text-zinc-400">{t('noSearchResults')}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <ResumeGrid
          resumes={filteredResumes}
          onDelete={deleteResume}
          onDuplicate={duplicateResume}
          onRename={renameResume}
          onShare={(id) => setShareResumeId(id)}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {filteredResumes.map((resume) => (
            <ResumeListItem
              key={resume.id}
              resume={resume}
              onDelete={() => deleteResume(resume.id)}
              onDuplicate={() => duplicateResume(resume.id)}
              onRename={(title) => renameResume(resume.id, title)}
            />
          ))}
        </div>
      )}

      <CreateResumeDialog
        open={activeModal === 'create-resume'}
        onClose={closeModal}
        onCreate={createResume}
      />
      <GenerateResumeDialog
        open={activeModal === 'generate-resume'}
        onOpenChange={(open) => open ? openModal('generate-resume') : closeModal()}
        onCreated={fetchResumes}
      />
      <SettingsDialog />
      {shareResumeId && (
        <ShareDialog
          open={!!shareResumeId}
          onOpenChange={(open) => { if (!open) setShareResumeId(null); }}
          resumeId={shareResumeId}
        />
      )}
      <TourOverlay tourId="dashboard" steps={DASHBOARD_TOUR_STEPS} />
    </div>
  );
}
