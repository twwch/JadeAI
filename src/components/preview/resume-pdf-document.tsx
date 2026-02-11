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
import { isSectionEmpty } from './utils';

// Register Noto Sans SC (static OTF) for CJK support
Font.register({
  family: 'NotoSansSC',
  fonts: [
    { src: '/fonts/NotoSansSC-Regular.otf', fontWeight: 400 },
    { src: '/fonts/NotoSansSC-Bold.otf', fontWeight: 700 },
  ],
});

const ACCENT = '#e94560';
const DARK = '#1a1a2e';
const DARK_MID = '#0f3460';

const PAGE_PADDING = 32;

const s = StyleSheet.create({
  page: { fontFamily: 'NotoSansSC', fontSize: 10, color: '#27272a', paddingTop: PAGE_PADDING, paddingBottom: PAGE_PADDING },
  // Header (modern) — negative marginTop to cancel page padding on page 1
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

export function ResumePdfDocument({ resume }: { resume: Resume }) {
  const isModern = resume.template === 'modern';
  const personalInfo = resume.sections.find((sec) => sec.type === 'personal_info');
  const pi = (personalInfo?.content || {}) as PersonalInfoContent;

  const visibleSections = resume.sections.filter(
    (sec) => sec.visible && sec.type !== 'personal_info' && !isSectionEmpty(sec)
  );

  const contacts = [pi.email, pi.phone, pi.location, pi.website].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        {isModern ? (
          <View style={s.header}>
            <View style={s.headerRow}>
              {pi.avatar ? <Image src={pi.avatar} style={s.avatar} /> : null}
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{pi.fullName || 'Your Name'}</Text>
                {pi.jobTitle ? <Text style={s.jobTitle}>{pi.jobTitle}</Text> : null}
                <View style={s.contactRow}>
                  {contacts.map((c, i) => (
                    <Text key={i}>
                      {c}
                      {i < contacts.length - 1 ? '  |  ' : ''}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
            <View style={s.headerAccentLine} />
          </View>
        ) : (
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
        )}

        {/* Body */}
        <View style={s.body}>
          {visibleSections.map((section) => {
            const titleEl = isModern ? (
              <View style={s.sectionHeader}>
                <View style={s.sectionDash} />
                <Text style={s.sectionTitle}>{section.title}</Text>
              </View>
            ) : (
              <Text style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
                borderBottomWidth: 0.5, borderBottomColor: '#d4d4d8', paddingBottom: 3, marginBottom: 6, color: '#27272a',
              }}>
                {section.title}
              </Text>
            );
            return (
              <View key={section.id} style={s.section}>
                <PdfSectionContent section={section} isModern={isModern} title={titleEl} />
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}

function PdfSectionContent({ section, isModern, title }: { section: any; isModern: boolean; title: React.ReactNode }) {
  const content = section.content;

  // Helper: render title inside the first wrap={false} block so they never separate
  const renderItems = (items: any[], renderItem: (item: any) => React.ReactNode, itemStyle: any) => (
    <View>
      {items.map((item: any, idx: number) => (
        <View key={item.id} wrap={false} style={itemStyle}>
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
          <Text style={s.bold}>{item.position}</Text>
          <Text style={isModern ? s.datePill : s.textSm}>
            {item.startDate} - {item.current ? 'Present' : item.endDate}
          </Text>
        </View>
        {item.company ? <Text style={isModern ? s.accent : s.text}>{item.company}</Text> : null}
        {item.description ? <Text style={[s.text, { marginTop: 2 }]}>{item.description}</Text> : null}
        {item.highlights?.map((h: string, i: number) => (
          <View key={i} style={s.bulletItem}>
            <Text style={s.bullet}>•</Text>
            <Text style={[s.text, { flex: 1 }]}>{h}</Text>
          </View>
        ))}
      </>
    ), isModern ? s.itemCard : s.mb4);
  }

  if (section.type === 'education') {
    const items = (content as EducationContent).items || [];
    return renderItems(items, (item) => (
      <>
        <View style={s.itemHeader}>
          <Text style={s.bold}>{item.institution}</Text>
          <Text style={isModern ? s.datePill : s.textSm}>
            {item.startDate} - {item.endDate}
          </Text>
        </View>
        <Text style={s.text}>
          {item.degree}
          {item.field ? ` - ${item.field}` : ''}
        </Text>
        {item.gpa ? <Text style={s.textSm}>GPA: {item.gpa}</Text> : null}
      </>
    ), isModern ? s.itemCardBlue : s.mb4);
  }

  if (section.type === 'skills') {
    const categories = (content as SkillsContent).categories || [];
    if (isModern) {
      const allSkills = categories.flatMap((cat: any) => cat.skills || []);
      return (
        <View wrap={false}>
          {title}
          <View style={s.skillRow}>
            {allSkills.map((skill: string, i: number) => (
              <Text key={i} style={s.skillPill}>{skill}</Text>
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
              <Text style={s.skillLabel}>{cat.name}:</Text>
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
          <Text style={s.bold}>{item.name}</Text>
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
            <Text style={s.bullet}>•</Text>
            <Text style={[s.text, { flex: 1 }]}>{h}</Text>
          </View>
        ))}
      </>
    ), isModern ? s.itemCard : s.mb4);
  }

  if (section.type === 'certifications') {
    const items = (content as CertificationsContent).items || [];
    return renderItems(items, (item) => (
      <Text>
        <Text style={s.bold}>{item.name}</Text>
        <Text style={s.text}> — {item.issuer} ({item.date})</Text>
      </Text>
    ), isModern ? { ...s.itemCardBlue, paddingVertical: 2 } : s.mb4);
  }

  if (section.type === 'languages') {
    const items = (content as LanguagesContent).items || [];
    return renderItems(items, (item) => (
      <Text>
        <Text style={s.bold}>{item.language}</Text>
        <Text style={s.text}> — {item.proficiency}</Text>
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
