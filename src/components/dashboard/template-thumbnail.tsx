'use client';

/**
 * Pure CSS mini-preview thumbnails for each resume template.
 * Used in ResumeCard and CreateResumeDialog to show layout style.
 */

interface TemplateThumbnailProps {
  template: string;
  className?: string;
}

function ClassicThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      {/* Header with bottom border */}
      <div className="mb-1.5 border-b-2 border-zinc-700 pb-1.5">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-700" />
        <div className="mx-auto mt-1 h-1 w-8 rounded-full bg-zinc-400" />
        <div className="mx-auto mt-0.5 flex justify-center gap-1">
          <div className="h-0.5 w-4 rounded-full bg-zinc-300" />
          <div className="h-0.5 w-4 rounded-full bg-zinc-300" />
        </div>
      </div>
      {/* Body lines */}
      <div className="space-y-1.5 flex-1">
        <div>
          <div className="h-1 w-10 rounded-full bg-zinc-600" />
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div>
          <div className="h-1 w-8 rounded-full bg-zinc-600" />
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModernThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Dark gradient header */}
      <div className="relative px-2 py-2" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}>
        <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-pink-500/20" />
        <div className="h-1.5 w-10 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full bg-white/50" />
        <div className="mt-0.5 flex gap-0.5">
          <div className="h-0.5 w-3 rounded-full bg-white/30" />
          <div className="h-0.5 w-3 rounded-full bg-white/30" />
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 space-y-1.5 p-2">
        <div>
          <div className="h-1 w-9 rounded-full bg-[#0f3460]" />
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div>
          <div className="h-1 w-7 rounded-full bg-[#0f3460]" />
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      {/* Simple header, left-aligned */}
      <div className="mb-2">
        <div className="h-1.5 w-10 rounded-full bg-zinc-700" />
        <div className="mt-0.5 flex gap-1">
          <div className="h-0.5 w-3 rounded-full bg-zinc-300" />
          <div className="h-0.5 w-3 rounded-full bg-zinc-300" />
          <div className="h-0.5 w-3 rounded-full bg-zinc-300" />
        </div>
      </div>
      {/* Thin separator */}
      <div className="mb-1.5 h-px w-full bg-zinc-200" />
      {/* Body - very clean */}
      <div className="space-y-1.5 flex-1">
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-2/3 rounded-full bg-zinc-200" />
        </div>
        <div className="h-px w-full bg-zinc-100" />
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function ProfessionalThumb() {
  return (
    <div className="flex h-full flex-col p-2.5" style={{ fontFamily: 'serif' }}>
      {/* Centered header with gradient divider */}
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-14 rounded-full bg-[#1e3a5f]" />
        <div className="mx-auto mt-0.5 h-1 w-8 rounded-full bg-zinc-400" />
        <div className="mx-auto mt-1 h-0.5 w-full rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #1e3a5f, transparent)' }} />
      </div>
      {/* Sections with trailing lines */}
      <div className="space-y-1.5 flex-1">
        <div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-10 rounded-full bg-[#1e3a5f]" />
            <div className="h-px flex-1 bg-zinc-200" />
          </div>
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-8 rounded-full bg-[#1e3a5f]" />
            <div className="h-px flex-1 bg-zinc-200" />
          </div>
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TwoColumnThumb() {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Left dark sidebar */}
      <div className="w-[35%] p-1.5" style={{ background: 'linear-gradient(180deg, #1a1a2e, #2d2d44)' }}>
        <div className="mb-1.5">
          <div className="mx-auto h-4 w-4 rounded-full bg-white/20" />
          <div className="mx-auto mt-0.5 h-1 w-8 rounded-full bg-white/60" />
        </div>
        <div className="space-y-1">
          <div className="h-0.5 w-full rounded-full bg-white/20" />
          <div className="h-0.5 w-4/5 rounded-full bg-white/20" />
          <div className="h-0.5 w-full rounded-full bg-white/20" />
          <div className="h-0.5 w-3/5 rounded-full bg-white/20" />
        </div>
      </div>
      {/* Right content */}
      <div className="flex-1 space-y-1.5 p-2">
        <div>
          <div className="h-1 w-9 rounded-full bg-zinc-600" />
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div>
          <div className="h-1 w-7 rounded-full bg-zinc-600" />
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CreativeThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Gradient header with circles */}
      <div className="relative px-2 py-2" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }}>
        <div className="absolute right-1 top-0 h-3 w-3 rounded-full bg-white/10" />
        <div className="absolute right-3 top-2 h-2 w-2 rounded-full bg-white/10" />
        <div className="h-1.5 w-10 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full bg-white/50" />
      </div>
      {/* Cards and bars */}
      <div className="flex-1 space-y-1.5 p-2">
        <div className="rounded border border-zinc-100 p-1">
          <div className="h-0.5 w-8 rounded-full bg-purple-300" />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-zinc-200" />
        </div>
        {/* Skill bars */}
        <div className="space-y-0.5">
          <div className="h-1 w-full rounded-full bg-purple-100">
            <div className="h-1 w-4/5 rounded-full bg-purple-400" />
          </div>
          <div className="h-1 w-full rounded-full bg-orange-100">
            <div className="h-1 w-3/5 rounded-full bg-orange-400" />
          </div>
          <div className="h-1 w-full rounded-full bg-purple-100">
            <div className="h-1 w-2/3 rounded-full bg-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AtsThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      {/* Plain centered header */}
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-14 rounded-full bg-black" />
        <div className="mx-auto mt-0.5 h-1 w-8 rounded-full bg-zinc-500" />
        <div className="mx-auto mt-0.5 flex justify-center gap-1">
          <div className="h-0.5 w-3 rounded-full bg-zinc-400" />
          <div className="h-0.5 w-3 rounded-full bg-zinc-400" />
          <div className="h-0.5 w-3 rounded-full bg-zinc-400" />
        </div>
      </div>
      {/* Sections with underline headers */}
      <div className="space-y-1.5 flex-1">
        <div>
          <div className="mb-0.5 border-b border-black pb-0.5">
            <div className="h-1 w-12 rounded-sm bg-black" />
          </div>
          <div className="space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-300" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-300" />
          </div>
        </div>
        <div>
          <div className="mb-0.5 border-b border-black pb-0.5">
            <div className="h-1 w-10 rounded-sm bg-black" />
          </div>
          <div className="space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-300" />
            <div className="h-0.5 w-3/4 rounded-full bg-zinc-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AcademicThumb() {
  return (
    <div className="flex h-full flex-col px-2.5 py-2" style={{ fontFamily: 'serif' }}>
      {/* LaTeX-style centered header */}
      <div className="mb-1 text-center">
        <div className="mx-auto h-1.5 w-12 rounded-sm bg-zinc-800" />
        <div className="mx-auto mt-0.5 h-0.5 w-16 rounded-full bg-zinc-400" style={{ fontStyle: 'italic' }} />
        <div className="mx-auto mt-0.5 flex justify-center gap-0.5">
          <div className="h-0.5 w-2 rounded-full bg-zinc-300" />
          <span className="text-[3px] text-zinc-300">&middot;</span>
          <div className="h-0.5 w-2 rounded-full bg-zinc-300" />
          <span className="text-[3px] text-zinc-300">&middot;</span>
          <div className="h-0.5 w-2 rounded-full bg-zinc-300" />
        </div>
      </div>
      {/* Dense content */}
      <div className="space-y-1 flex-1">
        <div>
          <div className="mb-0.5 flex items-center gap-1">
            <div className="h-1 w-9 rounded-sm bg-zinc-700" />
          </div>
          <div className="space-y-[2px]">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-3/5 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div>
          <div className="h-1 w-7 rounded-sm bg-zinc-700" />
          <div className="mt-0.5 space-y-[2px]">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

const thumbnails: Record<string, React.FC> = {
  classic: ClassicThumb,
  modern: ModernThumb,
  minimal: MinimalThumb,
  professional: ProfessionalThumb,
  'two-column': TwoColumnThumb,
  creative: CreativeThumb,
  ats: AtsThumb,
  academic: AcademicThumb,
};

export function TemplateThumbnail({ template, className = '' }: TemplateThumbnailProps) {
  const Thumb = thumbnails[template] || ClassicThumb;
  return (
    <div className={`overflow-hidden rounded-md bg-white ${className}`}>
      <Thumb />
    </div>
  );
}
