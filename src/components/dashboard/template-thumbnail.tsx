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

function ElegantThumb() {
  return (
    <div className="flex h-full flex-col p-2.5" style={{ fontFamily: 'serif' }}>
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-zinc-700" />
        <div className="mx-auto mt-0.5 h-1 w-8 rounded-full bg-zinc-400" />
        <div className="mx-auto mt-1 flex items-center justify-center gap-1">
          <div className="h-px w-4" style={{ background: '#d4af37' }} />
          <div className="h-1.5 w-1.5 rotate-45" style={{ background: '#d4af37' }} />
          <div className="h-px w-4" style={{ background: '#d4af37' }} />
        </div>
      </div>
      <div className="space-y-1.5 flex-1">
        <div>
          <div className="flex items-center gap-1">
            <div className="h-px flex-1" style={{ background: '#d4af37' }} />
            <div className="h-1 w-8 rounded-full" style={{ background: '#d4af37' }} />
            <div className="h-px flex-1" style={{ background: '#d4af37' }} />
          </div>
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExecutiveThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-2 py-2" style={{ background: '#2d3436' }}>
        <div className="h-1.5 w-10 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full" style={{ background: '#00b894' }} />
        <div className="mt-0.5 flex gap-0.5">
          <div className="h-0.5 w-3 rounded-full bg-white/30" />
          <div className="h-0.5 w-3 rounded-full bg-white/30" />
        </div>
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div>
          <div className="mb-0.5 border-b-2 pb-0.5" style={{ borderColor: '#00b894' }}>
            <div className="h-1 w-9 rounded-full bg-[#2d3436]" />
          </div>
          <div className="space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DeveloperThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-2 py-1.5" style={{ background: '#282c34' }}>
        <div className="mb-1 flex gap-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#ff5f56]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#ffbd2e]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="h-1.5 w-10 rounded-full" style={{ background: '#98c379' }} />
        <div className="mt-0.5 h-1 w-7 rounded-full" style={{ background: '#61afef' }} />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div>
          <div className="h-1 w-8 rounded-full" style={{ background: '#e5c07b' }} />
          <div className="mt-0.5 border-l-2 pl-1.5 space-y-0.5" style={{ borderColor: '#3e4451' }}>
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignerThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex">
        <div className="flex-1 p-2">
          <div className="h-2 w-12 rounded-full bg-black" />
          <div className="mt-0.5 h-1 w-7 rounded-full" style={{ background: '#ff6b6b' }} />
        </div>
        <div className="w-6" style={{ background: '#f0f0f0' }} />
      </div>
      <div className="h-0.5 w-full" style={{ background: '#ff6b6b' }} />
      <div className="flex-1 space-y-1.5 p-2">
        <div className="h-1 w-8 rounded-full" style={{ background: '#ff6b6b' }} />
        <div className="rounded bg-zinc-50 p-1">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="mt-0.5 h-0.5 w-3/4 rounded-full bg-zinc-200" />
        </div>
        <div className="rounded bg-zinc-50 p-1">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="mt-0.5 h-0.5 w-4/5 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function StartupThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="relative px-2 py-2" style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 8px)' }} />
        <div className="relative">
          <div className="h-1.5 w-10 rounded-full bg-white/90" />
          <div className="mt-0.5 h-1 w-7 rounded-full bg-white/50" />
        </div>
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div className="h-1 w-9 rounded-full bg-[#6366f1]" />
        <div className="border-l-2 pl-1.5 space-y-0.5" style={{ borderColor: '#06b6d4' }}>
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
        </div>
        <div className="flex gap-0.5">
          <div className="rounded-full border px-1 py-0.5" style={{ borderColor: '#6366f1' }}>
            <div className="h-0.5 w-3 rounded-full bg-[#6366f1]" />
          </div>
          <div className="rounded-full border px-1 py-0.5" style={{ borderColor: '#6366f1' }}>
            <div className="h-0.5 w-2 rounded-full bg-[#6366f1]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FormalThumb() {
  return (
    <div className="flex h-full flex-col p-2.5" style={{ fontFamily: 'serif' }}>
      <div className="mb-1.5 border-b-2 pb-1.5 text-center" style={{ borderColor: '#004d40' }}>
        <div className="mx-auto h-1.5 w-12 rounded-full" style={{ background: '#004d40' }} />
        <div className="mx-auto mt-0.5 h-1 w-8 rounded-full bg-zinc-400" />
      </div>
      <div className="space-y-1.5 flex-1">
        <div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-9 rounded-full" style={{ background: '#004d40' }} />
            <div className="h-px flex-1 bg-zinc-200" />
          </div>
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-7 rounded-full" style={{ background: '#004d40' }} />
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

function InfographicThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-2 py-2" style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)' }}>
        <div className="h-1.5 w-10 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full bg-white/50" />
      </div>
      <div className="flex-1 space-y-1 p-2">
        <div className="flex items-center gap-1">
          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 text-[4px] text-white">1</div>
          <div className="h-1 w-7 rounded-full bg-blue-500" />
        </div>
        <div className="rounded border border-zinc-100 p-1">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
        </div>
        <div className="flex items-center gap-1">
          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[4px] text-white">2</div>
          <div className="h-1 w-6 rounded-full bg-red-500" />
        </div>
        <div className="flex gap-0.5">
          <div className="rounded-full bg-amber-400 px-1 py-0.5"><div className="h-0.5 w-2 rounded-full bg-white" /></div>
          <div className="rounded-full bg-green-500 px-1 py-0.5"><div className="h-0.5 w-2 rounded-full bg-white" /></div>
        </div>
      </div>
    </div>
  );
}

function CompactThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-zinc-200 px-2 py-1.5">
        <div className="h-1.5 w-10 rounded-full bg-zinc-700" />
        <div className="mt-0.5 flex gap-0.5">
          <div className="h-0.5 w-3 rounded-full bg-zinc-300" />
          <div className="h-0.5 w-3 rounded-full bg-zinc-300" />
          <div className="h-0.5 w-3 rounded-full bg-zinc-300" />
        </div>
      </div>
      <div className="flex flex-1">
        <div className="w-[35%] bg-zinc-50 p-1.5 space-y-1">
          <div className="h-0.5 w-full rounded-full bg-zinc-300" />
          <div className="h-0.5 w-3/4 rounded-full bg-zinc-300" />
          <div className="h-0.5 w-full rounded-full bg-zinc-300" />
          <div className="h-0.5 w-2/3 rounded-full bg-zinc-300" />
        </div>
        <div className="flex-1 p-1.5 space-y-1">
          <div className="h-0.5 w-8 rounded-full bg-zinc-600" />
          <div className="space-y-[2px]">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
          <div className="h-0.5 w-6 rounded-full bg-zinc-600" />
          <div className="space-y-[2px]">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EuroThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-1 flex items-start justify-between">
        <div>
          <div className="h-1.5 w-10 rounded-full bg-[#1e40af]" />
          <div className="mt-0.5 h-1 w-7 rounded-full bg-zinc-400" />
          <div className="mt-0.5 space-y-[2px]">
            <div className="h-0.5 w-6 rounded-full bg-zinc-300" />
            <div className="h-0.5 w-5 rounded-full bg-zinc-300" />
          </div>
        </div>
        <div className="h-6 w-5 rounded-sm border" style={{ borderColor: '#1e40af', background: '#eff6ff' }} />
      </div>
      <div className="mb-1 h-0.5 w-full rounded" style={{ background: '#1e40af' }} />
      <div className="flex-1 space-y-1">
        <div className="flex gap-1.5">
          <div className="w-6 shrink-0 text-right">
            <div className="h-0.5 w-full rounded-full bg-[#1e40af]" />
          </div>
          <div className="flex-1 border-l pl-1.5 space-y-0.5" style={{ borderColor: '#dbeafe' }}>
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="w-6 shrink-0 text-right">
            <div className="h-0.5 w-full rounded-full bg-[#1e40af]" />
          </div>
          <div className="flex-1 border-l pl-1.5 space-y-0.5" style={{ borderColor: '#dbeafe' }}>
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CleanThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-1.5">
        <div className="h-1.5 w-10 rounded-full" style={{ background: '#0066cc' }} />
        <div className="mt-0.5 h-1 w-7 rounded-full" style={{ background: '#0d9488' }} />
        <div className="mt-0.5 flex gap-1">
          <div className="h-0.5 w-3 rounded-full bg-zinc-300" />
          <div className="h-0.5 w-3 rounded-full bg-zinc-300" />
        </div>
        <div className="mt-1 h-0.5 w-full rounded-full" style={{ background: 'linear-gradient(90deg, #0066cc, #0d9488)' }} />
      </div>
      <div className="space-y-1.5 flex-1">
        <div>
          <div className="h-1 w-9 rounded-full" style={{ background: '#0066cc' }} />
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div>
          <div className="h-1 w-7 rounded-full" style={{ background: '#0066cc' }} />
          <div className="mt-0.5 flex gap-0.5">
            <div className="rounded-full border px-1 py-0.5" style={{ borderColor: '#0d9488' }}>
              <div className="h-0.5 w-2 rounded-full" style={{ background: '#0d9488' }} />
            </div>
            <div className="rounded-full border px-1 py-0.5" style={{ borderColor: '#0d9488' }}>
              <div className="h-0.5 w-2 rounded-full" style={{ background: '#0d9488' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoldThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="bg-black px-2 py-2">
        <div className="h-2 w-12 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full bg-white/40" />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div>
          <div className="mb-0.5 border-b-[3px] border-black pb-0.5">
            <div className="h-1.5 w-10 rounded-sm bg-black" />
          </div>
          <div className="space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div>
          <div className="mb-0.5 border-b-[3px] border-black pb-0.5">
            <div className="h-1.5 w-8 rounded-sm bg-black" />
          </div>
          <div className="flex gap-0.5">
            <div className="border-2 border-black px-1 py-0.5"><div className="h-0.5 w-2 rounded-full bg-black" /></div>
            <div className="border-2 border-black px-1 py-0.5"><div className="h-0.5 w-2 rounded-full bg-black" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-10 rounded-full bg-[#475569]" />
        <div className="mx-auto mt-0.5 h-1 w-7 rounded-full bg-[#3b82f6]" />
      </div>
      <div className="h-1 w-8 rounded-full bg-[#475569]" />
      <div className="mt-1 flex-1 border-l-2 pl-2 ml-1" style={{ borderColor: '#e2e8f0' }}>
        <div className="relative mb-2">
          <div className="absolute -left-[13px] top-0.5 h-2 w-2 rounded-full border-2 bg-white" style={{ borderColor: '#3b82f6' }} />
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="mt-0.5 h-0.5 w-3/4 rounded-full bg-zinc-200" />
        </div>
        <div className="relative mb-2">
          <div className="absolute -left-[13px] top-0.5 h-2 w-2 rounded-full border-2 bg-white" style={{ borderColor: '#3b82f6' }} />
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="mt-0.5 h-0.5 w-4/5 rounded-full bg-zinc-200" />
        </div>
        <div className="relative">
          <div className="absolute -left-[13px] top-0.5 h-2 w-2 rounded-full border-2 bg-white" style={{ borderColor: '#3b82f6' }} />
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
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
  elegant: ElegantThumb,
  executive: ExecutiveThumb,
  developer: DeveloperThumb,
  designer: DesignerThumb,
  startup: StartupThumb,
  formal: FormalThumb,
  infographic: InfographicThumb,
  compact: CompactThumb,
  euro: EuroThumb,
  clean: CleanThumb,
  bold: BoldThumb,
  timeline: TimelineThumb,
};

export function TemplateThumbnail({ template, className = '' }: TemplateThumbnailProps) {
  const Thumb = thumbnails[template] || ClassicThumb;
  return (
    <div className={`overflow-hidden rounded-md bg-white ${className}`}>
      <Thumb />
    </div>
  );
}
