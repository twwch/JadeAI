import type { ResumeSection } from './resume';

export interface EditorState {
  selectedSectionId: string | null;
  selectedItemId: string | null;
  isDragging: boolean;
  showAiChat: boolean;
  zoom: number;
}

export interface ResumeSnapshot {
  sections: ResumeSection[];
  timestamp: number;
}

export type DragItemType = 'section' | 'item' | 'new-section';

export interface DragData {
  type: DragItemType;
  sectionId?: string;
  itemId?: string;
  sectionType?: string;
}
