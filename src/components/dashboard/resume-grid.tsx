'use client';

import type { Resume } from '@/types/resume';
import { ResumeCard } from './resume-card';

interface ResumeGridProps {
  resumes: Resume[];
  onDelete: (id: string) => Promise<boolean>;
  onDuplicate: (id: string) => Promise<Resume | null>;
}

export function ResumeGrid({ resumes, onDelete, onDuplicate }: ResumeGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {resumes.map((resume) => (
        <ResumeCard
          key={resume.id}
          resume={resume}
          onDelete={() => onDelete(resume.id)}
          onDuplicate={() => onDuplicate(resume.id)}
        />
      ))}
    </div>
  );
}
