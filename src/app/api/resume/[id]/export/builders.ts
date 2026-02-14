import { esc, buildExportThemeCSS, DEFAULT_THEME, type ResumeWithSections } from './utils';
import { BACKGROUND_TEMPLATES } from '@/lib/constants';
import { buildClassicHtml } from './templates/classic';
import { buildModernHtml } from './templates/modern';
import { buildMinimalHtml } from './templates/minimal';
import { buildProfessionalHtml } from './templates/professional';
import { buildTwoColumnHtml } from './templates/two-column';
import { buildCreativeHtml } from './templates/creative';
import { buildAtsHtml } from './templates/ats';
import { buildAcademicHtml } from './templates/academic';
import { buildElegantHtml } from './templates/elegant';
import { buildExecutiveHtml } from './templates/executive';
import { buildDeveloperHtml } from './templates/developer';
import { buildDesignerHtml } from './templates/designer';
import { buildStartupHtml } from './templates/startup';
import { buildFormalHtml } from './templates/formal';
import { buildInfographicHtml } from './templates/infographic';
import { buildCompactHtml } from './templates/compact';
import { buildEuroHtml } from './templates/euro';
import { buildCleanHtml } from './templates/clean';
import { buildBoldHtml } from './templates/bold';
import { buildTimelineHtml } from './templates/timeline';
// Batch 1
import { buildNordicHtml } from './templates/nordic';
import { buildCorporateHtml } from './templates/corporate';
import { buildConsultantHtml } from './templates/consultant';
import { buildFinanceHtml } from './templates/finance';
import { buildMedicalHtml } from './templates/medical';
// Batch 2
import { buildGradientHtml } from './templates/gradient';
import { buildMetroHtml } from './templates/metro';
import { buildMaterialHtml } from './templates/material';
import { buildCoderHtml } from './templates/coder';
import { buildBlocksHtml } from './templates/blocks';
// Batch 3
import { buildMagazineHtml } from './templates/magazine';
import { buildArtisticHtml } from './templates/artistic';
import { buildRetroHtml } from './templates/retro';
import { buildNeonHtml } from './templates/neon';
import { buildWatercolorHtml } from './templates/watercolor';
// Batch 4
import { buildSwissHtml } from './templates/swiss';
import { buildJapaneseHtml } from './templates/japanese';
import { buildBerlinHtml } from './templates/berlin';
import { buildLuxeHtml } from './templates/luxe';
import { buildRoseHtml } from './templates/rose';
// Batch 5
import { buildArchitectHtml } from './templates/architect';
import { buildLegalHtml } from './templates/legal';
import { buildTeacherHtml } from './templates/teacher';
import { buildScientistHtml } from './templates/scientist';
import { buildEngineerHtml } from './templates/engineer';
// Batch 6
import { buildSidebarHtml } from './templates/sidebar';
import { buildCardHtml } from './templates/card';
import { buildZigzagHtml } from './templates/zigzag';
import { buildRibbonHtml } from './templates/ribbon';
import { buildMosaicHtml } from './templates/mosaic';

const TEMPLATE_BUILDERS: Record<string, (r: ResumeWithSections) => string> = {
  classic: buildClassicHtml,
  modern: buildModernHtml,
  minimal: buildMinimalHtml,
  professional: buildProfessionalHtml,
  'two-column': buildTwoColumnHtml,
  creative: buildCreativeHtml,
  ats: buildAtsHtml,
  academic: buildAcademicHtml,
  elegant: buildElegantHtml,
  executive: buildExecutiveHtml,
  developer: buildDeveloperHtml,
  designer: buildDesignerHtml,
  startup: buildStartupHtml,
  formal: buildFormalHtml,
  infographic: buildInfographicHtml,
  compact: buildCompactHtml,
  euro: buildEuroHtml,
  clean: buildCleanHtml,
  bold: buildBoldHtml,
  timeline: buildTimelineHtml,
  // Batch 1
  nordic: buildNordicHtml,
  corporate: buildCorporateHtml,
  consultant: buildConsultantHtml,
  finance: buildFinanceHtml,
  medical: buildMedicalHtml,
  // Batch 2
  gradient: buildGradientHtml,
  metro: buildMetroHtml,
  material: buildMaterialHtml,
  coder: buildCoderHtml,
  blocks: buildBlocksHtml,
  // Batch 3
  magazine: buildMagazineHtml,
  artistic: buildArtisticHtml,
  retro: buildRetroHtml,
  neon: buildNeonHtml,
  watercolor: buildWatercolorHtml,
  // Batch 4
  swiss: buildSwissHtml,
  japanese: buildJapaneseHtml,
  berlin: buildBerlinHtml,
  luxe: buildLuxeHtml,
  rose: buildRoseHtml,
  // Batch 5
  architect: buildArchitectHtml,
  legal: buildLegalHtml,
  teacher: buildTeacherHtml,
  scientist: buildScientistHtml,
  engineer: buildEngineerHtml,
  // Batch 6
  sidebar: buildSidebarHtml,
  card: buildCardHtml,
  zigzag: buildZigzagHtml,
  ribbon: buildRibbonHtml,
  mosaic: buildMosaicHtml,
};

export function generateHtml(resume: ResumeWithSections, forPdf = false): string {
  const builder = TEMPLATE_BUILDERS[resume.template] || buildClassicHtml;
  const bodyHtml = builder(resume);
  const theme = { ...DEFAULT_THEME, ...((resume as any).themeConfig || {}) };
  const themeCSS = buildExportThemeCSS(theme, resume.template);
  const isBackground = BACKGROUND_TEMPLATES.has(resume.template);

  const pdfOverrides = forPdf
    ? `/* Page margins — let CSS @page handle per-page margins */
       @page { margin: 12mm 0; }
       ${isBackground ? '@page :first { margin-top: 0; }' : ''}
       body { background: white !important; padding: 0 !important; display: block !important; }
       .resume-export { width: 100%; }
       .resume-export > div { box-shadow: none !important; ${isBackground ? 'max-width: none !important; width: 100% !important;' : 'background: white !important;'} }
       /* Smart pagination */
       [data-section] { break-inside: avoid; }
       .item, [data-section] > div > div { break-inside: avoid; }
       .rounded-lg, .border-l-2 { break-inside: avoid; }
       h2, h3 { break-after: avoid; }
       ul, ol { break-inside: avoid; }
       p { orphans: 3; widows: 3; }`
    : '';

  return `<!DOCTYPE html>
<html lang="${esc(resume.language || 'en')}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(resume.title)}</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; display: flex; justify-content: center; padding: 40px 20px; background: #f4f4f5; min-height: 100vh; }
    @media print { body { padding: 0 !important; background: white !important; } .resume-export > div { box-shadow: none !important; } }
    ${themeCSS}
    ${pdfOverrides}
  </style>
</head>
<body>
  <div class="resume-export">
    ${bodyHtml}
  </div>
</body>
</html>`;
}
