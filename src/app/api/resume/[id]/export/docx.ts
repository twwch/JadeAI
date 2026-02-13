import type {
  PersonalInfoContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
  ProjectsContent,
  CertificationsContent,
  LanguagesContent,
  SummaryContent,
  CustomContent,
} from '@/types/resume';
import { esc, safe, type ResumeWithSections, type Section } from './utils';

function renderSectionHtml(section: Section): string {
  if (!section.visible) return '';

  switch (section.type) {
    case 'personal_info': {
      const info = section.content as PersonalInfoContent;
      let html = '<div class="personal-info">';
      if (info.fullName) html += `<h1>${esc(info.fullName)}</h1>`;
      if (info.jobTitle) html += `<p class="job-title">${esc(info.jobTitle)}</p>`;
      const contactParts: string[] = [];
      if (info.email) contactParts.push(esc(info.email));
      if (info.phone) contactParts.push(esc(info.phone));
      if (info.location) contactParts.push(esc(info.location));
      if (contactParts.length) html += `<p class="contact">${contactParts.join(' &bull; ')}</p>`;
      if (info.website) html += `<p class="links"><a href="${esc(info.website)}">${esc(info.website)}</a></p>`;
      html += '</div>';
      return html;
    }
    case 'summary': {
      const summary = section.content as SummaryContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      if (summary.text) html += `<p>${esc(summary.text)}</p>`;
      html += '</div>';
      return html;
    }
    case 'work_experience': {
      const work = section.content as WorkExperienceContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const item of work.items || []) {
        html += '<div class="item">';
        html += `<div class="item-header"><strong>${esc(item.position)}</strong> at ${esc(item.company)}`;
        const dateRange = item.current ? `${safe(item.startDate)} - Present` : `${safe(item.startDate)} - ${safe(item.endDate)}`;
        html += `<span class="date">${esc(dateRange)}</span></div>`;
        if (item.location) html += `<div class="location">${esc(item.location)}</div>`;
        if (item.description) html += `<p>${esc(item.description)}</p>`;
        if (item.highlights?.length) {
          html += '<ul>';
          for (const h of item.highlights) if (h) html += `<li>${esc(h)}</li>`;
          html += '</ul>';
        }
        html += '</div>';
      }
      html += '</div>';
      return html;
    }
    case 'education': {
      const edu = section.content as EducationContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const item of edu.items || []) {
        html += '<div class="item">';
        html += `<div class="item-header"><strong>${esc(item.degree)}</strong> in ${esc(item.field)}, ${esc(item.institution)}`;
        html += `<span class="date">${esc(item.startDate)} - ${esc(item.endDate)}</span></div>`;
        if (item.location) html += `<div class="location">${esc(item.location)}</div>`;
        if (item.gpa) html += `<p>GPA: ${esc(item.gpa)}</p>`;
        if (item.highlights?.length) {
          html += '<ul>';
          for (const h of item.highlights) if (h) html += `<li>${esc(h)}</li>`;
          html += '</ul>';
        }
        html += '</div>';
      }
      html += '</div>';
      return html;
    }
    case 'skills': {
      const skills = section.content as SkillsContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const cat of skills.categories || []) {
        html += `<p><strong>${esc(cat.name)}:</strong> ${esc((cat.skills || []).join(', '))}</p>`;
      }
      html += '</div>';
      return html;
    }
    case 'projects': {
      const projects = section.content as ProjectsContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const item of projects.items || []) {
        html += '<div class="item">';
        html += `<div class="item-header"><strong>${esc(item.name)}</strong>`;
        if (item.url) html += ` <a href="${esc(item.url)}">${esc(item.url)}</a>`;
        if (item.startDate) {
          html += `<span class="date">${esc(item.startDate)}${item.endDate ? ` - ${esc(item.endDate)}` : ''}</span>`;
        }
        html += '</div>';
        if (item.description) html += `<p>${esc(item.description)}</p>`;
        if (item.technologies?.length) html += `<p class="tech">Technologies: ${esc(item.technologies.join(', '))}</p>`;
        if (item.highlights?.length) {
          html += '<ul>';
          for (const h of item.highlights) if (h) html += `<li>${esc(h)}</li>`;
          html += '</ul>';
        }
        html += '</div>';
      }
      html += '</div>';
      return html;
    }
    case 'certifications': {
      const certs = section.content as CertificationsContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const item of certs.items || []) {
        html += `<p><strong>${esc(item.name)}</strong> - ${esc(item.issuer)} (${esc(item.date)})</p>`;
      }
      html += '</div>';
      return html;
    }
    case 'languages': {
      const langs = section.content as LanguagesContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const item of langs.items || []) {
        html += `<p>${esc(item.language)}: ${esc(item.proficiency)}</p>`;
      }
      html += '</div>';
      return html;
    }
    default: {
      const custom = section.content as CustomContent;
      let html = `<div class="section"><h2>${esc(section.title)}</h2>`;
      for (const item of (custom as any).items || []) {
        html += '<div class="item">';
        html += `<div class="item-header"><strong>${esc(item.title)}</strong>`;
        if (item.subtitle) html += ` - ${esc(item.subtitle)}`;
        if (item.date) html += `<span class="date">${esc(item.date)}</span>`;
        html += '</div>';
        if (item.description) html += `<p>${esc(item.description)}</p>`;
        html += '</div>';
      }
      html += '</div>';
      return html;
    }
  }
}

export function generateDocx(resume: ResumeWithSections): string {
  const sectionsHtml = resume.sections.map(renderSectionHtml).join('\n');

  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8">
  <meta name="ProgId" content="Word.Document">
  <meta name="Generator" content="JadeAI">
  <!--[if gte mso 9]>
  <xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml>
  <![endif]-->
  <style>
    body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; color: #333; line-height: 1.6; }
    .personal-info { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 12px; }
    .personal-info h1 { font-size: 24pt; color: #1a1a1a; margin-bottom: 2px; }
    .job-title { font-size: 12pt; color: #555; margin-bottom: 6px; }
    .contact { font-size: 10pt; color: #666; }
    .links { font-size: 10pt; margin-top: 4px; }
    .links a { color: #2563eb; }
    .section { margin-bottom: 16px; }
    .section h2 { font-size: 14pt; color: #1a1a1a; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 10px; }
    .item { margin-bottom: 10px; }
    .item-header { margin-bottom: 2px; }
    .date { color: #666; font-size: 10pt; }
    .location { color: #888; font-size: 10pt; }
    ul { margin-left: 18px; margin-top: 4px; }
    li { margin-bottom: 2px; font-size: 10pt; }
    p { font-size: 10pt; margin-top: 4px; }
  </style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;
}
