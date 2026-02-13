export interface PdfExportOptions {
  pageSize: 'a4' | 'letter';
  margins: { top: number; right: number; bottom: number; left: number };
  showWatermark: boolean;
  watermarkText?: string;
  headerText?: string;
  footerText?: string;
}
