import { Document, Page, Text, View, Image, Font, StyleSheet } from '@react-pdf/renderer';
import type {
  Resume,
  PersonalInfoContent,
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
  ProjectsContent,
  CertificationsContent,
  LanguagesContent,
} from '@/types/resume';
import type { PdfExportOptions } from '@/hooks/use-pdf-export';
import { isSectionEmpty } from './utils';

// Register Noto Sans SC (static OTF) for CJK support
Font.register({
  family: 'NotoSansSC',
  fonts: [
    { src: '/fonts/NotoSansSC-Regular.otf', fontWeight: 400 },
    { src: '/fonts/NotoSansSC-Bold.otf', fontWeight: 700 },
  ],
});

// CJK-aware hyphenation: split Chinese/Japanese/Korean characters individually
// so @react-pdf can break lines at any character boundary (matching browser behavior).
const CJK_RANGE = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3000-\u303f\uff00-\uffef]/;
Font.registerHyphenationCallback((word) => {
  if (CJK_RANGE.test(word)) {
    // Split each CJK character as its own "word" so line-breaks can happen between any two
    return Array.from(word);
  }
  return [word];
});

const ACCENT = '#e94560';
const DARK = '#1a1a2e';
const DARK_MID = '#0f3460';
const PROFESSIONAL_BLUE = '#1e3a5f';
const CREATIVE_PURPLE = '#7c3aed';
const CREATIVE_ORANGE = '#f97316';

const PAGE_PADDING = 32;

// ——— Shared styles ———
const s = StyleSheet.create({
  page: { fontFamily: 'NotoSansSC', fontSize: 10, color: '#27272a', paddingTop: PAGE_PADDING, paddingBottom: PAGE_PADDING },
  // Header (modern)
  header: { backgroundColor: DARK, paddingHorizontal: 40, paddingVertical: 28, marginTop: -PAGE_PADDING, position: 'relative' },
  headerAccentLine: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: ACCENT },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, objectFit: 'cover' },
  avatarClassic: { width: 52, height: 52, borderRadius: 26, objectFit: 'cover' },
  name: { fontSize: 22, fontWeight: 700, color: '#ffffff', letterSpacing: 0.5 },
  jobTitle: { fontSize: 11, color: ACCENT, marginTop: 4, fontWeight: 400 },
  contactRow: { flexDirection: 'row', marginTop: 8, gap: 6, fontSize: 9, color: '#d4d4d8' },
  contactSep: { color: '#71717a' },
  // Body
  body: { paddingHorizontal: 32, paddingTop: 24 },
  // Section
  section: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionDash: { width: 20, height: 2, backgroundColor: ACCENT, borderRadius: 1 },
  sectionTitle: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: ACCENT },
  // Text
  text: { fontSize: 10, color: '#52525b', lineHeight: 1.6 },
  textSm: { fontSize: 9, color: '#71717a' },
  bold: { fontWeight: 700, color: '#27272a' },
  medium: { fontWeight: 500, color: '#3f3f46' },
  accent: { color: ACCENT, fontSize: 10 },
  // Work / Edu items
  itemCard: { borderLeftWidth: 2, borderLeftColor: ACCENT, paddingLeft: 12, marginBottom: 10 },
  itemCardBlue: { borderLeftWidth: 2, borderLeftColor: DARK_MID, paddingLeft: 12, marginBottom: 8 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  datePill: { backgroundColor: '#f4f4f5', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, fontSize: 9, color: '#71717a' },
  // Bullet
  bulletItem: { flexDirection: 'row', paddingLeft: 4, marginTop: 2 },
  bullet: { width: 10, fontSize: 10, color: '#52525b' },
  // Skills
  skillPill: { borderWidth: 1, borderColor: '#e4e4e7', backgroundColor: '#fafafa', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3, fontSize: 9, fontWeight: 500, color: '#3f3f46' },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  // Skills (table style for classic)
  skillTableRow: { flexDirection: 'row', marginBottom: 2 },
  skillLabel: { width: 80, fontWeight: 700, fontSize: 10, color: '#3f3f46' },
  skillValue: { flex: 1, fontSize: 10, color: '#52525b' },
  // Generic
  mb4: { marginBottom: 4 },
});

// ——— Template-specific style overrides ———
type TemplateVariant = 'classic' | 'modern' | 'minimal' | 'professional' | 'two-column' | 'creative' | 'ats' | 'academic';

// Helper to determine variant category for section rendering
function getVariant(template: string): TemplateVariant {
  const valid: TemplateVariant[] = ['classic', 'modern', 'minimal', 'professional', 'two-column', 'creative', 'ats', 'academic'];
  return valid.includes(template as TemplateVariant) ? (template as TemplateVariant) : 'classic';
}

// ——— Two-Column layout constants ———
const LEFT_TYPES_SET = new Set(['skills', 'languages', 'certifications', 'custom']);

// ————————————————————————————————————
// Main export
// ————————————————————————————————————
export function ResumePdfDocument({ resume, options }: { resume: Resume; options?: PdfExportOptions }) {
  const variant = getVariant(resume.template);
  const personalInfo = resume.sections.find((sec) => sec.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const visibleSections = resume.sections.filter(
    (sec) => sec.visible && sec.type !== 'personal_info' && !isSectionEmpty(sec)
  );

  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter((c): c is string => Boolean(c));

  const pageSize = options?.pageSize || 'A4';
  const margins = options?.margins;
  const pageStyle = margins
    ? [s.page, { paddingTop: margins.top, paddingBottom: margins.bottom, paddingLeft: margins.left, paddingRight: margins.right }]
    : s.page;

  // Two-column splits sections into left/right
  if (variant === 'two-column') {
    return <TwoColumnPdfDocument pi={pi} contacts={contacts} visibleSections={visibleSections} pageSize={pageSize} />;
  }

  return (
    <Document>
      <Page size={pageSize} style={pageStyle}>
        {/* Header Text */}
        {options?.headerText ? (
          <View style={{ position: 'absolute', top: 8, left: 0, right: 0, alignItems: 'center' }} fixed>
            <Text style={{ fontSize: 7, color: '#a1a1aa' }}>{options.headerText}</Text>
          </View>
        ) : null}

        {/* Watermark */}
        {options?.watermark && options?.watermarkText ? (
          <View style={{ position: 'absolute', top: '40%', left: 0, right: 0, alignItems: 'center', transform: 'rotate(-30deg)', opacity: 0.06 }} fixed>
            <Text style={{ fontSize: 48, fontWeight: 700, color: '#a1a1aa' }}>{options.watermarkText}</Text>
          </View>
        ) : null}

        {/* Header */}
        <PdfHeader variant={variant} pi={pi} contacts={contacts} />

        {/* Body */}
        <View style={s.body}>
          {visibleSections.map((section) => {
            const titleEl = buildSectionTitle(variant, section.title);
            return (
              <View key={section.id} style={s.section}>
                {variant === 'creative' ? (
                  <CreativePdfSectionContent section={section} title={titleEl} />
                ) : (
                  <PdfSectionContent section={section} variant={variant} title={titleEl} />
                )}
              </View>
            );
          })}
        </View>

        {/* Footer Text */}
        {options?.footerText ? (
          <View style={{ position: 'absolute', bottom: 8, left: 0, right: 0, alignItems: 'center' }} fixed>
            <Text style={{ fontSize: 7, color: '#a1a1aa' }}>{options.footerText}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

// ——— Header per variant ———
function PdfHeader({ variant, pi, contacts }: { variant: TemplateVariant; pi: PersonalInfoContent; contacts: string[] }) {
  if (variant === 'modern') {
    return (
      <View style={s.header}>
        <View style={s.headerRow}>
          {pi.avatar ? <Image src={pi.avatar} style={s.avatar} /> : null}
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{pi.fullName || 'Your Name'}</Text>
            {pi.jobTitle ? <Text style={s.jobTitle}>{pi.jobTitle}</Text> : null}
            <View style={s.contactRow}>
              {contacts.map((c, i) => (
                <Text key={i}>{c}{i < contacts.length - 1 ? '  |  ' : ''}</Text>
              ))}
            </View>
          </View>
        </View>
        <View style={s.headerAccentLine} />
      </View>
    );
  }

  if (variant === 'creative') {
    const allContacts = [pi.email, pi.phone, pi.location, pi.website, pi.linkedin, pi.github].filter(Boolean);
    return (
      <View style={{ backgroundColor: CREATIVE_PURPLE, paddingHorizontal: 40, paddingVertical: 28, marginTop: -PAGE_PADDING, position: 'relative' }}>
        {/* Decorative circles */}
        <View style={{ position: 'absolute', right: 32, top: 12, width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#ffffff', opacity: 0.1 }} />
        <View style={{ position: 'absolute', right: 60, top: 40, width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#ffffff', opacity: 0.1 }} />
        <View style={{ position: 'absolute', bottom: 8, left: 8, width: 50, height: 50, borderRadius: 25, backgroundColor: CREATIVE_ORANGE, opacity: 0.15 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {pi.avatar ? (
            <View style={{ borderRadius: 12, borderWidth: 3, borderColor: '#ffffff', opacity: 0.95, padding: 2 }}>
              <Image src={pi.avatar} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />
            </View>
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', letterSpacing: 0.5 }}>{pi.fullName || 'Your Name'}</Text>
            {pi.jobTitle ? <Text style={{ fontSize: 11, color: '#e9d5ff', marginTop: 4 }}>{pi.jobTitle}</Text> : null}
            {allContacts.length > 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 4 }}>
                {allContacts.map((c, i) => (
                  <Text key={i} style={{ fontSize: 8, color: '#ffffff', backgroundColor: '#9058f0', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>{c}</Text>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  if (variant === 'professional') {
    return (
      <View style={{ paddingHorizontal: 40, paddingTop: 8, paddingBottom: 12, marginHorizontal: 32, marginTop: -PAGE_PADDING, alignItems: 'center' }}>
        {pi.avatar ? (
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <Image src={pi.avatar} style={{ width: 56, height: 56, borderRadius: 28, objectFit: 'cover' }} />
          </View>
        ) : null}
        <Text style={{ fontSize: 22, fontWeight: 700, color: PROFESSIONAL_BLUE, letterSpacing: 1 }}>{pi.fullName || 'Your Name'}</Text>
        {pi.jobTitle ? <Text style={{ fontSize: 11, color: '#71717a', marginTop: 3, textTransform: 'uppercase', letterSpacing: 2 }}>{pi.jobTitle}</Text> : null}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 6, fontSize: 9, color: '#71717a' }}>
          {contacts.map((c, i) => (
            <Text key={i}>{c}{i < contacts.length - 1 ? '  |  ' : ''}</Text>
          ))}
        </View>
        <View style={{ height: 2, width: '100%', backgroundColor: PROFESSIONAL_BLUE, marginTop: 10 }} />
      </View>
    );
  }

  if (variant === 'ats') {
    return (
      <View style={{ paddingHorizontal: 40, paddingTop: 8, paddingBottom: 8, marginHorizontal: 32, marginTop: -PAGE_PADDING, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 700, color: '#000000' }}>{pi.fullName || 'Your Name'}</Text>
        {pi.jobTitle ? <Text style={{ fontSize: 11, color: '#3f3f46', marginTop: 2 }}>{pi.jobTitle}</Text> : null}
        <Text style={{ fontSize: 9, color: '#52525b', marginTop: 4 }}>{contacts.join(' | ')}</Text>
        <View style={{ height: 1, width: '100%', backgroundColor: '#000000', marginTop: 8 }} />
      </View>
    );
  }

  if (variant === 'academic') {
    return (
      <View style={{ paddingHorizontal: 40, paddingTop: 8, paddingBottom: 8, marginHorizontal: 32, marginTop: -PAGE_PADDING, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 700, color: '#27272a', letterSpacing: 0.5 }}>{pi.fullName || 'Your Name'}</Text>
        {pi.jobTitle ? <Text style={{ fontSize: 10, color: '#71717a', marginTop: 2 }}>{pi.jobTitle}</Text> : null}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4, marginTop: 4, fontSize: 8, color: '#71717a' }}>
          {contacts.map((c, i) => <Text key={i}>{c}{i < contacts.length - 1 ? '  \u00B7  ' : ''}</Text>)}
        </View>
        <View style={{ height: 2, width: '100%', backgroundColor: '#27272a', marginTop: 8 }} />
      </View>
    );
  }

  if (variant === 'minimal') {
    return (
      <View style={{ paddingHorizontal: 40, paddingTop: 8, paddingBottom: 16, marginHorizontal: 32, marginTop: -PAGE_PADDING }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {pi.avatar ? <Image src={pi.avatar} style={{ width: 40, height: 40, borderRadius: 20, objectFit: 'cover' }} /> : null}
          <View>
            <Text style={{ fontSize: 16, fontWeight: 500, color: '#18181b' }}>{pi.fullName || 'Your Name'}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 3, fontSize: 9, color: '#71717a' }}>
              {pi.jobTitle ? <Text>{pi.jobTitle}</Text> : null}
              {contacts.map((c, i) => <Text key={i}>{c}</Text>)}
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Classic (default)
  return (
    <View style={{ paddingHorizontal: 40, paddingTop: 8, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: '#27272a', marginHorizontal: 40, marginTop: -PAGE_PADDING }}>
      {pi.avatar ? (
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Image src={pi.avatar} style={s.avatarClassic} />
        </View>
      ) : null}
      <Text style={{ fontSize: 20, fontWeight: 700, textAlign: 'center' }}>{pi.fullName || 'Your Name'}</Text>
      {pi.jobTitle ? <Text style={{ fontSize: 12, color: '#52525b', textAlign: 'center', marginTop: 3 }}>{pi.jobTitle}</Text> : null}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 6, fontSize: 9, color: '#71717a' }}>
        {contacts.map((c, i) => <Text key={i}>{c}</Text>)}
      </View>
    </View>
  );
}

// ——— Section title per variant ———
function buildSectionTitle(variant: TemplateVariant, title: string): React.ReactNode {
  if (variant === 'modern') {
    return (
      <View style={s.sectionHeader}>
        <View style={s.sectionDash} />
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
    );
  }

  if (variant === 'creative') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <View style={{ width: 2, height: 14, backgroundColor: CREATIVE_PURPLE, borderRadius: 1 }} />
        <Text style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: CREATIVE_PURPLE }}>{title}</Text>
      </View>
    );
  }

  if (variant === 'professional') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Text style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: PROFESSIONAL_BLUE }}>{title}</Text>
        <View style={{ flex: 1, height: 0.5, backgroundColor: '#d4d4d8' }} />
      </View>
    );
  }

  if (variant === 'ats') {
    return (
      <Text style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#000000', borderBottomWidth: 1, borderBottomColor: '#000000', paddingBottom: 2, marginBottom: 6 }}>
        {title}
      </Text>
    );
  }

  if (variant === 'academic') {
    return (
      <Text style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#27272a', borderBottomWidth: 0.5, borderBottomColor: '#d4d4d8', paddingBottom: 2, marginBottom: 4 }}>
        {title}
      </Text>
    );
  }

  if (variant === 'minimal') {
    return (
      <Text style={{ fontSize: 9, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 2, color: '#a1a1aa', marginBottom: 6 }}>
        {title}
      </Text>
    );
  }

  // Classic
  return (
    <Text style={{
      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
      borderBottomWidth: 0.5, borderBottomColor: '#d4d4d8', paddingBottom: 3, marginBottom: 6, color: '#27272a',
    }}>
      {title}
    </Text>
  );
}

// ——— Determine item style per variant ———
function itemStyle(variant: TemplateVariant, sectionType: string): any {
  if (variant === 'modern') {
    if (sectionType === 'work_experience') return s.itemCard;
    return s.itemCardBlue;
  }
  if (variant === 'creative') {
    return { borderLeftWidth: 2, borderLeftColor: CREATIVE_PURPLE, paddingLeft: 12, marginBottom: 10 };
  }
  if (variant === 'professional') {
    return { marginBottom: 8 };
  }
  return s.mb4;
}

// ——— Section content renderer (handles all variants) ———
function PdfSectionContent({ section, variant, title }: { section: any; variant: TemplateVariant; title: React.ReactNode }) {
  const content = section.content;
  const isModern = variant === 'modern';

  const renderItems = (items: any[], renderItem: (item: any) => React.ReactNode, iStyle: any) => (
    <View>
      {items.map((item: any, idx: number) => (
        <View key={item.id} wrap={false} style={iStyle}>
          {idx === 0 && title}
          {renderItem(item)}
        </View>
      ))}
    </View>
  );

  if (section.type === 'summary') {
    return (
      <View wrap={false}>
        {title}
        <Text style={s.text}>{(content as SummaryContent).text}</Text>
      </View>
    );
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return renderItems(items, (item) => (
      <>
        <View style={s.itemHeader}>
          <Text style={variant === 'professional' ? { fontWeight: 700, color: PROFESSIONAL_BLUE } : s.bold}>{item.position}</Text>
          <Text style={isModern ? s.datePill : s.textSm}>
            {item.startDate} - {item.current ? 'Present' : item.endDate}
          </Text>
        </View>
        {item.company ? <Text style={isModern ? s.accent : variant === 'creative' ? { color: CREATIVE_PURPLE, fontSize: 10 } : s.text}>{item.company}</Text> : null}
        {item.description ? <Text style={[s.text, { marginTop: 2 }]}>{item.description}</Text> : null}
        {item.highlights?.map((h: string, i: number) => (
          <View key={i} style={s.bulletItem}>
            <Text style={s.bullet}>{'\u2022'}</Text>
            <Text style={[s.text, { flex: 1 }]}>{h}</Text>
          </View>
        ))}
      </>
    ), itemStyle(variant, 'work_experience'));
  }

  if (section.type === 'education') {
    const items = (content as EducationContent).items || [];
    return renderItems(items, (item) => (
      <>
        <View style={s.itemHeader}>
          <Text style={variant === 'academic' ? { fontWeight: 700, color: '#27272a' } : s.bold}>{variant === 'academic' ? item.degree : item.institution}</Text>
          <Text style={isModern ? s.datePill : s.textSm}>{item.startDate} - {item.endDate}</Text>
        </View>
        <Text style={s.text}>
          {variant === 'academic' ? item.institution : item.degree}
          {item.field ? ` - ${item.field}` : ''}
        </Text>
        {item.gpa ? <Text style={s.textSm}>GPA: {item.gpa}</Text> : null}
      </>
    ), itemStyle(variant, 'education'));
  }

  if (section.type === 'skills') {
    const categories = (content as SkillsContent).categories || [];
    if (isModern || variant === 'creative') {
      const allSkills = categories.flatMap((cat: any) => cat.skills || []);
      return (
        <View wrap={false}>
          {title}
          <View style={s.skillRow}>
            {allSkills.map((skill: string, i: number) => (
              <Text key={i} style={variant === 'creative' ? { ...s.skillPill, borderColor: CREATIVE_PURPLE, color: CREATIVE_PURPLE } : s.skillPill}>{skill}</Text>
            ))}
          </View>
        </View>
      );
    }
    return (
      <View wrap={false}>
        {title}
        <View>
          {categories.map((cat: any) => (
            <View key={cat.id} style={s.skillTableRow}>
              <Text style={{ ...s.skillLabel, ...(variant === 'professional' ? { color: PROFESSIONAL_BLUE } : {}) }}>{cat.name}:</Text>
              <Text style={s.skillValue}>{cat.skills?.join(', ')}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (section.type === 'projects') {
    const items = (content as ProjectsContent).items || [];
    return renderItems(items, (item) => (
      <>
        <View style={s.itemHeader}>
          <Text style={variant === 'professional' ? { fontWeight: 700, color: PROFESSIONAL_BLUE } : s.bold}>{item.name}</Text>
          {item.startDate ? (
            <Text style={isModern ? s.datePill : s.textSm}>
              {item.startDate}{item.endDate ? ` - ${item.endDate}` : ''}
            </Text>
          ) : null}
        </View>
        {item.description ? <Text style={[s.text, { marginTop: 2 }]}>{item.description}</Text> : null}
        {item.technologies?.length > 0 ? (
          <Text style={[s.textSm, { marginTop: 1 }]}>Tech: {item.technologies.join(', ')}</Text>
        ) : null}
        {item.highlights?.map((h: string, i: number) => (
          <View key={i} style={s.bulletItem}>
            <Text style={s.bullet}>{'\u2022'}</Text>
            <Text style={[s.text, { flex: 1 }]}>{h}</Text>
          </View>
        ))}
      </>
    ), itemStyle(variant, 'projects'));
  }

  if (section.type === 'certifications') {
    const items = (content as CertificationsContent).items || [];
    return renderItems(items, (item) => (
      <Text>
        <Text style={variant === 'professional' ? { fontWeight: 700, color: PROFESSIONAL_BLUE } : s.bold}>{item.name}</Text>
        <Text style={s.text}> {'\u2014'} {item.issuer} ({item.date})</Text>
      </Text>
    ), isModern ? { ...s.itemCardBlue, paddingVertical: 2 } : s.mb4);
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return renderItems(items, (item) => (
      <Text>
        <Text style={s.bold}>{item.language}</Text>
        <Text style={s.text}> {'\u2014'} {item.proficiency}</Text>
      </Text>
    ), isModern ? { ...s.itemCardBlue, paddingVertical: 2 } : s.mb4);
  }

  // Generic fallback
  if (content.items) {
    return renderItems(content.items, (item) => (
      <>
        <Text style={s.bold}>{item.name || item.title || item.language}</Text>
        {item.description ? <Text style={s.text}>{item.description}</Text> : null}
      </>
    ), isModern ? s.itemCardBlue : s.mb4);
  }

  return null;
}

// ——— Creative template section renderer ———
function CreativePdfSectionContent({ section, title }: { section: any; title: React.ReactNode }) {
  const content = section.content;

  const cardStyle = {
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  };

  if (section.type === 'summary') {
    return (
      <View wrap={false}>
        {title}
        <View style={{ backgroundColor: '#fafafa', borderRadius: 6, padding: 10 }}>
          <Text style={{ fontSize: 10, color: '#52525b', lineHeight: 1.6 }}>
            {(content as SummaryContent).text}
          </Text>
        </View>
      </View>
    );
  }

  if (section.type === 'work_experience') {
    const items = (content as WorkExperienceContent).items || [];
    return (
      <View>
        {items.map((item: any, idx: number) => (
          <View key={item.id} wrap={false} style={{ ...cardStyle, borderLeftWidth: 3, borderLeftColor: CREATIVE_PURPLE }}>
            {idx === 0 && title}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: 700, fontSize: 10, color: '#27272a' }}>{item.position}</Text>
              <View style={{ backgroundColor: CREATIVE_PURPLE, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ fontSize: 8, fontWeight: 600, color: '#ffffff' }}>
                  {item.startDate} – {item.current ? 'Present' : item.endDate}
                </Text>
              </View>
            </View>
            {item.company ? <Text style={{ fontSize: 10, color: CREATIVE_PURPLE, fontWeight: 500 }}>{item.company}</Text> : null}
            {item.description ? <Text style={{ fontSize: 10, color: '#52525b', marginTop: 2, lineHeight: 1.6 }}>{item.description}</Text> : null}
            {item.highlights?.map((h: string, i: number) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 2, paddingLeft: 4 }}>
                <Text style={{ fontSize: 8, color: CREATIVE_PURPLE, marginRight: 6, marginTop: 2 }}>{'\u25CF'}</Text>
                <Text style={{ fontSize: 10, color: '#52525b', flex: 1, lineHeight: 1.6 }}>{h}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  if (section.type === 'education') {
    const items = (content as EducationContent).items || [];
    return (
      <View>
        {items.map((item: any, idx: number) => (
          <View key={item.id} wrap={false} style={cardStyle}>
            {idx === 0 && title}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: 700, fontSize: 10, color: '#27272a' }}>{item.institution}</Text>
              <Text style={{ fontSize: 9, color: '#a1a1aa' }}>{item.startDate} – {item.endDate}</Text>
            </View>
            <Text style={{ fontSize: 10, color: '#52525b' }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</Text>
            {item.gpa ? <Text style={{ fontSize: 9, color: '#71717a' }}>GPA: {item.gpa}</Text> : null}
            {item.highlights?.map((h: string, i: number) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 2, paddingLeft: 4 }}>
                <Text style={{ fontSize: 8, color: CREATIVE_PURPLE, marginRight: 6, marginTop: 2 }}>{'\u25CF'}</Text>
                <Text style={{ fontSize: 10, color: '#52525b', flex: 1, lineHeight: 1.6 }}>{h}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  if (section.type === 'skills') {
    const categories = (content as SkillsContent).categories || [];
    return (
      <View wrap={false}>
        {title}
        {categories.map((cat: any) => (
          <View key={cat.id} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#71717a', marginBottom: 4 }}>{cat.name}</Text>
            {(cat.skills || []).map((skill: string, i: number) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                <Text style={{ width: 80, fontSize: 9, color: '#3f3f46' }}>{skill}</Text>
                <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: '#f4f4f5' }}>
                  <View style={{ height: 6, borderRadius: 3, backgroundColor: CREATIVE_PURPLE, width: `${Math.max(60, 100 - i * 8)}%` }} />
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  if (section.type === 'projects') {
    const items = (content as ProjectsContent).items || [];
    return (
      <View>
        {title}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {items.map((item: any) => (
            <View key={item.id} wrap={false} style={{ ...cardStyle, width: '48%' }}>
              <Text style={{ fontWeight: 700, fontSize: 10, color: CREATIVE_PURPLE }}>{item.name}</Text>
              {item.description ? <Text style={{ fontSize: 10, color: '#52525b', marginTop: 2, lineHeight: 1.6 }}>{item.description}</Text> : null}
              {item.technologies?.length > 0 ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
                  {item.technologies.map((t: string, i: number) => (
                    <View key={i} style={{ backgroundColor: CREATIVE_PURPLE, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 7, color: '#ffffff', fontWeight: 500 }}>{t}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
              {item.highlights?.map((h: string, i: number) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 2, paddingLeft: 4 }}>
                  <Text style={{ fontSize: 8, color: CREATIVE_PURPLE, marginRight: 6, marginTop: 2 }}>{'\u25CF'}</Text>
                  <Text style={{ fontSize: 10, color: '#52525b', flex: 1, lineHeight: 1.6 }}>{h}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (section.type === 'certifications') {
    const items = (content as CertificationsContent).items || [];
    return (
      <View wrap={false}>
        {title}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {items.map((item: any) => (
            <View key={item.id} style={{ borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: 700, color: CREATIVE_PURPLE }}>{item.name}</Text>
              <Text style={{ fontSize: 9, color: '#71717a' }}>{item.issuer}{item.date ? ` | ${item.date}` : ''}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return (
      <View wrap={false}>
        {title}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {items.map((item: any) => (
            <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: CREATIVE_PURPLE }} />
              <Text style={{ fontSize: 10, fontWeight: 500, color: '#3f3f46' }}>{item.language}</Text>
              <Text style={{ fontSize: 9, color: '#a1a1aa' }}>{item.proficiency}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Custom section
  if (section.type === 'custom') {
    const items = content.items || [];
    return (
      <View>
        {items.map((item: any, idx: number) => (
          <View key={item.id} wrap={false} style={cardStyle}>
            {idx === 0 && title}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontWeight: 700, fontSize: 10, color: CREATIVE_PURPLE }}>{item.title}</Text>
              {item.date ? <Text style={{ fontSize: 9, color: '#a1a1aa' }}>{item.date}</Text> : null}
            </View>
            {item.subtitle ? <Text style={{ fontSize: 10, color: '#71717a' }}>{item.subtitle}</Text> : null}
            {item.description ? <Text style={{ fontSize: 10, color: '#52525b', marginTop: 2, lineHeight: 1.6 }}>{item.description}</Text> : null}
          </View>
        ))}
      </View>
    );
  }

  // Generic fallback
  if (content.items) {
    return (
      <View>
        {content.items.map((item: any, idx: number) => (
          <View key={item.id} wrap={false} style={cardStyle}>
            {idx === 0 && title}
            <Text style={{ fontWeight: 700, fontSize: 10, color: CREATIVE_PURPLE }}>{item.name || item.title || item.language}</Text>
            {item.description ? <Text style={{ fontSize: 10, color: '#52525b' }}>{item.description}</Text> : null}
          </View>
        ))}
      </View>
    );
  }

  return null;
}

// ——— Two-Column PDF layout ———
function TwoColumnPdfDocument({ pi, contacts, visibleSections, pageSize = 'A4' }: { pi: PersonalInfoContent; contacts: string[]; visibleSections: any[]; pageSize?: 'A4' | 'LETTER' }) {
  const leftSections = visibleSections.filter((sec) => LEFT_TYPES_SET.has(sec.type));
  const rightSections = visibleSections.filter((sec) => !LEFT_TYPES_SET.has(sec.type));

  const leftWidth = '35%';
  const rightWidth = '65%';

  return (
    <Document>
      <Page size={pageSize} style={[s.page, { paddingTop: 0, paddingBottom: 0 }]}>
        <View style={{ flexDirection: 'row', minHeight: '100%' }}>
          {/* Left Column */}
          <View style={{ width: leftWidth, backgroundColor: DARK, paddingHorizontal: 16, paddingVertical: 24 }}>
            {/* Avatar & Name */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              {pi.avatar ? <Image src={pi.avatar} style={{ width: 56, height: 56, borderRadius: 28, objectFit: 'cover', marginBottom: 8 }} /> : null}
              <Text style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', textAlign: 'center' }}>{pi.fullName || 'Your Name'}</Text>
              {pi.jobTitle ? <Text style={{ fontSize: 9, color: '#a1a1aa', marginTop: 2, textAlign: 'center' }}>{pi.jobTitle}</Text> : null}
            </View>

            {/* Contacts */}
            <View style={{ marginBottom: 16 }}>
              {contacts.map((c, i) => (
                <Text key={i} style={{ fontSize: 8, color: '#d4d4d8', marginBottom: 2 }}>{c}</Text>
              ))}
            </View>

            {/* Left sections */}
            {leftSections.map((section) => (
              <View key={section.id} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#ffffff', borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.2)', paddingBottom: 2, marginBottom: 6 }}>
                  {section.title}
                </Text>
                <TwoColLeftContent section={section} />
              </View>
            ))}
          </View>

          {/* Right Column */}
          <View style={{ width: rightWidth, paddingHorizontal: 20, paddingVertical: 24 }}>
            {rightSections.map((section) => (
              <View key={section.id} style={s.section}>
                <Text style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: DARK, borderBottomWidth: 1.5, borderBottomColor: DARK, paddingBottom: 2, marginBottom: 6 }}>
                  {section.title}
                </Text>
                <PdfSectionContent section={section} variant="classic" title={null} />
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

function TwoColLeftContent({ section }: { section: any }) {
  const content = section.content;

  if (section.type === 'skills') {
    const categories = (content as SkillsContent).categories || [];
    return (
      <View>
        {categories.map((cat: any) => (
          <View key={cat.id} style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 9, fontWeight: 700, color: '#d4d4d8', marginBottom: 2 }}>{cat.name}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
              {(cat.skills || []).map((skill: string, i: number) => (
                <Text key={i} style={{ fontSize: 8, color: '#a1a1aa', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, paddingHorizontal: 4, paddingVertical: 1 }}>{skill}</Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return (
      <View>
        {items.map((item: any) => (
          <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
            <Text style={{ fontSize: 9, color: '#d4d4d8' }}>{item.language}</Text>
            <Text style={{ fontSize: 8, color: '#a1a1aa' }}>{item.proficiency}</Text>
          </View>
        ))}
      </View>
    );
  }

  if (section.type === 'certifications') {
    const items = (content as CertificationsContent).items || [];
    return (
      <View>
        {items.map((item: any) => (
          <View key={item.id} style={{ marginBottom: 3 }}>
            <Text style={{ fontSize: 9, fontWeight: 700, color: '#d4d4d8' }}>{item.name}</Text>
            <Text style={{ fontSize: 8, color: '#a1a1aa' }}>{item.issuer}{item.date ? ` (${item.date})` : ''}</Text>
          </View>
        ))}
      </View>
    );
  }

  // Generic / custom
  if (content.items) {
    return (
      <View>
        {content.items.map((item: any) => (
          <View key={item.id} style={{ marginBottom: 3 }}>
            <Text style={{ fontSize: 9, fontWeight: 700, color: '#d4d4d8' }}>{item.name || item.title || item.language}</Text>
            {item.description ? <Text style={{ fontSize: 8, color: '#a1a1aa' }}>{item.description}</Text> : null}
          </View>
        ))}
      </View>
    );
  }

  return null;
}
