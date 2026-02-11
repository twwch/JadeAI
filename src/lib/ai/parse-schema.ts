import { z } from 'zod/v4';

export const parsedResumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().describe('Full name of the person'),
    jobTitle: z.string().describe('Current or desired job title'),
    email: z.string().describe('Email address'),
    phone: z.string().describe('Phone number'),
    location: z.string().describe('City or location'),
    website: z.string().optional().describe('Personal website URL'),
    linkedin: z.string().optional().describe('LinkedIn profile URL'),
    github: z.string().optional().describe('GitHub profile URL'),
  }),
  summary: z.string().optional().describe('Professional summary or objective'),
  workExperience: z.array(z.object({
    company: z.string().describe('Company name'),
    position: z.string().describe('Job title/position'),
    location: z.string().optional().describe('Job location'),
    startDate: z.string().describe('Start date (YYYY-MM format)'),
    endDate: z.string().nullable().describe('End date (YYYY-MM format) or null if current'),
    current: z.boolean().describe('Whether this is the current job'),
    description: z.string().describe('Job description'),
    highlights: z.array(z.string()).describe('Key achievements or responsibilities'),
  })).optional(),
  education: z.array(z.object({
    institution: z.string().describe('School or university name'),
    degree: z.string().describe('Degree type (e.g., Bachelor, Master)'),
    field: z.string().describe('Field of study'),
    location: z.string().optional().describe('School location'),
    startDate: z.string().describe('Start date (YYYY-MM format)'),
    endDate: z.string().describe('End date (YYYY-MM format)'),
    gpa: z.string().optional().describe('GPA if mentioned'),
    highlights: z.array(z.string()).describe('Relevant coursework or achievements'),
  })).optional(),
  skills: z.array(z.object({
    name: z.string().describe('Skill category name'),
    skills: z.array(z.string()).describe('List of skills in this category'),
  })).optional(),
  projects: z.array(z.object({
    name: z.string().describe('Project name'),
    url: z.string().optional().describe('Project URL'),
    startDate: z.string().optional().describe('Start date'),
    endDate: z.string().optional().describe('End date'),
    description: z.string().describe('Project description'),
    technologies: z.array(z.string()).describe('Technologies used'),
    highlights: z.array(z.string()).describe('Key highlights'),
  })).optional(),
  certifications: z.array(z.object({
    name: z.string().describe('Certification name'),
    issuer: z.string().describe('Issuing organization'),
    date: z.string().describe('Date obtained'),
    url: z.string().optional().describe('Certification URL'),
  })).optional(),
  languages: z.array(z.object({
    language: z.string().describe('Language name'),
    proficiency: z.string().describe('Proficiency level'),
  })).optional(),
});

export type ParsedResume = z.infer<typeof parsedResumeSchema>;
