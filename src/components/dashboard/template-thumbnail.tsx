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

// ─── Batch 1: Industry/Professional ──────────────────────────
function NordicThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-10 rounded-full bg-[#64748b]" />
        <div className="mx-auto mt-0.5 h-1 w-7 rounded-full bg-[#94a3b8]" />
        <div className="mx-auto mt-0.5 flex justify-center gap-1">
          <div className="h-0.5 w-3 rounded-full bg-[#cbd5e1]" />
          <div className="h-0.5 w-3 rounded-full bg-[#cbd5e1]" />
        </div>
      </div>
      <div className="mb-1.5 h-px w-full bg-[#e2e8f0]" />
      <div className="space-y-1.5 flex-1">
        <div>
          <div className="h-0.5 w-8 rounded-full bg-[#64748b]" />
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-100" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-100" />
          </div>
        </div>
        <div>
          <div className="h-0.5 w-6 rounded-full bg-[#64748b]" />
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-100" />
            <div className="h-0.5 w-3/4 rounded-full bg-zinc-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CorporateThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-2 py-2" style={{ background: '#0f172a' }}>
        <div className="h-1.5 w-10 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full bg-white/40" />
        <div className="mt-0.5 flex gap-0.5">
          <div className="h-0.5 w-3 rounded-full bg-white/30" />
          <div className="h-0.5 w-3 rounded-full bg-white/30" />
        </div>
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div>
          <div className="mb-0.5 border-b-2 pb-0.5" style={{ borderColor: '#2563eb' }}>
            <div className="h-1 w-9 rounded-full bg-[#0f172a]" />
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

function ConsultantThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-0.5 h-0.5 w-full rounded-full" style={{ background: '#2563eb' }} />
      <div className="mb-1.5">
        <div className="h-1.5 w-10 rounded-full bg-[#374151]" />
        <div className="mt-0.5 h-1 w-7 rounded-full bg-zinc-400" />
      </div>
      <div className="space-y-1.5 flex-1">
        <div>
          <div className="flex items-center gap-0.5">
            <div className="h-full w-0.5 self-stretch rounded-full" style={{ background: '#2563eb' }} />
            <div className="h-1 w-8 rounded-full bg-[#374151]" />
          </div>
          <div className="mt-0.5 pl-1.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FinanceThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-2 py-2" style={{ background: '#1e293b' }}>
        <div className="h-1.5 w-10 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full" style={{ background: '#c4a747' }} />
      </div>
      <div className="h-0.5 w-full" style={{ background: '#c4a747' }} />
      <div className="flex-1 space-y-1.5 p-2" style={{ fontFamily: 'serif' }}>
        <div>
          <div className="mb-0.5 border-t border-b pb-0.5 pt-0.5" style={{ borderColor: '#c4a747' }}>
            <div className="h-1 w-8 rounded-full bg-[#1e293b]" />
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

function MedicalThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-10 rounded-full bg-[#115e59]" />
        <div className="mx-auto mt-0.5 h-1 w-7 rounded-full bg-[#0d9488]" />
      </div>
      <div className="space-y-1.5 flex-1">
        <div>
          <div className="mb-0.5 rounded-full px-1 py-0.5" style={{ background: '#0d9488' }}>
            <div className="h-0.5 w-6 rounded-full bg-white" />
          </div>
          <div className="rounded border-l-2 p-1" style={{ borderColor: '#0d9488', background: '#f0fdfa' }}>
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="mt-0.5 h-0.5 w-3/4 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Batch 2: Modern/Tech ────────────────────────────────────
function GradientThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-2 py-2" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
        <div className="h-1.5 w-10 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full bg-white/50" />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div>
          <div className="h-1 w-9 rounded-full" style={{ background: 'linear-gradient(90deg, #ec4899, #8b5cf6)' }} />
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div className="flex gap-0.5">
          <div className="rounded-full border px-1 py-0.5" style={{ borderColor: '#a855f7' }}>
            <div className="h-0.5 w-2 rounded-full" style={{ background: '#a855f7' }} />
          </div>
          <div className="rounded-full border px-1 py-0.5" style={{ borderColor: '#a855f7' }}>
            <div className="h-0.5 w-2 rounded-full" style={{ background: '#a855f7' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetroThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-1.5">
        <div className="h-1.5 w-10 rounded-sm bg-[#1e293b]" />
        <div className="mt-0.5 h-1 w-7 rounded-sm bg-zinc-400" />
      </div>
      <div className="space-y-1 flex-1">
        <div className="rounded-sm p-1" style={{ background: '#f59e0b' }}>
          <div className="h-0.5 w-6 rounded-full bg-white" />
        </div>
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
        </div>
        <div className="rounded-sm p-1" style={{ background: '#3b82f6' }}>
          <div className="h-0.5 w-5 rounded-full bg-white" />
        </div>
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function MaterialThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-2 py-2 shadow-md" style={{ background: '#4f46e5' }}>
        <div className="h-1.5 w-10 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full bg-white/50" />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div className="rounded p-1 shadow-sm" style={{ background: '#fafafa' }}>
          <div className="h-0.5 w-6 rounded-full" style={{ background: '#7c3aed' }} />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-zinc-200" />
        </div>
        <div className="rounded p-1 shadow-sm" style={{ background: '#fafafa' }}>
          <div className="h-0.5 w-5 rounded-full" style={{ background: '#7c3aed' }} />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function CoderThumb() {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-[35%] p-1.5" style={{ background: '#0d1117' }}>
        <div className="mb-1 h-4 w-4 mx-auto rounded-full bg-white/20" />
        <div className="mx-auto h-1 w-8 rounded-full" style={{ background: '#58a6ff' }} />
        <div className="mt-1 space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-white/15" />
          <div className="h-0.5 w-3/4 rounded-full bg-white/15" />
        </div>
      </div>
      <div className="flex-1 space-y-1.5 p-2 bg-white">
        <div>
          <div className="h-1 w-7 rounded-full" style={{ background: '#58a6ff' }} />
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
        <div className="rounded p-0.5" style={{ background: '#161b22' }}>
          <div className="h-0.5 w-3 rounded-full" style={{ background: '#3fb950' }} />
        </div>
      </div>
    </div>
  );
}

function BlocksThumb() {
  return (
    <div className="flex h-full flex-col p-2.5" style={{ background: '#f7f6f3' }}>
      <div className="mb-1.5">
        <div className="h-1.5 w-10 rounded-full" style={{ background: '#37352f' }} />
        <div className="mt-0.5 h-1 w-7 rounded-full bg-zinc-400" />
      </div>
      <div className="space-y-1 flex-1">
        <div className="border-l-2 pl-1" style={{ borderColor: '#2383e2' }}>
          <div className="h-0.5 w-6 rounded-full" style={{ background: '#37352f' }} />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-zinc-300" />
        </div>
        <div className="border-l-2 pl-1" style={{ borderColor: '#2383e2' }}>
          <div className="h-0.5 w-5 rounded-full" style={{ background: '#37352f' }} />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-zinc-300" />
        </div>
      </div>
    </div>
  );
}

// ─── Batch 3: Creative/Artistic ──────────────────────────────
function MagazineThumb() {
  return (
    <div className="flex h-full flex-col p-2.5" style={{ fontFamily: 'serif' }}>
      <div className="mb-1.5">
        <div className="h-2 w-14 rounded-sm bg-[#1a1a1a]" />
        <div className="mt-0.5 h-1 w-8 rounded-sm" style={{ background: '#dc2626' }} />
      </div>
      <div className="mb-1 h-px w-full bg-[#dc2626]" />
      <div className="flex gap-1.5 flex-1">
        <div className="flex-1 space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-2/3 rounded-full bg-zinc-200" />
        </div>
        <div className="flex-1 space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function ArtisticThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-2 py-2" style={{ background: '#1e1b4b' }}>
        <div className="h-1.5 w-10 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full" style={{ background: '#f43f5e' }} />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div className="border border-dashed border-[#f43f5e] rounded p-1">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
        </div>
        <div className="flex gap-0.5">
          <div className="h-2 w-2 rounded-full" style={{ background: '#f43f5e' }} />
          <div className="h-2 w-2 rounded-full" style={{ background: '#fbbf24' }} />
          <div className="h-2 w-2 rounded-full" style={{ background: '#1e1b4b' }} />
        </div>
      </div>
    </div>
  );
}

function RetroThumb() {
  return (
    <div className="flex h-full flex-col p-2.5" style={{ background: '#fefce8' }}>
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-10 rounded-sm" style={{ background: '#78350f' }} />
        <div className="mx-auto mt-0.5 h-1 w-7 rounded-sm" style={{ background: '#92400e' }} />
      </div>
      <div className="mb-1 flex items-center gap-0.5 justify-center">
        <div className="h-px w-3" style={{ background: '#92400e' }} />
        <div className="h-1 w-1 rounded-full" style={{ background: '#92400e' }} />
        <div className="h-px w-3" style={{ background: '#92400e' }} />
      </div>
      <div className="space-y-1 flex-1">
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-amber-200" />
          <div className="h-0.5 w-4/5 rounded-full bg-amber-200" />
        </div>
      </div>
    </div>
  );
}

function NeonThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ background: '#111827' }}>
      <div className="px-2 py-2">
        <div className="h-1.5 w-10 rounded-full" style={{ background: '#22d3ee' }} />
        <div className="mt-0.5 h-1 w-7 rounded-full" style={{ background: '#a78bfa' }} />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div className="border-b pb-0.5" style={{ borderColor: '#22d3ee', boxShadow: '0 1px 4px #22d3ee40' }}>
          <div className="h-0.5 w-7 rounded-full" style={{ background: '#22d3ee' }} />
        </div>
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-white/10" />
          <div className="h-0.5 w-3/4 rounded-full bg-white/10" />
        </div>
        <div className="flex gap-0.5">
          <div className="rounded-full border px-1 py-0.5" style={{ borderColor: '#a78bfa' }}>
            <div className="h-0.5 w-2 rounded-full" style={{ background: '#a78bfa' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function WatercolorThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-10 rounded-full" style={{ background: '#4c1d95' }} />
        <div className="mx-auto mt-0.5 h-1 w-7 rounded-full" style={{ background: '#c084fc' }} />
      </div>
      <div className="space-y-1.5 flex-1">
        <div className="rounded-lg p-1" style={{ background: '#f5f3ff' }}>
          <div className="h-0.5 w-5 rounded-full" style={{ background: '#c084fc' }} />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-violet-100" />
        </div>
        <div className="rounded-lg p-1" style={{ background: '#fdf4ff' }}>
          <div className="h-0.5 w-4 rounded-full" style={{ background: '#c084fc' }} />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-violet-100" />
        </div>
      </div>
    </div>
  );
}

// ─── Batch 4: Style/Culture ──────────────────────────────────
function SwissThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-1.5">
        <div className="h-2 w-14 rounded-sm bg-black" />
        <div className="mt-0.5 flex gap-1">
          <div className="h-0.5 w-3 rounded-full bg-zinc-400" />
          <div className="h-0.5 w-3 rounded-full bg-zinc-400" />
        </div>
      </div>
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-0.5">
          <div className="h-1.5 w-1.5" style={{ background: '#dc2626' }} />
          <div className="h-1 w-8 rounded-sm bg-black" />
        </div>
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function JapaneseThumb() {
  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-2 text-center">
        <div className="mx-auto h-1.5 w-8 rounded-full bg-[#1c1917]" />
        <div className="mx-auto mt-1 h-1 w-6 rounded-full bg-[#a8a29e]" />
      </div>
      <div className="mb-2 h-px w-full bg-[#e7e5e4]" />
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-1">
          <div className="h-1 w-1 rounded-full bg-[#a8a29e]" />
          <div className="h-0.5 w-6 rounded-full bg-[#a8a29e]" />
        </div>
        <div className="space-y-0.5 pl-2">
          <div className="h-0.5 w-full rounded-full bg-zinc-100" />
          <div className="h-0.5 w-3/5 rounded-full bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}

function BerlinThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="relative px-2 py-2 bg-black">
        <div className="absolute right-1 top-0.5 h-2 w-2 rounded-full" style={{ background: '#eab308' }} />
        <div className="absolute right-3.5 top-1 h-1.5 w-1.5" style={{ background: '#dc2626' }} />
        <div className="h-1.5 w-10 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full" style={{ background: '#2563eb' }} />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div className="flex items-center gap-0.5">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#2563eb' }} />
          <div className="h-1 w-7 rounded-full bg-black" />
        </div>
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function LuxeThumb() {
  return (
    <div className="flex h-full flex-col p-2.5" style={{ background: '#fafaf9', fontFamily: 'serif' }}>
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-10 rounded-full bg-black" />
        <div className="mx-auto mt-0.5 flex items-center justify-center gap-1">
          <div className="h-px w-3" style={{ background: '#d4af37' }} />
          <div className="h-1 w-1 rotate-45" style={{ background: '#d4af37' }} />
          <div className="h-px w-3" style={{ background: '#d4af37' }} />
        </div>
      </div>
      <div className="space-y-1.5 flex-1">
        <div>
          <div className="flex items-center gap-1">
            <div className="h-px flex-1" style={{ background: '#d4af37' }} />
            <div className="h-0.5 w-6 rounded-full" style={{ background: '#d4af37' }} />
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

function RoseThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-1.5 rounded-xl p-1.5" style={{ background: '#fff1f2' }}>
        <div className="mx-auto h-1.5 w-10 rounded-full" style={{ background: '#881337' }} />
        <div className="mx-auto mt-0.5 h-1 w-7 rounded-full" style={{ background: '#be185d' }} />
      </div>
      <div className="space-y-1.5 flex-1">
        <div>
          <div className="h-0.5 w-7 rounded-full" style={{ background: '#be185d' }} />
          <div className="mt-0.5 space-y-0.5">
            <div className="h-0.5 w-full rounded-full bg-rose-100" />
            <div className="h-0.5 w-4/5 rounded-full bg-rose-100" />
          </div>
        </div>
        <div className="flex gap-0.5">
          <div className="rounded-full px-1 py-0.5" style={{ background: '#ffe4e6' }}>
            <div className="h-0.5 w-2 rounded-full" style={{ background: '#be185d' }} />
          </div>
          <div className="rounded-full px-1 py-0.5" style={{ background: '#ffe4e6' }}>
            <div className="h-0.5 w-2 rounded-full" style={{ background: '#be185d' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Batch 5: Specialized ────────────────────────────────────
function ArchitectThumb() {
  return (
    <div className="flex h-full flex-col p-2.5" style={{ backgroundImage: 'linear-gradient(#dbeafe 1px, transparent 1px), linear-gradient(90deg, #dbeafe 1px, transparent 1px)', backgroundSize: '8px 8px' }}>
      <div className="mb-1.5">
        <div className="h-1.5 w-10 rounded-sm" style={{ background: '#1e3a5f' }} />
        <div className="mt-0.5 h-1 w-7 rounded-sm" style={{ background: '#1d4ed8' }} />
      </div>
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-0.5">
          <div className="h-1 w-1 rotate-45" style={{ background: '#1d4ed8' }} />
          <div className="h-0.5 w-6 rounded-full" style={{ background: '#1e3a5f' }} />
          <div className="h-px flex-1 bg-zinc-300" />
        </div>
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function LegalThumb() {
  return (
    <div className="flex h-full flex-col p-2.5" style={{ fontFamily: 'serif' }}>
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-12 rounded-sm" style={{ background: '#1a472a' }} />
        <div className="mx-auto mt-0.5 h-1 w-8 rounded-sm bg-zinc-400" />
      </div>
      <div className="mb-1">
        <div className="h-px w-full" style={{ background: '#166534' }} />
        <div className="mt-0.5 h-px w-full" style={{ background: '#166534' }} />
      </div>
      <div className="space-y-1 flex-1">
        <div className="h-1 w-8 rounded-sm" style={{ background: '#1a472a' }} />
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function TeacherThumb() {
  return (
    <div className="flex h-full flex-col p-2.5" style={{ background: '#fff7ed' }}>
      <div className="mb-1.5">
        <div className="h-1.5 w-10 rounded-full" style={{ background: '#9a3412' }} />
        <div className="mt-0.5 rounded-full px-1 py-0.5" style={{ background: '#ea580c' }}>
          <div className="h-0.5 w-5 rounded-full bg-white" />
        </div>
      </div>
      <div className="space-y-1 flex-1">
        <div className="rounded-full px-1 py-0.5" style={{ background: '#9a3412' }}>
          <div className="h-0.5 w-6 rounded-full bg-white" />
        </div>
        <div className="rounded border-l-2 p-1" style={{ borderColor: '#ea580c', background: 'white' }}>
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function ScientistThumb() {
  return (
    <div className="flex h-full flex-col p-2.5" style={{ fontFamily: 'serif' }}>
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-10 rounded-sm bg-[#0f172a]" />
        <div className="mx-auto mt-0.5 h-1 w-7 rounded-sm bg-zinc-400" />
      </div>
      <div className="mb-1 h-px w-full bg-zinc-300" />
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-0.5">
          <span className="text-[5px] font-bold" style={{ color: '#0891b2' }}>1.</span>
          <div className="h-0.5 w-7 rounded-full bg-[#0f172a]" />
        </div>
        <div className="flex items-start gap-0.5 pl-2">
          <span className="text-[4px]" style={{ color: '#0891b2' }}>[1]</span>
          <div className="space-y-0.5 flex-1">
            <div className="h-0.5 w-full rounded-full bg-zinc-200" />
            <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EngineerThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="px-2 py-2" style={{ background: 'linear-gradient(135deg, #1e293b, #334155)' }}>
        <div className="h-1.5 w-10 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full" style={{ background: '#0284c7' }} />
      </div>
      <div className="h-0.5 w-full" style={{ background: '#0284c7' }} />
      <div className="flex-1 space-y-1.5 p-2">
        <div className="flex items-center gap-0.5">
          <div className="h-1 w-1" style={{ background: '#0284c7' }} />
          <div className="h-0.5 w-7 rounded-full bg-[#1e293b]" />
          <div className="h-px flex-1 bg-zinc-200" />
        </div>
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

// ─── Batch 6: Layout Variants ────────────────────────────────
function SidebarThumb() {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-[35%] p-1.5" style={{ background: '#1e40af' }}>
        <div className="mb-1 mx-auto h-4 w-4 rounded-full bg-white/20" />
        <div className="mx-auto h-1 w-8 rounded-full bg-white/70" />
        <div className="mt-1 space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-white/20" />
          <div className="h-0.5 w-3/4 rounded-full bg-white/20" />
          <div className="h-0.5 w-full rounded-full bg-white/20" />
        </div>
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div className="h-1 w-9 rounded-full" style={{ background: '#1e40af' }} />
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-4/5 rounded-full bg-zinc-200" />
        </div>
        <div className="h-1 w-7 rounded-full" style={{ background: '#1e40af' }} />
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function CardThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-10 rounded-full bg-[#18181b]" />
        <div className="mx-auto mt-0.5 h-1 w-7 rounded-full bg-zinc-400" />
      </div>
      <div className="space-y-1 flex-1">
        <div className="rounded-lg border border-zinc-100 p-1 shadow-sm" style={{ background: '#fafafa' }}>
          <div className="h-0.5 w-5 rounded-full" style={{ background: '#6366f1' }} />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-zinc-200" />
        </div>
        <div className="rounded-lg border border-zinc-100 p-1 shadow-sm" style={{ background: '#fafafa' }}>
          <div className="h-0.5 w-4 rounded-full" style={{ background: '#6366f1' }} />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function ZigzagThumb() {
  return (
    <div className="flex h-full flex-col p-2.5">
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-10 rounded-full bg-[#1e293b]" />
        <div className="mx-auto mt-0.5 h-1 w-7 rounded-full" style={{ background: '#8b5cf6' }} />
      </div>
      <div className="space-y-1 flex-1">
        <div className="text-left">
          <div className="h-0.5 w-6 rounded-full" style={{ background: '#8b5cf6' }} />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-zinc-200" />
        </div>
        <div className="rounded p-0.5" style={{ background: '#f5f3ff' }}>
          <div className="h-0.5 w-6 ml-auto rounded-full" style={{ background: '#8b5cf6' }} />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-violet-100" />
        </div>
        <div className="text-left">
          <div className="h-0.5 w-5 rounded-full" style={{ background: '#8b5cf6' }} />
          <div className="mt-0.5 h-0.5 w-full rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function RibbonThumb() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="relative px-2 py-2" style={{ background: '#1e293b' }}>
        <div className="absolute right-0 top-0 h-3 w-5" style={{ background: '#dc2626', clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }} />
        <div className="h-1.5 w-10 rounded-full bg-white/90" />
        <div className="mt-0.5 h-1 w-7 rounded-full bg-white/40" />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <div className="flex items-center gap-0.5">
          <div className="h-2 w-0.5 rounded-sm" style={{ background: '#dc2626' }} />
          <div className="h-1 w-7 rounded-full bg-[#1e293b]" />
        </div>
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-full bg-zinc-200" />
          <div className="h-0.5 w-3/4 rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

function MosaicThumb() {
  return (
    <div className="flex h-full flex-col p-2">
      <div className="mb-1.5 text-center">
        <div className="mx-auto h-1.5 w-10 rounded-full bg-[#1e293b]" />
        <div className="mx-auto mt-0.5 h-1 w-7 rounded-full bg-zinc-400" />
      </div>
      <div className="grid grid-cols-2 gap-0.5 flex-1">
        <div className="rounded p-0.5" style={{ background: '#eff6ff' }}>
          <div className="h-0.5 w-full rounded-full" style={{ background: '#3b82f6' }} />
        </div>
        <div className="rounded p-0.5" style={{ background: '#ecfdf5' }}>
          <div className="h-0.5 w-full rounded-full" style={{ background: '#10b981' }} />
        </div>
        <div className="rounded p-0.5" style={{ background: '#fffbeb' }}>
          <div className="h-0.5 w-full rounded-full" style={{ background: '#f59e0b' }} />
        </div>
        <div className="rounded p-0.5" style={{ background: '#f5f3ff' }}>
          <div className="h-0.5 w-full rounded-full" style={{ background: '#8b5cf6' }} />
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
  // Batch 1
  nordic: NordicThumb,
  corporate: CorporateThumb,
  consultant: ConsultantThumb,
  finance: FinanceThumb,
  medical: MedicalThumb,
  // Batch 2
  gradient: GradientThumb,
  metro: MetroThumb,
  material: MaterialThumb,
  coder: CoderThumb,
  blocks: BlocksThumb,
  // Batch 3
  magazine: MagazineThumb,
  artistic: ArtisticThumb,
  retro: RetroThumb,
  neon: NeonThumb,
  watercolor: WatercolorThumb,
  // Batch 4
  swiss: SwissThumb,
  japanese: JapaneseThumb,
  berlin: BerlinThumb,
  luxe: LuxeThumb,
  rose: RoseThumb,
  // Batch 5
  architect: ArchitectThumb,
  legal: LegalThumb,
  teacher: TeacherThumb,
  scientist: ScientistThumb,
  engineer: EngineerThumb,
  // Batch 6
  sidebar: SidebarThumb,
  card: CardThumb,
  zigzag: ZigzagThumb,
  ribbon: RibbonThumb,
  mosaic: MosaicThumb,
};

export function TemplateThumbnail({ template, className = '' }: TemplateThumbnailProps) {
  const Thumb = thumbnails[template] || ClassicThumb;
  return (
    <div className={`overflow-hidden rounded-md bg-white ${className}`}>
      <Thumb />
    </div>
  );
}
