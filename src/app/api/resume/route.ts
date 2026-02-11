import { NextRequest, NextResponse } from 'next/server';
import { resumeRepository } from '@/lib/db/repositories/resume.repository';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';
import { DEFAULT_SECTIONS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resumes = await resumeRepository.findAllByUserId(user.id);
    return NextResponse.json(resumes);
  } catch (error) {
    console.error('GET /api/resume error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, template, language } = body;

    const resume = await resumeRepository.create({
      userId: user.id,
      title: title || '未命名简历',
      template: template || 'classic',
      language: language || 'zh',
    });

    if (resume) {
      const lang = resume.language || 'zh';
      for (let i = 0; i < DEFAULT_SECTIONS.length; i++) {
        const s = DEFAULT_SECTIONS[i];
        const sectionTitle = lang === 'en' ? s.titleEn : s.titleZh;
        let content: unknown = {};

        if (s.type === 'personal_info') {
          content = { fullName: '', jobTitle: '', email: '', phone: '', location: '' };
        } else if (s.type === 'summary') {
          content = { text: '' };
        } else if (s.type === 'work_experience' || s.type === 'education' || s.type === 'projects' || s.type === 'certifications' || s.type === 'languages' || s.type === 'custom') {
          content = { items: [] };
        } else if (s.type === 'skills') {
          content = { categories: [] };
        }

        await resumeRepository.createSection({
          resumeId: resume.id,
          type: s.type,
          title: sectionTitle,
          sortOrder: i,
          content,
        });
      }

      const fullResume = await resumeRepository.findById(resume.id);
      return NextResponse.json(fullResume, { status: 201 });
    }

    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  } catch (error) {
    console.error('POST /api/resume error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
